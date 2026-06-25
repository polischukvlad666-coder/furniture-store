/* =======================================
   app.js — МеблеДім — Меблі на замовлення
   ======================================= */

'use strict';

// ==========================================
// ДАНІ ЗА ЗАМОВЧУВАННЯМ
// ==========================================
const DEFAULT_SETTINGS = {
  siteName: 'МеблеДім',
  heroTitle: "Створіть інтер'єр своєї мрії",
  heroSubtitle: 'Обирайте з нашого каталогу — ми привеземо саме те, що вам потрібно. Якісні меблі від перевірених виробників.',
  phone: '+38 (099) 982-96-75',
  email: 'info@mebledim.ua',
  address: 'м. Зміїв, вул. Гагаріна, 10',
  hours: 'Пн-Пт: 9:00 — 18:00',
  stat1Num: '300+',  stat1Label: 'Позицій',
  stat2Num: '7–14 днів', stat2Label: 'Доставка',
  stat3Num: '500+', stat3Label: 'Задоволених клієнтів',
  aboutTitle: 'Ми працюємо для вашого комфорту',
  aboutDesc: 'Наша компанія спеціалізується на постачанні якісних меблів під замовлення. Ми співпрацюємо лише з перевіреними виробниками та гарантуємо відповідність товару тому, що ви бачите в каталозі.',
  aboutYears: '3',
  password: 'admin123',
  footerCopy: '© 2026 МеблеДім. Усі права захищені.'
};

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Диван Comfort Plus',
    category: 'Дивани',
    price: 28000,
    oldPrice: 35000,
    desc: 'М\'який кутовий диван з розкладним механізмом. Оббивка з якісного велюру. Ідеально підходить для великих вітальень.',
    specs: 'Матеріал: Велюр\nРозмір: 270x170x90 см\nКолір: Темно-сірий\nМеханізм: Єврокнижка\nГарантія: 2 роки',
    image: '',
    imageEmoji: '🛋️',
    badge: 'Хіт продажів',
    status: 'active'
  },
  {
    id: 2,
    name: 'Ліжко Scandic',
    category: 'Ліжка',
    price: 18000,
    oldPrice: null,
    desc: 'Ліжко в скандинавському стилі з дерев\'яним узголів\'ям. Натуральне дерево, чіткі лінії та максимальний комфорт.',
    specs: 'Матеріал: Масив дуба\nРозмір: 180x200 см\nУзголів\'я: Дерев\'яне\nОснова: Ортопедична\nГарантія: 3 роки',
    image: '',
    imageEmoji: '🛏️',
    badge: 'Новинка',
    status: 'active'
  },
  {
    id: 3,
    name: 'Кухонний гарнітур Nova',
    category: 'Кухні',
    price: 52000,
    oldPrice: 65000,
    desc: 'Сучасний кухонний гарнітур з фасадами з МДФ у матовому покритті. Місткі шафки та зручна стільниця зі штучного каменю.',
    specs: 'Матеріал фасадів: МДФ матовий\nСтільниця: Штучний камінь\nФурнітура: Blum\nГарантія: 2 роки',
    image: '',
    imageEmoji: '🍳',
    badge: 'Акція',
    status: 'active'
  },
  {
    id: 4,
    name: 'Шафа-купе Premium',
    category: 'Шафи',
    price: 14000,
    oldPrice: null,
    desc: 'Місткий шафа-купе з дзеркальними дверима. Система розсувних дверей плавно ковзає без скрипів. Індивідуальне планування внутрішнього простору.',
    specs: 'Матеріал: ЛДСП\nДвері: Дзеркало\nШирина: 180–300 см\nВисота: До стелі\nГарантія: 18 місяців',
    image: '',
    imageEmoji: '🚪',
    badge: '',
    status: 'active'
  },
  {
    id: 5,
    name: 'Крісло Loft',
    category: 'Крісла',
    price: 8500,
    oldPrice: 10000,
    desc: 'Стильне крісло у стилі лофт з металевими ніжками. Оббивка з екошкіри, наповнювач — піна високої щільності.',
    specs: 'Матеріал: Екошкіра\nНіжки: Метал, чорні\nНавантаження: до 120 кг\nРозмір: 80x85x90 см\nГарантія: 1 рік',
    image: '',
    imageEmoji: '🪑',
    badge: '',
    status: 'active'
  },
  {
    id: 6,
    name: 'Стіл обідній Oak',
    category: 'Столи',
    price: 12000,
    oldPrice: null,
    desc: 'Обідній стіл з масиву дуба. Натуральне дерево з масляним покриттям, що підкреслює природну текстуру. Розсувна конструкція.',
    specs: 'Матеріал: Масив дуба\nРозмір: 140–200x90 см\nПокриття: Масло\nМісць: 6–8 осіб\nГарантія: 2 роки',
    image: '',
    imageEmoji: '🪵',
    badge: 'Новинка',
    status: 'active'
  }
];

// ==========================================
// СТАН
// ==========================================
let state = {
  products: [],
  settings: {},
  orders: [],
  activeFilter: 'all',
  searchQuery: '',
  currentProductId: null,
  isAdminAuthenticated: false,
  adminSearchQuery: ''
};

// ==========================================
// ЛОКАЛЬНЕ СХОВИЩЕ
// ==========================================
const LS_KEYS = {
  products: 'mebledim_products',
  settings: 'mebledim_settings',
  orders: 'mebledim_orders'
};

function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); }
  catch (e) { console.error('Storage error:', e); }
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}

// ==========================================
// ІНІЦІАЛІЗАЦІЯ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  state.settings = loadFromStorage(LS_KEYS.settings, { ...DEFAULT_SETTINGS });
  state.products  = loadFromStorage(LS_KEYS.products, DEFAULT_PRODUCTS.map(p => ({ ...p })));
  state.orders    = loadFromStorage(LS_KEYS.orders, []);
  state.settings  = { ...DEFAULT_SETTINGS, ...state.settings };

  applySettings();
  renderCatalog();
  initHeader();
  initScrollReveal();
});

// ==========================================
// ЗАСТОСУВАННЯ НАЛАШТУВАНЬ
// ==========================================
function applySettings() {
  const s = state.settings;

  setTextAll(['#site-name-display', '#footer-site-name'], s.siteName);
  document.title = `${s.siteName} — Меблі на замовлення`;

  safeSetText('#hero-title',    s.heroTitle);
  safeSetText('#hero-subtitle', s.heroSubtitle);

  safeSetText('#stat-num-1',   s.stat1Num);
  safeSetText('#stat-label-1', s.stat1Label);
  safeSetText('#stat-num-2',   s.stat2Num);
  safeSetText('#stat-label-2', s.stat2Label);
  safeSetText('#stat-num-3',   s.stat3Num);
  safeSetText('#stat-label-3', s.stat3Label);

  const phoneEl = document.getElementById('contact-phone');
  if (phoneEl) { phoneEl.textContent = s.phone; phoneEl.href = `tel:${s.phone.replace(/[^+\d]/g, '')}`; }
  const emailEl = document.getElementById('contact-email');
  if (emailEl) { emailEl.textContent = s.email; emailEl.href = `mailto:${s.email}`; }
  safeSetText('#contact-address', s.address);
  safeSetText('#contact-hours',   s.hours);

  safeSetText('#about-title',      s.aboutTitle);
  safeSetText('#about-desc',       s.aboutDesc);
  safeSetText('#about-badge-num',  s.aboutYears);

  safeSetText('#footer-copy', s.footerCopy || `© ${new Date().getFullYear()} ${s.siteName}. Усі права захищені.`);
}

function safeSetText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}
function setTextAll(selectors, text) {
  selectors.forEach(sel => safeSetText(sel, text));
}

// ==========================================
// РЕНДЕР КАТАЛОГУ
// ==========================================
function getCategories() {
  const cats = new Set();
  state.products.filter(p => p.status !== 'hidden').forEach(p => cats.add(p.category));
  return [...cats];
}

function renderFilterBar() {
  const bar = document.getElementById('filter-bar');
  if (!bar) return;
  const categories = getCategories();
  bar.innerHTML = `<button class="filter-btn ${state.activeFilter === 'all' ? 'active' : ''}" 
    data-cat="all" onclick="filterCatalog('all', this)">Усі</button>`;
  categories.forEach(cat => {
    bar.innerHTML += `<button class="filter-btn ${state.activeFilter === cat ? 'active' : ''}" 
      data-cat="${escHtml(cat)}" onclick="filterCatalog('${escHtml(cat)}', this)">${escHtml(cat)}</button>`;
  });
}

function renderCatalog() {
  renderFilterBar();
  const grid  = document.getElementById('products-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  let filtered = state.products.filter(p => p.status !== 'hidden');

  if (state.activeFilter !== 'all') {
    filtered = filtered.filter(p => p.category === state.activeFilter);
  }
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.desc || '').toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = filtered.map((p, i) => renderProductCard(p, i)).join('');
}

function renderProductCard(p, index) {
  const price    = formatPrice(p.price);
  const oldPrice = p.oldPrice ? `<span class="product-price-old">${formatPrice(p.oldPrice)}</span>` : '';
  const badge    = p.badge ? `<div class="product-badge">${escHtml(p.badge)}</div>` : '';
  const imgContent = p.image
    ? `<img class="product-img" src="${escHtml(p.image)}" alt="${escHtml(p.name)}" loading="lazy"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
       <div class="product-img-placeholder" style="display:none;">${p.imageEmoji || '🪑'}</div>`
    : `<div class="product-img-placeholder">${p.imageEmoji || '🪑'}</div>`;

  const delay = Math.min(index * 0.06, 0.5);

  return `
  <div class="product-card reveal" style="animation-delay:${delay}s"
       onclick="openProductModal(${p.id})" role="button" tabindex="0" aria-label="${escHtml(p.name)}">
    <div class="product-card-img">
      ${imgContent}
      ${badge}
    </div>
    <div class="product-card-body">
      <div class="product-category">${escHtml(p.category)}</div>
      <div class="product-name">${escHtml(p.name)}</div>
      <div class="product-price-row">
        <div>
          <span class="product-price">${price}</span>
          ${oldPrice}
        </div>
        <button class="product-order-btn" onclick="event.stopPropagation();openOrderModal(${p.id})">Замовити</button>
      </div>
    </div>
  </div>`;
}

function filterCatalog(category, btn) {
  state.activeFilter = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCatalog();
  setTimeout(checkReveal, 100);
}

function searchProducts(query) {
  state.searchQuery = query;
  renderCatalog();
  setTimeout(checkReveal, 100);
}

// ==========================================
// МОДАЛКА ТОВАРУ
// ==========================================
function openProductModal(id) {
  const p = state.products.find(p => p.id === id);
  if (!p) return;
  state.currentProductId = id;

  const modal   = document.getElementById('product-modal');
  const imgEl   = document.getElementById('modal-img');
  const imgWrap = document.getElementById('product-modal-card').querySelector('.modal-img-wrap');

  if (p.image) {
    imgEl.src = p.image; imgEl.alt = p.name; imgEl.style.display = 'block';
    const ph = imgWrap.querySelector('.product-img-placeholder');
    if (ph) ph.remove();
  } else {
    imgEl.style.display = 'none';
    let ph = imgWrap.querySelector('.product-img-placeholder');
    if (!ph) {
      ph = document.createElement('div');
      ph.className = 'product-img-placeholder';
      ph.style.cssText = 'height:100%;min-height:280px;';
      imgWrap.appendChild(ph);
    }
    ph.textContent = p.imageEmoji || '🪑';
  }

  const badge = document.getElementById('modal-badge');
  badge.textContent   = p.badge || '';
  badge.style.display = p.badge ? 'block' : 'none';

  safeSetText('#modal-category', p.category);
  safeSetText('#modal-title',    p.name);
  safeSetText('#modal-price',    formatPrice(p.price));

  const oldPriceEl = document.getElementById('modal-price-old');
  if (p.oldPrice) {
    oldPriceEl.textContent  = formatPrice(p.oldPrice);
    oldPriceEl.style.display = 'inline';
  } else {
    oldPriceEl.style.display = 'none';
  }

  safeSetText('#modal-desc', p.desc || '');

  const meta = document.getElementById('modal-meta');
  if (p.specs) {
    const lines = p.specs.split('\n').filter(l => l.trim());
    meta.innerHTML = lines.map(line => {
      const [key, ...rest] = line.split(':');
      const val = rest.join(':').trim();
      return `<div class="modal-meta-item">
        <span class="modal-meta-key">${escHtml(key.trim())}</span>
        <span class="modal-meta-val">${escHtml(val)}</span>
      </div>`;
    }).join('');
    meta.style.display = 'flex';
  } else {
    meta.style.display = 'none';
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal(event, force = false) {
  if (!force && event && !event.target.classList.contains('modal-overlay')) return;
  document.getElementById('product-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function orderProduct() {
  closeProductModal(null, true);
  openOrderModal(state.currentProductId);
}

// ==========================================
// МОДАЛКА ЗАМОВЛЕННЯ
// ==========================================
function openOrderModal(id) {
  const p = state.products.find(p => p.id === id);
  if (!p) return;
  state.currentProductId = id;
  safeSetText('#order-modal-product', `Товар: ${p.name} — ${formatPrice(p.price)}`);
  document.getElementById('order-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal(event, force = false) {
  if (!force && event && !event.target.classList.contains('modal-overlay')) return;
  document.getElementById('order-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function submitOrder(event) {
  event.preventDefault();
  const product = state.products.find(p => p.id === state.currentProductId);
  const order = {
    id: Date.now(),
    productId: state.currentProductId,
    productName:  product ? product.name : 'Товар видалено',
    productPrice: product ? formatPrice(product.price) : '—',
    name:    document.getElementById('om-name').value,
    phone:   document.getElementById('om-phone').value,
    comment: document.getElementById('om-comment').value,
    date:    new Date().toLocaleString('uk-UA')
  };

  state.orders.unshift(order);
  saveToStorage(LS_KEYS.orders, state.orders);

  document.getElementById('om-name').value    = '';
  document.getElementById('om-phone').value   = '';
  document.getElementById('om-comment').value = '';

  closeOrderModal(null, true);
  showToast('✅ Заявку прийнято! Ми зв\'яжемося з вами найближчим часом.', 'success');
}

// ==========================================
// КОНТАКТНА ФОРМА
// ==========================================
function submitContactForm(event) {
  event.preventDefault();
  const order = {
    id: Date.now(),
    productId:    null,
    productName:  'Загальна заявка',
    productPrice: '—',
    name:    document.getElementById('cf-name').value,
    phone:   document.getElementById('cf-phone').value,
    comment: document.getElementById('cf-message').value,
    date:    new Date().toLocaleString('uk-UA')
  };

  state.orders.unshift(order);
  saveToStorage(LS_KEYS.orders, state.orders);
  document.getElementById('contact-form').reset();
  showToast('✅ Повідомлення надіслано! Чекайте дзвінка.', 'success');
}

// ==========================================
// АДМІН ПАНЕЛЬ
// ==========================================
function openAdmin() {
  const overlay = document.getElementById('admin-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (state.isAdminAuthenticated) {
    renderAdminContent();
  } else {
    document.getElementById('admin-login').style.display   = 'block';
    document.getElementById('admin-content').style.display = 'none';
    setTimeout(() => document.getElementById('admin-password').focus(), 300);
  }
}

function closeAdmin() {
  document.getElementById('admin-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function adminLogin() {
  const input = document.getElementById('admin-password');
  if (input.value === state.settings.password) {
    state.isAdminAuthenticated = true;
    input.value = '';
    document.getElementById('admin-login').style.display   = 'none';
    document.getElementById('admin-content').style.display = 'block';
    renderAdminContent();
  } else {
    input.style.borderColor = 'var(--danger)';
    input.style.boxShadow   = '0 0 0 3px rgba(232,85,85,.15)';
    showToast('❌ Невірний пароль', 'error');
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
    }, 1500);
  }
}

function switchAdminTab(tab, btn) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
  btn.classList.add('active');
  document.getElementById(`tab-${tab}`).style.display = 'block';
  if (tab === 'settings') fillSettingsForm();
  if (tab === 'orders')   renderOrdersList();
}

function renderAdminContent() {
  renderAdminProducts();
}

// ==========================================
// ТОВАРИ В АДМІНІ
// ==========================================
function renderAdminProducts(filter = '') {
  const list = document.getElementById('admin-products-list');
  if (!list) return;

  let products = [...state.products];
  if (filter) {
    const q = filter.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  if (products.length === 0) {
    list.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:40px;font-size:14px;">Товари не знайдено</div>`;
    return;
  }

  list.innerHTML = products.map(p => {
    const imgHtml = p.image
      ? `<img class="admin-product-img" src="${escHtml(p.image)}" alt="${escHtml(p.name)}" onerror="this.style.display='none'" />`
      : `<div class="admin-product-img-placeholder">${p.imageEmoji || '🪑'}</div>`;

    const hiddenBadge  = p.status === 'hidden' ? `<span class="hidden-badge">приховано</span>` : '';
    const toggleTitle  = p.status === 'hidden' ? 'Показати' : 'Приховати';
    const toggleIcon   = p.status === 'hidden' ? '👁' : '🙈';

    return `
    <div class="admin-product-item" id="apl-${p.id}">
      ${imgHtml}
      <div class="admin-product-info">
        <div class="admin-product-name">${escHtml(p.name)} ${hiddenBadge}</div>
        <div class="admin-product-meta">${escHtml(p.category)}</div>
      </div>
      <div class="admin-product-price">${formatPrice(p.price)}</div>
      <div class="admin-product-actions">
        <button class="icon-btn icon-btn-hide" onclick="toggleProductVisibility(${p.id})" title="${toggleTitle}">${toggleIcon}</button>
        <button class="icon-btn icon-btn-edit" onclick="openProductEditor(${p.id})" title="Редагувати">✏️</button>
        <button class="icon-btn icon-btn-delete" onclick="deleteProduct(${p.id})" title="Видалити">🗑</button>
      </div>
    </div>`;
  }).join('');
}

function adminSearchProducts(query) {
  state.adminSearchQuery = query;
  renderAdminProducts(query);
}

function toggleProductVisibility(id) {
  const p = state.products.find(p => p.id === id);
  if (!p) return;
  p.status = p.status === 'hidden' ? 'active' : 'hidden';
  saveToStorage(LS_KEYS.products, state.products);
  renderAdminProducts(state.adminSearchQuery);
  renderCatalog();
  showToast(p.status === 'hidden' ? '🙈 Товар приховано' : '👁 Товар показано', 'success');
}

function deleteProduct(id) {
  if (!confirm('Видалити цей товар? Цю дію не можна скасувати.')) return;
  state.products = state.products.filter(p => p.id !== id);
  saveToStorage(LS_KEYS.products, state.products);
  renderAdminProducts(state.adminSearchQuery);
  renderCatalog();
  showToast('🗑 Товар видалено', 'success');
}

// ==========================================
// РЕДАКТОР ТОВАРУ
// ==========================================
let editorImageData = '';

function openProductEditor(id) {
  editorImageData = '';
  const overlay = document.getElementById('product-editor-overlay');

  if (id) {
    const p = state.products.find(p => p.id === id);
    if (!p) return;
    document.getElementById('editor-title').textContent = 'Редагувати товар';
    document.getElementById('edit-id').value         = id;
    document.getElementById('edit-name').value       = p.name;
    document.getElementById('edit-category').value   = p.category;
    document.getElementById('edit-price').value      = p.price;
    document.getElementById('edit-old-price').value  = p.oldPrice || '';
    document.getElementById('edit-desc').value       = p.desc  || '';
    document.getElementById('edit-specs').value      = p.specs || '';
    document.getElementById('edit-badge').value      = p.badge || '';
    document.getElementById('edit-status').value     = p.status || 'active';
    document.getElementById('edit-image-url').value  = p.image  || '';
    editorImageData = p.image || '';

    const preview = document.getElementById('edit-image-preview');
    if (p.image) {
      preview.src = p.image; preview.style.display = 'block';
      document.getElementById('upload-placeholder').style.display = 'none';
    } else {
      preview.style.display = 'none';
      document.getElementById('upload-placeholder').style.display = 'flex';
    }
  } else {
    document.getElementById('editor-title').textContent = 'Додати товар';
    ['edit-id','edit-name','edit-category','edit-price','edit-old-price',
     'edit-desc','edit-specs','edit-badge','edit-image-url'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('edit-status').value = 'active';
    document.getElementById('edit-image-preview').style.display = 'none';
    document.getElementById('upload-placeholder').style.display = 'flex';
  }

  // Заповнити datalist категорій
  const dl = document.getElementById('category-list');
  dl.innerHTML = getCategories().map(c => `<option value="${escHtml(c)}">`).join('');

  overlay.classList.add('open');
}

function closeProductEditor(event, force = false) {
  if (!force && event && !event.target.classList.contains('modal-overlay')) return;
  document.getElementById('product-editor-overlay').classList.remove('open');
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('❌ Файл занадто великий (макс. 5 МБ)', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    editorImageData = e.target.result;
    const preview = document.getElementById('edit-image-preview');
    preview.src = editorImageData; preview.style.display = 'block';
    document.getElementById('upload-placeholder').style.display = 'none';
    document.getElementById('edit-image-url').value = '';
  };
  reader.readAsDataURL(file);
}

function previewImageUrl(url) {
  if (!url) {
    editorImageData = '';
    document.getElementById('edit-image-preview').style.display = 'none';
    document.getElementById('upload-placeholder').style.display = 'flex';
    return;
  }
  editorImageData = url;
  const preview = document.getElementById('edit-image-preview');
  preview.src = url; preview.style.display = 'block';
  document.getElementById('upload-placeholder').style.display = 'none';
}

function saveProduct() {
  const nameEl  = document.getElementById('edit-name');
  const catEl   = document.getElementById('edit-category');
  const priceEl = document.getElementById('edit-price');

  if (!nameEl.value.trim())  { showToast('❌ Введіть назву товару', 'error'); nameEl.focus(); return; }
  if (!catEl.value.trim())   { showToast('❌ Введіть категорію', 'error'); catEl.focus(); return; }
  if (!priceEl.value || isNaN(parseFloat(priceEl.value))) { showToast('❌ Введіть коректну ціну', 'error'); priceEl.focus(); return; }

  const idVal  = document.getElementById('edit-id').value;
  const isNew  = !idVal;

  const productData = {
    id:       isNew ? Date.now() : parseInt(idVal),
    name:     nameEl.value.trim(),
    category: catEl.value.trim(),
    price:    parseFloat(priceEl.value),
    oldPrice: document.getElementById('edit-old-price').value ? parseFloat(document.getElementById('edit-old-price').value) : null,
    desc:     document.getElementById('edit-desc').value.trim(),
    specs:    document.getElementById('edit-specs').value.trim(),
    image:    editorImageData || '',
    imageEmoji: getCategoryEmoji(catEl.value.trim()),
    badge:    document.getElementById('edit-badge').value.trim(),
    status:   document.getElementById('edit-status').value
  };

  if (isNew) {
    state.products.unshift(productData);
    showToast('✅ Товар додано', 'success');
  } else {
    const idx = state.products.findIndex(p => p.id === parseInt(idVal));
    if (idx !== -1) state.products[idx] = productData;
    showToast('✅ Товар оновлено', 'success');
  }

  saveToStorage(LS_KEYS.products, state.products);
  closeProductEditor(null, true);
  renderAdminProducts(state.adminSearchQuery);
  renderCatalog();
}

function getCategoryEmoji(cat) {
  const map = {
    'Дивани': '🛋️', 'Ліжка': '🛏️', 'Кухні': '🍳', 'Шафи': '🚪',
    'Крісла': '🪑', 'Столи': '🪵', 'Дитяча': '🧸', 'Офіс': '💼',
    'Полиці': '📚', 'Пуфи': '🟤', 'Тумби': '🗄️', 'Комоди': '🗃️'
  };
  return map[cat] || '🪑';
}

// ==========================================
// НАЛАШТУВАННЯ
// ==========================================
function fillSettingsForm() {
  const s = state.settings;
  const fields = {
    's-site-name':    s.siteName,    's-hero-title':  s.heroTitle,
    's-hero-subtitle':s.heroSubtitle,'s-phone':       s.phone,
    's-email':        s.email,       's-address':     s.address,
    's-hours':        s.hours,       's-stat1-num':   s.stat1Num,
    's-stat1-label':  s.stat1Label,  's-stat2-num':   s.stat2Num,
    's-stat2-label':  s.stat2Label,  's-stat3-num':   s.stat3Num,
    's-stat3-label':  s.stat3Label,  's-about-title': s.aboutTitle,
    's-about-desc':   s.aboutDesc,   's-about-years': s.aboutYears
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  });
}

function saveSettings() {
  const fields = {
    siteName:     's-site-name',   heroTitle:    's-hero-title',
    heroSubtitle: 's-hero-subtitle', phone:      's-phone',
    email:        's-email',       address:      's-address',
    hours:        's-hours',       stat1Num:     's-stat1-num',
    stat1Label:   's-stat1-label', stat2Num:     's-stat2-num',
    stat2Label:   's-stat2-label', stat3Num:     's-stat3-num',
    stat3Label:   's-stat3-label', aboutTitle:   's-about-title',
    aboutDesc:    's-about-desc',  aboutYears:   's-about-years'
  };

  Object.entries(fields).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) state.settings[key] = el.value.trim();
  });

  const newPass = document.getElementById('s-new-password').value;
  if (newPass.trim()) {
    state.settings.password = newPass.trim();
    document.getElementById('s-new-password').value = '';
  }

  state.settings.footerCopy = `© ${new Date().getFullYear()} ${state.settings.siteName}. Усі права захищені.`;

  saveToStorage(LS_KEYS.settings, state.settings);
  applySettings();
  showToast('✅ Налаштування збережено', 'success');
}

// ==========================================
// ЗАЯВКИ
// ==========================================
function renderOrdersList() {
  const container = document.getElementById('orders-list');
  if (!container) return;

  if (state.orders.length === 0) {
    container.innerHTML = `<div class="no-orders">📭 Заявок поки немає</div>`;
    return;
  }

  container.innerHTML = state.orders.map(o => `
    <div class="order-item">
      <div class="order-item-header">
        <div class="order-product">${escHtml(o.productName)} ${o.productPrice !== '—' ? '— ' + o.productPrice : ''}</div>
        <div class="order-date">${o.date}</div>
      </div>
      <div class="order-contact">👤 ${escHtml(o.name)} &nbsp;|&nbsp; 📞 ${escHtml(o.phone)}</div>
      ${o.comment ? `<div class="order-comment">💬 ${escHtml(o.comment)}</div>` : ''}
    </div>
  `).join('');
}

function clearOrders() {
  if (!confirm('Видалити всі заявки?')) return;
  state.orders = [];
  saveToStorage(LS_KEYS.orders, state.orders);
  renderOrdersList();
  showToast('✅ Заявки очищено', 'success');
}

// ==========================================
// ШАПКА
// ==========================================
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
    });
  }
}

function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// SCROLL REVEAL
// ==========================================
function checkReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}

function initScrollReveal() {
  document.querySelectorAll('.step-card, .contact-item, .about-text, .about-image-wrap').forEach(el => {
    el.classList.add('reveal');
  });
  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal();
}

// ==========================================
// СПОВІЩЕННЯ (TOAST)
// ==========================================
let toastTimer;
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ==========================================
// КЛАВІАТУРА
// ==========================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal(null, true);
    closeOrderModal(null, true);
    closeProductEditor(null, true);
    if (document.getElementById('admin-overlay').classList.contains('open')) closeAdmin();
  }
});

// ==========================================
// УТИЛІТИ
// ==========================================
function formatPrice(price) {
  if (!price && price !== 0) return '';
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0
  }).format(price);
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
