-- ============================================================
--  VocabularyTraining v13 — Supabase 升級腳本
--
--  用途：在既有的 v10~v12 資料庫上升級
--  1. 強化 save_progress / get_progress → 選填 p_token 參數
--     若提供 token 且與 DB 不符，拒絕寫入 → 被踢下線後殭屍分頁無法再汙染資料
--  2. 啟用 vocab_users 的 Realtime publication → 毫秒級踢下線
--
--  執行順序：在 Supabase Dashboard > SQL Editor 貼上並執行
-- ============================================================

-- ── 1. 強化 save_progress：可選驗證 session_token ───────────────
CREATE OR REPLACE FUNCTION save_progress(
  p_username   text,
  p_hash       text,
  p_my_words   jsonb,
  p_stats      jsonb,
  p_today_seen jsonb,
  p_daily_logs jsonb DEFAULT '{}',
  p_token      text  DEFAULT NULL      -- v13：選填 session token
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id  uuid;
  v_db_token text;
BEGIN
  SELECT id, session_token INTO v_user_id, v_db_token
  FROM vocab_users
  WHERE username = p_username
    AND password_hash = p_hash
    AND status = 'approved';

  IF v_user_id IS NULL THEN RETURN 'unauthorized'; END IF;

  -- v13：若 client 帶了 token，就必須與 DB 相符（防殭屍分頁汙染資料）
  IF p_token IS NOT NULL AND v_db_token IS NOT NULL AND v_db_token <> p_token THEN
    RETURN 'session_expired';
  END IF;

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

-- ── 2. 強化 get_progress：可選驗證 session_token ────────────────
CREATE OR REPLACE FUNCTION get_progress(
  p_username text,
  p_hash     text,
  p_token    text DEFAULT NULL        -- v13：選填 session token
)
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
  v_user_id  uuid;
  v_db_token text;
BEGIN
  SELECT id, session_token INTO v_user_id, v_db_token
  FROM vocab_users
  WHERE username = p_username
    AND password_hash = p_hash
    AND status = 'approved';

  IF v_user_id IS NULL THEN RETURN; END IF;

  IF p_token IS NOT NULL AND v_db_token IS NOT NULL AND v_db_token <> p_token THEN
    RETURN; -- token 不符 → 回空 (等同未找到)
  END IF;

  RETURN QUERY
  SELECT vp.my_words, vp.stats, vp.today_seen,
         COALESCE(vp.daily_logs, '{}'::jsonb),
         vp.last_updated
  FROM vocab_progress vp
  WHERE vp.user_id = v_user_id;
END;
$$;

-- ── 3. 啟用 Realtime publication（毫秒級踢下線）────────────────
-- Supabase 預設有個叫 supabase_realtime 的 publication
-- 只需把 vocab_users 加進去：
ALTER PUBLICATION supabase_realtime ADD TABLE vocab_users;

-- 注意：session_token 是比較敏感的欄位，我們只需要前端能觀察到「變了」即可。
-- 前端不會透過 Realtime 讀取 hash 或其他機密資訊（RLS 仍然生效）。

-- ── 完成 ──────────────────────────────────────────────────────
-- 驗證：
-- SELECT proname, pronargs FROM pg_proc WHERE proname IN ('save_progress','get_progress');
-- 應該看到 pronargs=7 (save_progress) 與 pronargs=3 (get_progress)
