'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   ARGENT — Ultra-Minimalist Banking Dashboard
   Application Logic
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Portrait Data (10 faces, Kenyatta first) ──────────────────────────────
const PORTRAITS = [
  { src: 'images/portrait_kenyatta.jpg',   name: 'Jomo Kenyatta'  },
  { src: 'images/portrait_mandela.jpg',    name: 'Nelson Mandela' },
  { src: 'images/portrait_cleopatra.jpg',  name: 'Cleopatra'      },
  { src: 'images/portrait_mansa_musa.jpg', name: 'Mansa Musa'     },
  { src: 'images/portrait_sankara.jpg',    name: 'Thomas Sankara' },
  { src: 'images/portrait_nefertiti.jpg',  name: 'Nefertiti'      },
  { src: 'images/portrait_selassie.jpg',   name: 'Haile Selassie' },
  { src: 'images/portrait_nkrumah.jpg',    name: 'Kwame Nkrumah'  },
  { src: 'images/portrait_kagame.jpg',     name: 'Paul Kagame'    },
  { src: 'images/portrait_shaka.jpg',      name: 'Shaka Zulu'     },
];

// ── Bank Config (SVG logos as inline path data) ───────────────────────────
const BANK_CONFIG = {
  ncba: {
    name: 'NCBA Bank',
    sub: 'COMMERCIAL BANKING',
    logo: `<svg viewBox="0 0 48 48"><text x="4" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="16" fill="currentColor">NCBA</text></svg>`,
  },
  family: {
    name: 'Family Bank',
    sub: 'GROWING TOGETHER',
    logo: `<svg viewBox="0 0 48 48"><text x="1" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="11" fill="currentColor">FAMILY</text></svg>`,
  },
  sbm: {
    name: 'SBM Bank',
    sub: 'STATE BANK OF MAURITIUS',
    logo: `<svg viewBox="0 0 48 48"><text x="5" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="16" fill="currentColor">SBM</text></svg>`,
  },
  im: {
    name: 'I&M Bank',
    sub: 'BANKING ON YOU',
    logo: `<svg viewBox="0 0 48 48"><text x="5" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="16" fill="currentColor">I&amp;M</text></svg>`,
  },
  credit: {
    name: 'Credit Bank',
    sub: 'STRENGTH & RESILIENCE',
    logo: `<svg viewBox="0 0 48 48"><text x="0" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="11" fill="currentColor">CREDIT</text></svg>`,
  },
  coop: {
    name: 'Co-op Bank',
    sub: 'THE COOPERATIVE BANK',
    logo: `<svg viewBox="0 0 48 48"><text x="1" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="12" fill="currentColor">CO-OP</text></svg>`,
  },
  equity: {
    name: 'Equity Bank',
    sub: 'YOUR LISTENING CARING PARTNER',
    logo: `<svg viewBox="0 0 48 48"><text x="0" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="10" fill="currentColor">EQUITY</text></svg>`,
  },
  kcb: {
    name: 'KCB Bank',
    sub: 'KENYA COMMERCIAL BANK',
    logo: `<svg viewBox="0 0 48 48"><text x="6" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="16" fill="currentColor">KCB</text></svg>`,
  },
  stanbic: {
    name: 'Stanbic Bank',
    sub: 'IT CAN BE',
    logo: `<svg viewBox="0 0 48 48"><text x="0" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="9" fill="currentColor">STANBIC</text></svg>`,
  },
  absa: {
    name: 'Absa Bank',
    sub: 'AFRICANACITY',
    logo: `<svg viewBox="0 0 48 48"><text x="4" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="14" fill="currentColor">ABSA</text></svg>`,
  },
  dtb: {
    name: 'DTB Bank',
    sub: 'DIAMOND TRUST BANK',
    logo: `<svg viewBox="0 0 48 48"><text x="7" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="16" fill="currentColor">DTB</text></svg>`,
  },
};

// ── Themes ─────────────────────────────────────────────────────────────────
const THEMES = ['void', 'concrete', 'infrared'];
const THEME_ICONS = { void: '◐', concrete: '◑', infrared: '◉' };

// ── State ──────────────────────────────────────────────────────────────────
let balancesCache  = {};
let currentBankId  = null;
let updateTarget   = { bankId: null, accountIndex: null };
let blurredAccounts = new Set();  // tracks which accounts are blurred: "bankId-index"

// ── User name (stored in localStorage) ────────────────────────────────────
function getUserName() {
  return localStorage.getItem('argent-user-name') || 'ROBERT';
}


/* ═══════════════════════════════════════════════════════════════════════════
   SPLASH SCREEN — 10 portraits × 0.6s = 6s total
   ═══════════════════════════════════════════════════════════════════════════ */

function runSplash() {
  const imgA = document.getElementById('splash-portrait-a');
  const imgB = document.getElementById('splash-portrait-b');
  let slot = 'a';
  let idx = 0;

  // Preload all portrait images
  const preloaded = PORTRAITS.map(p => {
    const img = new Image();
    img.src = p.src;
    return img;
  });

  // Show first portrait immediately
  imgA.src = PORTRAITS[0].src;
  imgA.classList.add('active');
  idx = 1;

  // Hard-cut every 600ms
  const interval = setInterval(() => {
    if (idx >= PORTRAITS.length) {
      clearInterval(interval);
      return;
    }

    const nextSrc = PORTRAITS[idx].src;

    if (slot === 'a') {
      imgB.src = nextSrc;
      imgA.classList.remove('active');
      imgB.classList.add('active');
      slot = 'b';
    } else {
      imgA.src = nextSrc;
      imgB.classList.remove('active');
      imgA.classList.add('active');
      slot = 'a';
    }
    idx++;
  }, 600);

  // After 6s, auto-transition to app
  setTimeout(() => {
    clearInterval(interval);
    enterApp();
  }, 6000);
}


/* ═══════════════════════════════════════════════════════════════════════════
   ENTER APP
   ═══════════════════════════════════════════════════════════════════════════ */

async function enterApp() {
  // Load balances from server
  try {
    const res = await fetch('/api/balances');
    if (res.ok) balancesCache = await res.json();
  } catch {
    /* server not running — use defaults */
  }

  // Fallback defaults if no data
  if (!Object.keys(balancesCache).length) {
    balancesCache = {
      ncba:   { name: 'NCBA Bank',   accounts: [{ number: '1234-5678-9012', balance: 125430.50, currency: 'KES' }] },
      family: { name: 'Family Bank', accounts: [{ number: '2345-6789-0123', balance: 58920.75,  currency: 'KES' }] },
      sbm:    { name: 'SBM Bank',    accounts: [{ number: '3456-7890-1234', balance: 201000.00, currency: 'KES' }] },
      im:     { name: 'I&M Bank',    accounts: [{ number: '4567-8901-2345', balance: 87500.25,  currency: 'KES' }] },
      credit: { name: 'Credit Bank', accounts: [{ number: '5678-9012-3456', balance: 34200.00,  currency: 'KES' }] },
      coop:   { name: 'Coop Bank',   accounts: [{ number: '6789-0123-4567', balance: 156780.90, currency: 'KES' }] },
    };
  }

  // Fade out splash
  const splash = document.getElementById('splash-screen');
  splash.classList.add('fade-out');
  setTimeout(() => { splash.style.display = 'none'; }, 800);

  // Show main app
  document.getElementById('app').style.display = '';
  renderBankGrid();
  initHeaderScroll();
}


/* ═══════════════════════════════════════════════════════════════════════════
   STAR FIELD
   ═══════════════════════════════════════════════════════════════════════════ */

function initStarField() {
  const container = document.getElementById('star-field');
  const count = 60;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 0.5;
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${2 + Math.random() * 5}s;
      animation-delay: ${-Math.random() * 5}s;
    `;
    container.appendChild(star);
  }
}


/* ═══════════════════════════════════════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════════════════════════════════════ */

function getTheme() {
  return localStorage.getItem('argent-theme') || 'void';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('argent-theme', theme);
  const btn = document.getElementById('btn-theme');
  if (btn) btn.textContent = THEME_ICONS[theme] || '◐';
}

function cycleTheme() {
  const current = getTheme();
  const idx = THEMES.indexOf(current);
  const next = THEMES[(idx + 1) % THEMES.length];
  setTheme(next);
}


/* ═══════════════════════════════════════════════════════════════════════════
   HEADER SCROLL EFFECT
   ═══════════════════════════════════════════════════════════════════════════ */

function initHeaderScroll() {
  const header = document.getElementById('app-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}


/* ═══════════════════════════════════════════════════════════════════════════
   BANK GRID (SCREEN 1)
   ═══════════════════════════════════════════════════════════════════════════ */

function renderBankGrid() {
  const grid = document.getElementById('bank-grid');
  grid.innerHTML = '';

  for (const [bankId, bankData] of Object.entries(balancesCache)) {
    const config = BANK_CONFIG[bankId] || {
      name: bankData.name,
      sub: 'BANKING',
      logo: `<svg viewBox="0 0 48 48"><text x="4" y="34" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="12" fill="currentColor">${bankId.toUpperCase()}</text></svg>`,
    };

    const card = document.createElement('button');
    card.className = 'bank-card';
    card.setAttribute('aria-label', config.name);
    card.onclick = () => openBank(bankId);
    card.innerHTML = `
      <div class="bank-card-logo">${config.logo}</div>
      <div class="bank-card-name">${config.name}</div>
      <div class="bank-card-sub">${config.sub}</div>
    `;
    grid.appendChild(card);
  }
}


/* ═══════════════════════════════════════════════════════════════════════════
   BANK DETAIL (SCREEN 2)
   ═══════════════════════════════════════════════════════════════════════════ */

function openBank(bankId) {
  currentBankId = bankId;
  const bankData = balancesCache[bankId];
  if (!bankData) return;

  const config = BANK_CONFIG[bankId] || { name: bankData.name, logo: '' };
  const accounts = bankData.accounts || [];

  // Update virtual card
  const cardLogo = document.getElementById('card-bank-logo');
  cardLogo.innerHTML = config.logo || '';
  document.getElementById('card-number').textContent = accounts.length > 0 ? accounts[0].number : '•••• •••• ••••';
  document.getElementById('card-holder-name').textContent = getUserName();
  document.getElementById('card-bank-name-text').textContent = (config.name || bankData.name).toUpperCase();

  // Render account list
  renderAccountList(bankId, accounts);

  // Show overlay
  document.getElementById('bank-detail-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderAccountList(bankId, accounts) {
  const list = document.getElementById('account-list');
  list.innerHTML = '';

  accounts.forEach((acc, index) => {
    const key = `${bankId}-${index}`;
    const isBlurred = blurredAccounts.has(key);
    const balanceText = formatCurrency(acc.balance, acc.currency || 'KES');

    const row = document.createElement('div');
    row.className = 'account-row';
    row.innerHTML = `
      <span class="account-number">${acc.number}</span>
      <div class="account-balance-wrap">
        <span class="account-balance ${isBlurred ? 'blurred' : ''}" data-key="${key}">${balanceText}</span>
        <button class="btn-eye" onclick="toggleBlur('${key}', event)" title="Toggle visibility">${isBlurred ? '🙈' : '👁️'}</button>
        <button class="btn-update" onclick="openUpdateModal('${bankId}', ${index}, event)">UPDATE</button>
      </div>
    `;
    list.appendChild(row);
  });
}

function closeBank() {
  document.getElementById('bank-detail-overlay').classList.remove('open');
  document.body.style.overflow = '';
  currentBankId = null;
}


/* ═══════════════════════════════════════════════════════════════════════════
   BALANCE FORMATTING & TOGGLE
   ═══════════════════════════════════════════════════════════════════════════ */

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency || 'KES',
    minimumFractionDigits: 2,
  }).format(amount);
}

function toggleBlur(key, e) {
  e.stopPropagation();
  const balEl = document.querySelector(`.account-balance[data-key="${key}"]`);
  const eyeBtn = e.currentTarget;
  if (!balEl) return;

  if (blurredAccounts.has(key)) {
    blurredAccounts.delete(key);
    balEl.classList.remove('blurred');
    eyeBtn.textContent = '👁️';
  } else {
    blurredAccounts.add(key);
    balEl.classList.add('blurred');
    eyeBtn.textContent = '🙈';
  }
}


/* ═══════════════════════════════════════════════════════════════════════════
   UPDATE BALANCE MODAL (SCREEN 3)
   ═══════════════════════════════════════════════════════════════════════════ */

function openUpdateModal(bankId, accountIndex, e) {
  if (e) e.stopPropagation();
  updateTarget = { bankId, accountIndex };
  const acc = balancesCache[bankId]?.accounts?.[accountIndex];
  if (!acc) return;

  document.getElementById('update-modal-account').textContent = `ACCOUNT ${acc.number}`;
  document.getElementById('update-input').value = '';
  document.getElementById('update-feedback').textContent = '';
  document.getElementById('update-modal').classList.add('open');
}

function closeUpdateModal() {
  document.getElementById('update-modal').classList.remove('open');
  updateTarget = { bankId: null, accountIndex: null };
}

async function confirmUpdate() {
  const { bankId, accountIndex } = updateTarget;
  if (bankId == null || accountIndex == null) return;

  const input = document.getElementById('update-input');
  const feedback = document.getElementById('update-feedback');
  const value = parseFloat(input.value);

  if (isNaN(value) || value < 0) {
    feedback.style.color = '#ff3b30';
    feedback.textContent = '⚠ Enter a valid positive amount';
    return;
  }

  // Update local cache
  balancesCache[bankId].accounts[accountIndex].balance = value;

  // Update display
  renderAccountList(bankId, balancesCache[bankId].accounts);

  // Also update card number if it's the first account
  if (accountIndex === 0) {
    document.getElementById('card-number').textContent = balancesCache[bankId].accounts[0].number;
  }

  // Persist to server
  try {
    await fetch(`/api/balances/${bankId}/${accountIndex}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ balance: value }),
    });
  } catch { /* offline ok */ }

  closeUpdateModal();
  showToast('✓ Balance updated');
}


/* ═══════════════════════════════════════════════════════════════════════════
   ADD BANK MODAL
   ═══════════════════════════════════════════════════════════════════════════ */

function openAddBankModal() {
  document.getElementById('new-bank-select').value = '';
  document.getElementById('new-bank-account').value = '';
  document.getElementById('new-bank-balance').value = '';
  document.getElementById('add-bank-feedback').textContent = '';

  // Disable banks that already exist
  const select = document.getElementById('new-bank-select');
  Array.from(select.options).forEach(opt => {
    if (opt.value) {
      opt.disabled = !!balancesCache[opt.value];
      if (opt.disabled) opt.textContent = (BANK_CONFIG[opt.value]?.name || opt.value) + ' (added)';
      else opt.textContent = BANK_CONFIG[opt.value]?.name || opt.value;
    }
  });

  document.getElementById('add-bank-modal').classList.add('open');
}

function closeAddBankModal() {
  document.getElementById('add-bank-modal').classList.remove('open');
}

async function confirmAddBank() {
  const bankId = document.getElementById('new-bank-select').value;
  const accountNum = document.getElementById('new-bank-account').value.trim();
  const balance = parseFloat(document.getElementById('new-bank-balance').value) || 0;
  const feedback = document.getElementById('add-bank-feedback');

  if (!bankId) {
    feedback.style.color = '#ff3b30';
    feedback.textContent = '⚠ Select a bank';
    return;
  }
  if (!accountNum) {
    feedback.style.color = '#ff3b30';
    feedback.textContent = '⚠ Enter an account number';
    return;
  }
  if (balancesCache[bankId]) {
    // Bank exists — add as new account
    balancesCache[bankId].accounts.push({ number: accountNum, balance, currency: 'KES' });
    try {
      await fetch(`/api/balances/${bankId}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: accountNum, balance, currency: 'KES' }),
      });
    } catch { /* offline */ }
  } else {
    // New bank
    const config = BANK_CONFIG[bankId] || { name: bankId };
    balancesCache[bankId] = {
      name: config.name || bankId,
      accounts: [{ number: accountNum, balance, currency: 'KES' }],
    };
    try {
      await fetch('/api/banks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bankId, name: config.name || bankId, number: accountNum, balance, currency: 'KES' }),
      });
    } catch { /* offline */ }
  }

  renderBankGrid();
  closeAddBankModal();
  showToast('✓ Bank added');
}


/* ═══════════════════════════════════════════════════════════════════════════
   ADD ACCOUNT MODAL (within a bank)
   ═══════════════════════════════════════════════════════════════════════════ */

function openAddAccountModal() {
  if (!currentBankId) return;
  const bankData = balancesCache[currentBankId];
  const config = BANK_CONFIG[currentBankId] || {};
  document.getElementById('add-account-bank-name').textContent = `TO ${(config.name || bankData?.name || currentBankId).toUpperCase()}`;
  document.getElementById('add-account-number').value = '';
  document.getElementById('add-account-balance').value = '';
  document.getElementById('add-account-feedback').textContent = '';
  document.getElementById('add-account-modal').classList.add('open');
}

function closeAddAccountModal() {
  document.getElementById('add-account-modal').classList.remove('open');
}

async function confirmAddAccount() {
  if (!currentBankId) return;
  const accountNum = document.getElementById('add-account-number').value.trim();
  const balance = parseFloat(document.getElementById('add-account-balance').value) || 0;
  const feedback = document.getElementById('add-account-feedback');

  if (!accountNum) {
    feedback.style.color = '#ff3b30';
    feedback.textContent = '⚠ Enter an account number';
    return;
  }

  balancesCache[currentBankId].accounts.push({ number: accountNum, balance, currency: 'KES' });

  try {
    await fetch(`/api/balances/${currentBankId}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: accountNum, balance, currency: 'KES' }),
    });
  } catch { /* offline */ }

  renderAccountList(currentBankId, balancesCache[currentBankId].accounts);
  closeAddAccountModal();
  showToast('✓ Account added');
}


/* ═══════════════════════════════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════════════════════════════ */

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}


/* ═══════════════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════════════ */

// Apply saved theme
setTheme(getTheme());

// Generate star field
initStarField();

// Run splash sequence
runSplash();

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('update-modal').classList.contains('open')) closeUpdateModal();
    else if (document.getElementById('add-bank-modal').classList.contains('open')) closeAddBankModal();
    else if (document.getElementById('add-account-modal').classList.contains('open')) closeAddAccountModal();
    else if (document.getElementById('bank-detail-overlay').classList.contains('open')) closeBank();
  }
});

// Click outside modals to close
['update-modal', 'add-bank-modal', 'add-account-modal'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
      if (id === 'update-modal') closeUpdateModal();
      else if (id === 'add-bank-modal') closeAddBankModal();
      else if (id === 'add-account-modal') closeAddAccountModal();
    }
  });
});
