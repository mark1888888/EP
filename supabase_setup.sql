-- ============================================================
--  VocabularyTraining v10 — Supabase 資料庫設定
--  執行順序：在 Supabase Dashboard > SQL Editor 貼上並執行
--
--  v10 新增：
--    • vocab_users.session_token  — 單裝置登入 token
--    • vocab_users.last_login     — 最後登入時間
--    • vocab_progress.daily_logs  — 每日練習＋遊戲記錄
--    • RPC: update_session_token  — 登入時寫入 token
--    • RPC: check_session_token   — 驗證 token 是否還有效
--    • save_progress / get_progress 更新，包含 daily_logs
-- ============================================================

-- ── 1. 使用者資料表 ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vocab_users (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  username      text        UNIQUE NOT NULL,
  display_name  text        NOT NULL,
  password_hash text        NOT NULL,          -- SHA-256 hex string
  grade         text        DEFAULT '國一',    -- 國一 / 國二 / 國三
  status        text        DEFAULT 'pending', -- pending / approved / rejected
  is_admin      boolean     DEFAULT false,
  session_token text        DEFAULT NULL,      -- 單裝置 session token (v10)
  last_login    timestamptz DEFAULT NULL,      -- 最後登入時間 (v10)
  created_at    timestamptz DEFAULT now(),
  approved_at   timestamptz
);

-- 若資料表已存在，補充新欄位（執行時若欄位已存在會顯示無害錯誤，可忽略）
ALTER TABLE vocab_users ADD COLUMN IF NOT EXISTS session_token text DEFAULT NULL;
ALTER TABLE vocab_users ADD COLUMN IF NOT EXISTS last_login    timestamptz DEFAULT NULL;

-- ── 2. 學習進度資料表 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vocab_progress (
  user_id      uuid        PRIMARY KEY REFERENCES vocab_users(id) ON DELETE CASCADE,
  my_words     jsonb       DEFAULT '[]',
  stats        jsonb       DEFAULT '{}',
  today_seen   jsonb       DEFAULT '{}',
  daily_logs   jsonb       DEFAULT '{}',      -- 每日記錄 (v10)
  last_updated timestamptz DEFAULT now()
);

-- 若資料表已存在，補充新欄位
ALTER TABLE vocab_progress ADD COLUMN IF NOT EXISTS daily_logs jsonb DEFAULT '{}';

-- ── 3. Row Level Security ────────────────────────────────────
ALTER TABLE vocab_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_progress ENABLE ROW LEVEL SECURITY;

-- 3a. 任何人都可以用 username 查詢自己的狀態（登入用）
CREATE POLICY "users: select own row"
  ON vocab_users FOR SELECT
  USING (true);

-- 3b. 任何人都可以新增使用者（註冊用）
CREATE POLICY "users: insert for registration"
  ON vocab_users FOR INSERT
  WITH CHECK (status = 'pending' AND is_admin = false);

-- 3c. 只有 SECURITY DEFINER 函式可以更新（admin 操作用）
CREATE POLICY "users: no direct update"
  ON vocab_users FOR UPDATE
  USING (false);

-- 3d. 進度表：禁止直接存取，只透過 SECURITY DEFINER 函式操作
CREATE POLICY "progress: deny direct access"
  ON vocab_progress FOR ALL
  USING (false)
  WITH CHECK (false);

-- ── 4. 安全函式：登入驗證（SECURITY DEFINER 避免暴露 hash）──
CREATE OR REPLACE FUNCTION verify_login(p_username text, p_hash text)
RETURNS TABLE(
  id            uuid,
  display_name  text,
  grade         text,
  status        text,
  is_admin      boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.display_name, u.grade, u.status, u.is_admin
  FROM vocab_users u
  WHERE u.username = p_username
    AND u.password_hash = p_hash;
END;
$$;

-- ── 4b. 安全函式：寫入 session token（登入時呼叫）── (v10)
CREATE OR REPLACE FUNCTION update_session_token(
  p_username text,
  p_hash     text,
  p_token    text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE vocab_users
  SET session_token = p_token,
      last_login    = now()
  WHERE username      = p_username
    AND password_hash = p_hash
    AND status        = 'approved';

  RETURN 'ok';
END;
$$;

-- ── 4c. 安全函式：驗證 session token（防止多裝置同時登入）── (v10)
-- 回傳 true 表示 token 有效（此裝置仍是最新登入），false 表示已被其他裝置頂掉
CREATE OR REPLACE FUNCTION check_session_token(
  p_username text,
  p_hash     text,
  p_token    text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_db_token text;
BEGIN
  SELECT session_token INTO v_db_token
  FROM vocab_users
  WHERE username      = p_username
    AND password_hash = p_hash
    AND status        = 'approved';

  -- token 符合，或資料庫 token 為空（舊版帳號未設定 token），均視為有效
  RETURN (v_db_token IS NULL OR v_db_token = p_token);
END;
$$;

-- ── 5. 安全函式：管理員審核（approve / reject）────────────────
CREATE OR REPLACE FUNCTION admin_update_status(
  p_admin_username text,
  p_admin_hash     text,
  p_target_id      uuid,
  p_new_status     text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT is_admin INTO v_is_admin
  FROM vocab_users
  WHERE username = p_admin_username
    AND password_hash = p_admin_hash
    AND status = 'approved';

  IF v_is_admin IS NULL OR NOT v_is_admin THEN
    RETURN 'unauthorized';
  END IF;

  UPDATE vocab_users
  SET status = p_new_status,
      approved_at = CASE WHEN p_new_status = 'approved' THEN now() ELSE NULL END
  WHERE id = p_target_id;

  RETURN 'ok';
END;
$$;

-- ── 6. 安全函式：管理員列出所有使用者 ───────────────────────
CREATE OR REPLACE FUNCTION admin_list_users(
  p_admin_username text,
  p_admin_hash     text
)
RETURNS TABLE(
  id           uuid,
  username     text,
  display_name text,
  grade        text,
  status       text,
  is_admin     boolean,
  created_at   timestamptz,
  approved_at  timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT u.is_admin INTO v_is_admin
  FROM vocab_users u
  WHERE u.username = p_admin_username
    AND u.password_hash = p_admin_hash
    AND u.status = 'approved';

  IF v_is_admin IS NULL OR NOT v_is_admin THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT u.id, u.username, u.display_name, u.grade, u.status,
         u.is_admin, u.created_at, u.approved_at
  FROM vocab_users u
  ORDER BY u.created_at DESC;
END;
$$;

-- ── 7. 安全函式：管理員刪除使用者 ───────────────────────────
CREATE OR REPLACE FUNCTION admin_delete_user(
  p_admin_username text,
  p_admin_hash     text,
  p_target_id      uuid
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT is_admin INTO v_is_admin
  FROM vocab_users
  WHERE username = p_admin_username
    AND password_hash = p_admin_hash
    AND status = 'approved';

  IF v_is_admin IS NULL OR NOT v_is_admin THEN
    RETURN 'unauthorized';
  END IF;

  DELETE FROM vocab_users WHERE id = p_target_id AND is_admin = false;
  RETURN 'ok';
END;
$$;

-- ── 8. 建立第一個管理員帳號 ──────────────────────────────────
-- ⚠️  執行前請先把下面的密碼改成你想要的，然後在瀏覽器的 console 執行：
--     await crypto.subtle.digest('SHA-256', new TextEncoder().encode('你的密碼'))
--       .then(b => Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''))
--
-- 以下範例：admin / Admin@1234  →  SHA-256 hash 已預先計算
INSERT INTO vocab_users (username, display_name, password_hash, grade, status, is_admin)
VALUES (
  'admin',
  '管理員',
  -- SHA-256 of "Admin@1234"
  'bc78e58d55cde1346e68f8e5fe588dedf62fa457aa646a500a53347faff6ee24',
  '國一',
  'approved',
  true
)
ON CONFLICT (username) DO NOTHING;

-- ── 9. 安全函式：讀取學習進度 ───────────────────────────────
CREATE OR REPLACE FUNCTION get_progress(p_username text, p_hash text)
RETURNS TABLE(
  my_words     jsonb,
  stats        jsonb,
  today_seen   jsonb,
  daily_logs   jsonb,
  last_updated timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM vocab_users
  WHERE username = p_username
    AND password_hash = p_hash
    AND status = 'approved';

  IF v_user_id IS NULL THEN RETURN; END IF;

  RETURN QUERY
  SELECT vp.my_words, vp.stats, vp.today_seen,
         COALESCE(vp.daily_logs, '{}'::jsonb),
         vp.last_updated
  FROM vocab_progress vp
  WHERE vp.user_id = v_user_id;
END;
$$;

-- ── 10. 安全函式：儲存學習進度 ──────────────────────────────
CREATE OR REPLACE FUNCTION save_progress(
  p_username   text,
  p_hash       text,
  p_my_words   jsonb,
  p_stats      jsonb,
  p_today_seen jsonb,
  p_daily_logs jsonb DEFAULT '{}'
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM vocab_users
  WHERE username = p_username
    AND password_hash = p_hash
    AND status = 'approved';

  IF v_user_id IS NULL THEN RETURN 'unauthorized'; END IF;

  INSERT INTO vocab_progress (user_id, my_words, stats, today_seen, daily_logs, last_updated)
  VALUES (v_user_id, p_my_words, p_stats, p_today_seen, p_daily_logs, now())
  ON CONFLICT (user_id) DO UPDATE SET
    my_words     = EXCLUDED.my_words,
    stats        = EXCLUDED.stats,
    today_seen   = EXCLUDED.today_seen,
    daily_logs   = EXCLUDED.daily_logs,
    last_updated = now();

  RETURN 'ok';
END;
$$;

-- ── 如果資料庫已存在，需要先修正 vocab_progress RLS 政策 ────
-- （若是第一次執行可忽略下面兩行）
-- DROP POLICY IF EXISTS "progress: owner access" ON vocab_progress;
-- CREATE POLICY "progress: deny direct access" ON vocab_progress FOR ALL USING (false) WITH CHECK (false);

-- ── 完成 ─────────────────────────────────────────────────────
-- 執行完畢後，回到你的 Supabase 設定頁面：
-- Project Settings > API > 複製 Project URL 和 anon public key
-- 填入 vocabulary.js 頂端的 SUPABASE_URL 和 SUPABASE_ANON_KEY
--
-- v10 新增步驟：
-- 若資料庫已是 v9（有 vocab_users / vocab_progress），只需在 SQL Editor 執行：
--   ALTER TABLE vocab_users    ADD COLUMN IF NOT EXISTS session_token text DEFAULT NULL;
--   ALTER TABLE vocab_users    ADD COLUMN IF NOT EXISTS last_login timestamptz DEFAULT NULL;
--   ALTER TABLE vocab_progress ADD COLUMN IF NOT EXISTS daily_logs jsonb DEFAULT '{}';
-- 然後重新執行 update_session_token、check_session_token、get_progress、save_progress 函式定義即可
