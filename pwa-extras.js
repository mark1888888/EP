/**
 * pwa-extras.js — v13 附加功能
 *
 * 職責：
 *   1. PWA 工具列 (深色模式 / 字體 / 全螢幕 / 安裝)
 *   2. 手機底部導航列 (bottomNav) 與 switchTab 的橋接
 *   3. 滑動翻卡手勢 (vocab card)
 *   4. 網路狀態提示
 *   5. visibilitychange / pagehide — 即時驗證 session + 離開前儲存
 *   6. Supabase Realtime 訂閱 session_token 變更 — 毫秒級踢下線
 *
 * 本檔案「不修改」vocabulary.js 內任何函式，只「呼叫」與「觀察」它的 globals。
 * 需要的 globals：
 *   currentUser, currentUserHash, currentSessionToken  (vocabulary.js)
 *   _checkSession(), _dbSaveNow(), doLogout(),
 *   getSB(), showScreen(), switchTab()
 */
(function(){
'use strict';

// ── 等 vocabulary.js 的 global 載入完才初始化 ────────────────
function ready(fn){
  if (document.readyState !== 'loading') setTimeout(fn, 0);
  else document.addEventListener('DOMContentLoaded', fn);
}

// 讀取 vocabulary.js 的 `let` globals。`let` 不會掛到 window，但在 classic script 的全域 lexical scope 可直接以識別子存取。
function _cu(){ try { return currentUser; } catch(_){ return ''; } }
function _cu_id(){ try { return currentUserId; } catch(_){ return ''; } }
function _cu_hash(){ try { return currentUserHash; } catch(_){ return ''; } }
function _cu_tok(){ try { return currentSessionToken; } catch(_){ return ''; } }

// 偏好 (儲存在 localStorage，不綁帳號，因為是裝置層級)
function getPref(k, dflt){ try{ return localStorage.getItem('pwa_'+k) ?? dflt; }catch(_){ return dflt; } }
function setPref(k, v){ try{ localStorage.setItem('pwa_'+k, v); }catch(_){} }

// ── 1. 深色模式 / 字體大小 / 全螢幕 ──────────────────────────
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  var btn = document.getElementById('btnDarkMode');
  if (btn) btn.textContent = (theme === 'dark') ? '☀️' : '🌙';
  // 同步 theme-color meta (iOS 狀態列顏色)
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#1A1A1F' : '#534AB7');
}
window.togglePWADarkMode = function(){
  var cur = document.documentElement.getAttribute('data-theme') || 'light';
  var next = (cur === 'dark') ? 'light' : 'dark';
  applyTheme(next);
  setPref('theme', next);
};

var FONT_SIZES = ['s','m','l'];
function applyFontSize(sz){
  document.documentElement.setAttribute('data-fontsize', sz);
  var btn = document.getElementById('btnFontSize');
  if (btn) btn.textContent = sz === 's' ? 'A⁻' : sz === 'l' ? 'A⁺' : 'Aa';
}
window.togglePWAFontSize = function(){
  var cur = document.documentElement.getAttribute('data-fontsize') || 'm';
  var i = FONT_SIZES.indexOf(cur);
  var next = FONT_SIZES[(i + 1) % FONT_SIZES.length];
  applyFontSize(next);
  setPref('fontsize', next);
};

window.togglePWAFocusMode = function(){
  document.body.classList.toggle('focus-mode');
  var on = document.body.classList.contains('focus-mode');
  var exit = document.getElementById('focusExitBtn');
  if (exit) exit.classList.toggle('hidden', !on);
};

// ── 2. PWA 安裝 (beforeinstallprompt 在 Chromium 才會觸發) ────
window.showPWAInstallButton = function(){
  var btn = document.getElementById('btnInstallPWA');
  if (btn) btn.classList.remove('hidden');
};
window.doPWAInstall = async function(){
  var ev = window.__pwaInstallEvent;
  if (!ev) return;
  try {
    ev.prompt();
    await ev.userChoice;
  } catch(_){}
  window.__pwaInstallEvent = null;
  var btn = document.getElementById('btnInstallPWA');
  if (btn) btn.classList.add('hidden');
};

// 新版本可用時的 toast
window.showPWAUpdateToast = function(){
  if (document.getElementById('_pwaUpdateToast')) return;
  var t = document.createElement('div');
  t.id = '_pwaUpdateToast';
  t.className = 'pwa-toast';
  t.innerHTML = '<span>🎉 有新版本</span><span style="text-decoration:underline">重新整理</span>';
  t.onclick = function(){ window.location.reload(); };
  document.body.appendChild(t);
};

// ── 3. 底部導航 ──────────────────────────────────────────────
window.switchTabMobile = function(name, btn){
  // 呼叫 vocabulary.js 原本的 switchTab（它會找到對應的頂部 tab 並切換）
  var topTab = document.querySelector('.tab[onclick*="\'' + name + '\'"]')
            || document.querySelector('.tab[onclick*="' + name + '"]');
  if (typeof window.switchTab === 'function') {
    window.switchTab(name, topTab);
  }
  // 同步底部導航 active 樣式
  var items = document.querySelectorAll('#bottomNav .bottom-nav-item');
  items.forEach(function(el){ el.classList.toggle('active', el === btn); });
};

// 觀察頂部 tab-bar 的 active 變化 → 同步底部導航
function observeTopTabsToBottom(){
  var topBar = document.querySelector('.tab-bar');
  if (!topBar) return;
  var mo = new MutationObserver(function(){
    var activeTab = topBar.querySelector('.tab.active');
    if (!activeTab) return;
    var onclick = activeTab.getAttribute('onclick') || '';
    var m = onclick.match(/switchTab\(['"]([^'"]+)['"]/);
    if (!m) return;
    var name = m[1];
    document.querySelectorAll('#bottomNav .bottom-nav-item').forEach(function(el){
      el.classList.toggle('active', el.getAttribute('data-tab') === name);
    });
  });
  mo.observe(topBar, { attributes:true, subtree:true, attributeFilter:['class'] });
}

// ── 4. 滑動翻卡 (僅在 Vocab 練習頁啟用) ──────────────────────
function installSwipe(){
  var card = document.querySelector('#ptab-content-vocab .card');
  if (!card) return;
  var sx = 0, sy = 0, dx = 0, dy = 0, active = false;
  var THRESH = 60;
  card.addEventListener('touchstart', function(e){
    if (e.touches.length !== 1) return;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    dx = dy = 0; active = true;
    card.classList.remove('swipe-reset','swiping-left','swiping-right');
  }, { passive:true });
  card.addEventListener('touchmove', function(e){
    if (!active) return;
    dx = e.touches[0].clientX - sx;
    dy = e.touches[0].clientY - sy;
    if (Math.abs(dy) > Math.abs(dx)) return; // 垂直滑動 → 放棄
    if (dx < -15) { card.classList.add('swiping-left'); card.classList.remove('swiping-right'); }
    else if (dx > 15) { card.classList.add('swiping-right'); card.classList.remove('swiping-left'); }
  }, { passive:true });
  card.addEventListener('touchend', function(){
    if (!active) return;
    active = false;
    card.classList.remove('swiping-left','swiping-right');
    card.classList.add('swipe-reset');
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (dx <= -THRESH && typeof window.vGoNext === 'function') {
      window.vGoNext();
    } else if (dx >= THRESH && typeof window.vGo === 'function') {
      window.vGo(-1);
    }
  }, { passive:true });
}

// ── 5. 網路狀態 ──────────────────────────────────────────────
function installNetListener(){
  var banner = document.getElementById('netOfflineBanner');
  function update(){
    if (!banner) return;
    if (navigator.onLine) banner.classList.remove('show');
    else banner.classList.add('show');
  }
  window.addEventListener('online', function(){
    update();
    // 一回到線上，立刻同步資料
    if (_cu() && typeof window._dbSaveNow === 'function') {
      window._dbSaveNow();
    }
    if (typeof window._checkSession === 'function') window._checkSession();
  });
  window.addEventListener('offline', update);
  update();
}

// ── 6. 即時 session 驗證 + 離開前儲存 ─────────────────────────
function installSessionHooks(){
  // 從背景切回前景 → 立刻驗證
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState !== 'visible') return;
    if (!_cu()) return;
    if (typeof window._checkSession === 'function') window._checkSession();
  });
  // 關閉/切離 → 立刻把未儲存的資料推到 DB
  function flush(){
    if (!_cu()) return;
    if (typeof window._dbSaveNow === 'function') {
      try { window._dbSaveNow(); } catch(_){}
    }
  }
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
}

// ── 7. Supabase Realtime：毫秒級踢下線 ───────────────────────
//  訂閱 vocab_users 中自己那列的 session_token 變動。
//  注意：預設 RLS 只允許 SELECT，Realtime 需要 publication 權限。
//  若後端未啟用 publication，這段會失敗但不影響 polling 備援。
var _realtimeChan = null;
function startRealtime(userId){
  try {
    if (!userId || typeof window.getSB !== 'function') return;
    var sb = window.getSB();
    if (!sb || !sb.channel) return;
    stopRealtime();
    _realtimeChan = sb.channel('vocab-session-' + userId)
      .on('postgres_changes',
          { event:'UPDATE', schema:'public', table:'vocab_users', filter:'id=eq.' + userId },
          function(payload){
            try {
              var newTok = payload && payload.new && payload.new.session_token;
              if (!newTok) return;
              if (newTok !== _cu_tok()) {
                // 別的裝置搶走了 token → 立刻驗證 → 踢出本機
                if (typeof window._checkSession === 'function') window._checkSession();
              }
            } catch(_){}
          })
      .subscribe();
  } catch(e){ console.warn('[PWA] realtime subscribe skipped:', e && e.message); }
}
function stopRealtime(){
  try {
    if (_realtimeChan && typeof window.getSB === 'function') {
      var sb = window.getSB();
      if (sb && sb.removeChannel) sb.removeChannel(_realtimeChan);
    }
  } catch(_){}
  _realtimeChan = null;
}

// 觀察 mainScreen 的 active 狀態 → 登入後啟動 UI + realtime
function observeLoginState(){
  var main = document.getElementById('mainScreen');
  var login = document.getElementById('loginScreen');
  if (!main) return;
  var toolbar = document.getElementById('pwaToolbar');
  var botnav  = document.getElementById('bottomNav');
  var apply = function(){
    var loggedIn = main.classList.contains('active');
    if (toolbar) toolbar.classList.toggle('hidden', !loggedIn);
    if (botnav)  botnav.classList.toggle('hidden', !loggedIn);
    if (loggedIn) {
      // 延遲安裝手勢（vocab card 要等 initVocab 渲染）
      setTimeout(installSwipe, 300);
      // 啟動 realtime
      if (_cu_id()) startRealtime(_cu_id());
    } else {
      stopRealtime();
      // 退出 focus mode
      document.body.classList.remove('focus-mode');
      var exit = document.getElementById('focusExitBtn');
      if (exit) exit.classList.add('hidden');
    }
  };
  new MutationObserver(apply).observe(main, { attributes:true, attributeFilter:['class'] });
  if (login) new MutationObserver(apply).observe(login, { attributes:true, attributeFilter:['class'] });
  apply();
}

// ── 初始化 ──────────────────────────────────────────────────
ready(function(){
  // 還原偏好
  var savedTheme = getPref('theme', null);
  if (!savedTheme) {
    // 跟隨系統設定（首次）
    savedTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  applyTheme(savedTheme);
  applyFontSize(getPref('fontsize', 'm'));

  installNetListener();
  installSessionHooks();
  observeTopTabsToBottom();
  observeLoginState();

  // 重新安裝 swipe (當切回 vocab 子頁時 DOM 已存在)
  document.addEventListener('click', function(e){
    var t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest('#ptab-btn-vocab')) setTimeout(installSwipe, 100);
  });

  // 系統色彩偏好變更時跟隨 (只有未顯式設定時)
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e){
        if (getPref('theme', null) === null) applyTheme(e.matches ? 'dark' : 'light');
      });
    } catch(_){}
  }
});

})();
