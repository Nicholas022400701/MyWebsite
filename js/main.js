// ===== 宸ュ叿鍑芥暟 =====
function showToast(icon, msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== 鏆楅粦妯″紡 =====
function initDarkMode() {
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') document.body.classList.add('dark');
}

function toggleDark() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// ===== 绉诲姩绔彍鍗?=====
function initMenu() {
  const btn = document.getElementById('menuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  // 鐐瑰嚮澶栭儴鍏抽棴
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
}

// ===== 鏂囩珷鍒楄〃娓叉煋锛堜粎棣栭〉锛?=====
const PAGE_SIZE = 6;
let currentPage = 1;
let filteredPosts = [];

function renderPosts(posts, page = 1) {
  const grid = document.getElementById('postsGrid');
  const countEl = document.getElementById('postCount');
  if (!grid) return;

  const total = posts.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pagePosts = posts.slice(start, start + PAGE_SIZE);

  if (countEl) countEl.textContent = `鍏?${total} 绡嘸;

  grid.innerHTML = pagePosts.map(p => `
    <article class="post-card" onclick="location.href='post.html'">
      <div class="card-img" style="background:${p.gradient}">${p.emoji}</div>
      <div class="card-body">
        <span class="post-category ${p.catClass}">${p.category}</span>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="post-meta">
          <div class="avatar">${p.author[0]}</div>
          <span>${p.date}</span>
        </div>
      </div>
      <div class="card-footer">
        <span class="reading-time">鈴?${p.readTime} 鍒嗛挓</span>
        <span>馃憗 ${p.views.toLocaleString()}</span>
      </div>
    </article>
  `).join('');

  renderPagination(totalPages, page);
}

function renderPagination(total, current) {
  const el = document.getElementById('pagination');
  if (!el || total <= 1) { if (el) el.innerHTML = ''; return; }

  let html = '';
  // 涓婁竴椤?
  html += `<button class="page-btn" onclick="goPage(${current - 1})" ${current === 1 ? 'disabled style="opacity:.4"' : ''}>鈥?/button>`;
  for (let i = 1; i <= total; i++) {
    html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  // 涓嬩竴椤?
  html += `<button class="page-btn" onclick="goPage(${current + 1})" ${current === total ? 'disabled style="opacity:.4"' : ''}>鈥?/button>`;
  el.innerHTML = html;
}

function goPage(page) {
  const total = Math.ceil(filteredPosts.length / PAGE_SIZE);
  if (page < 1 || page > total) return;
  currentPage = page;
  renderPosts(filteredPosts, currentPage);
  document.getElementById('allPosts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 鍒嗙被绛涢€?=====
function filterPosts(cat, el) {
  // 鏇存柊婵€娲绘爣绛炬牱寮?
  document.querySelectorAll('#categoryFilter .tag').forEach(t => {
    t.style.background = '';
    t.style.color = '';
    t.style.borderColor = '';
  });
  if (el) {
    el.style.background = 'var(--primary)';
    el.style.color = 'white';
    el.style.borderColor = 'var(--primary)';
  }

  filteredPosts = cat === 'all' ? [...POSTS] : POSTS.filter(p => p.category === cat);
  currentPage = 1;
  renderPosts(filteredPosts, 1);
}

// ===== 鎼滅储 =====
function doSearch() {
  const heroInput = document.getElementById('heroSearch');
  const sideInput = document.getElementById('sideSearch');
  const keyword = (heroInput?.value || sideInput?.value || '').trim().toLowerCase();

  if (!keyword) {
    filteredPosts = [...POSTS];
  } else {
    filteredPosts = POSTS.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.excerpt.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
    );
    if (filteredPosts.length === 0) {
      showToast('馃攳', `娌℃湁鎵惧埌"${keyword}"鐩稿叧鐨勬枃绔燻);
    } else {
      showToast('鉁?, `鎵惧埌 ${filteredPosts.length} 绡囩浉鍏虫枃绔燻);
    }
  }

  currentPage = 1;
  renderPosts(filteredPosts, 1);
  document.getElementById('allPosts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 鍥炶溅瑙﹀彂鎼滅储
function bindSearchEnter() {
  ['heroSearch', 'sideSearch'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') doSearch();
    });
  });
}

// ===== 璁㈤槄锛堥椤碉級 =====
function subscribe() {
  const email = document.getElementById('subEmail')?.value;
  if (!email || !email.includes('@')) { showToast('鈿狅笍', '璇疯緭鍏ユ湁鏁堥偖绠?); return; }
  if (document.getElementById('subEmail')) document.getElementById('subEmail').value = '';
  showToast('馃帀', '璁㈤槄鎴愬姛锛屾劅璋綘鐨勫叧娉紒');
}

// ===== 闃呰杩涘害鏉?=====
function initProgressBar() {
  // 浠呭湪鏂囩珷璇︽儏椤垫樉绀?
  if (!document.querySelector('.post-article')) return;
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--primary),var(--accent));z-index:9999;transition:width .1s linear;width:0';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = Math.min(progress, 100) + '%';
  });
}

// ===== 鍥炲埌椤堕儴 =====
function initBackToTop() {
  const btn = document.createElement('button');
  btn.textContent = '鈫?;
  btn.title = '鍥炲埌椤堕儴';
  btn.style.cssText = `
    position:fixed;bottom:80px;right:24px;
    width:40px;height:40px;border-radius:50%;
    background:var(--primary);color:white;
    border:none;font-size:1.1rem;font-weight:700;
    cursor:pointer;z-index:999;
    box-shadow:0 4px 12px rgba(79,70,229,.4);
    transition:all .3s;opacity:0;transform:translateY(10px) scale(.9);
  `;
  document.body.appendChild(btn);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0) scale(1)' : 'translateY(10px) scale(.9)';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  });
}

// ===== 鏆楅粦妯″紡鍒囨崲鎸夐挳 =====
function initDarkToggle() {
  const btn = document.createElement('button');
  btn.title = '鍒囨崲鏆楅粦妯″紡';
  btn.style.cssText = `
    position:fixed;bottom:24px;right:24px;
    width:40px;height:40px;border-radius:50%;
    background:var(--surface);color:var(--text);
    border:1px solid var(--border);font-size:1.1rem;
    cursor:pointer;z-index:999;
    box-shadow:var(--shadow-md);
    transition:all .3s;
  `;
  btn.textContent = '馃寵';
  btn.addEventListener('click', () => {
    toggleDark();
    btn.textContent = document.body.classList.contains('dark') ? '鈽€锔? : '馃寵';
    showToast(
      document.body.classList.contains('dark') ? '馃寵' : '鈽€锔?,
      document.body.classList.contains('dark') ? '宸插垏鎹㈠埌鏆楅粦妯″紡' : '宸插垏鎹㈠埌鏄庝寒妯″紡'
    );
  });
  if (document.body.classList.contains('dark')) btn.textContent = '鈽€锔?;
  document.body.appendChild(btn);
}

// ===== 鍒濆鍖?=====
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMenu();
  initProgressBar();
  initBackToTop();
  initDarkToggle();
  bindSearchEnter();

  // 浠呭湪棣栭〉娓叉煋鏂囩珷鍒楄〃
  if (document.getElementById('postsGrid')) {
    filteredPosts = [...POSTS];
    renderPosts(filteredPosts, 1);
  }
});

