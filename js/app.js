/**
 * 我的收藏中心 - 主应用逻辑
 */
(function() {
  'use strict';

  // ========================================
  // 状态管理
  // ========================================
  const state = {
    data: null,
    currentCategory: 'all',
    currentView: 'grid', // 'grid' | 'list'
    searchQuery: '',
    currentItem: null,
    lightboxImages: [],
    lightboxIndex: 0,
    showTrash: false,
  };

  // ========================================
  // DOM 引用
  // ========================================
  const dom = {
    authScreen: document.getElementById('auth-screen'),
    authPassword: document.getElementById('auth-password'),
    authSubmit: document.getElementById('auth-submit'),
    authError: document.getElementById('auth-error'),
    app: document.getElementById('app'),
    menuToggle: document.getElementById('menu-toggle'),
    logoLink: document.getElementById('logo-link'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    sidebarClose: document.getElementById('sidebar-close'),
    categoryTree: document.getElementById('category-tree'),
    countAll: document.getElementById('count-all'),
    searchInput: document.getElementById('search-input'),
    viewToggle: document.getElementById('view-toggle'),
    homeView: document.getElementById('home-view'),
    detailView: document.getElementById('detail-view'),
    contentGrid: document.getElementById('content-grid'),
    emptyState: document.getElementById('empty-state'),
    currentFilter: document.getElementById('current-filter'),
    resultCount: document.getElementById('result-count'),
    activeFilters: document.getElementById('active-filters'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxCaption: document.getElementById('lightbox-caption'),
    mainContent: document.getElementById('main-content'),
  };

  // ========================================
  // 图标库
  // ========================================
  const icons = {
    'fork-knife': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
    'fire': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    'store': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>',
    'leaf': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
    'tshirt': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
    'camera': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    'cpu': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
    'shopping-bag': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    'lightbulb': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
    'microphone': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>',
  };

  const sourceLabels = {
    'douyin': '抖音',
    'xiaohongshu': '小红书',
    'bilibili': 'B站',
    'youtube': 'YouTube',
    'twitter': 'X',
    'other': '其他',
  };

  // ========================================
  // 回收站模块
  // ========================================
  const trashManager = {
    STORAGE_KEY: 'collection_deleted_items',

    getDeletedIds() {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
      } catch {
        return [];
      }
    },

    isDeleted(id) {
      return this.getDeletedIds().includes(id);
    },

    deleteItem(id) {
      const ids = this.getDeletedIds();
      if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
      }
    },

    restoreItem(id) {
      const ids = this.getDeletedIds().filter(i => i !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
    },

    getDeletedItems() {
      const ids = this.getDeletedIds();
      return dataManager.getAllItems().filter(item => ids.includes(item.id));
    },

    count() {
      return this.getDeletedIds().length;
    },
  };

  // ========================================
  // 认证模块
  // ========================================
  const auth = {
    init() {
      // 检查已有会话
      const session = this.getSession();
      if (session && session.expires > Date.now()) {
        this.showApp();
        return;
      }

      // 显示登录界面
      dom.authScreen.style.display = 'flex';
      dom.authPassword.focus();

      // 事件绑定
      dom.authSubmit.addEventListener('click', () => this.checkPassword());
      dom.authPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.checkPassword();
      });
    },

    checkPassword() {
      const input = dom.authPassword.value.trim();
      if (input === SITE_CONFIG.password) {
        this.setSession();
        this.showApp();
      } else {
        dom.authError.style.display = 'block';
        dom.authPassword.value = '';
        dom.authPassword.focus();
        setTimeout(() => {
          dom.authError.style.display = 'none';
        }, 3000);
      }
    },

    setSession() {
      const session = {
        token: btoa(SITE_CONFIG.password + Date.now()),
        expires: Date.now() + SITE_CONFIG.sessionHours * 3600 * 1000,
      };
      localStorage.setItem('collection_auth', JSON.stringify(session));
    },

    getSession() {
      try {
        return JSON.parse(localStorage.getItem('collection_auth'));
      } catch {
        return null;
      }
    },

    showApp() {
      dom.authScreen.style.display = 'none';
      dom.app.style.display = 'block';
      app.init();
    },
  };

  // ========================================
  // 数据模块
  // ========================================
  const dataManager = {
    async load() {
      try {
        const res = await fetch(SITE_CONFIG.dataPath + '?t=' + Date.now());
        if (!res.ok) throw new Error('Failed to load data');
        state.data = await res.json();
        return state.data;
      } catch (err) {
        console.error('数据加载失败:', err);
        return null;
      }
    },

    getCategories() {
      return state.data ? state.data.categories : [];
    },

    getAllItems() {
      return state.data ? state.data.items : [];
    },

    getItems() {
      // 过滤掉已删除的条目
      return this.getAllItems().filter(item => !trashManager.isDeleted(item.id));
    },

    getCategoryById(id) {
      return this.getCategories().find(c => c.id === id);
    },

    getChildCategories(parentId) {
      return this.getCategories()
        .filter(c => c.parent === parentId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },

    getRootCategories() {
      return this.getCategories()
        .filter(c => !c.parent)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },

    getItemById(id) {
      return this.getItems().find(item => item.id === id);
    },

    countItemsByCategory(catId) {
      if (catId === 'all') return this.getItems().length;
      // 包含子分类
      const childIds = this.getChildCategories(catId).map(c => c.id);
      const allIds = [catId, ...childIds];
      return this.getItems().filter(item =>
        item.categories && item.categories.some(c => allIds.includes(c))
      ).length;
    },
  };

  // ========================================
  // 路由模块
  // ========================================
  const router = {
    init() {
      window.addEventListener('hashchange', () => this.handle());
      this.handle();
    },

    handle() {
      const hash = window.location.hash.slice(1) || '/';
      const parts = hash.split('/').filter(Boolean);

      if (parts.length === 0 || parts[0] === '') {
        this.showHome();
      } else if (parts[0] === 'item' && parts[1]) {
        this.showDetail(parts[1]);
      } else {
        this.showHome();
      }
    },

    showHome() {
      // 如果在回收站视图，保持回收站内容
      if (!state.showTrash) {
        // 恢复 homeView 原始结构（如果被回收站视图替换过）
        if (!dom.homeView.querySelector('#content-grid')) {
          dom.homeView.innerHTML = `
            <div class="filter-bar">
              <div class="filter-info">
                <span id="current-filter" class="current-filter">全部收藏</span>
                <span id="result-count" class="result-count">0 条</span>
              </div>
              <div class="filter-tags" id="active-filters"></div>
            </div>
            <div id="content-grid" class="content-grid"></div>
            <div id="empty-state" class="empty-state" style="display:none;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <p>暂无收藏内容</p>
              <p class="empty-hint">把你想收藏的链接发给助手，内容会出现在这里</p>
            </div>
          `;
          // 重新获取 DOM 引用
          dom.contentGrid = document.getElementById('content-grid');
          dom.emptyState = document.getElementById('empty-state');
          dom.currentFilter = document.getElementById('current-filter');
          dom.resultCount = document.getElementById('result-count');
          dom.activeFilters = document.getElementById('active-filters');
          renderer.updateActiveCategory();
          renderer.renderContentGrid();
        }
      }
      dom.homeView.style.display = 'block';
      dom.detailView.style.display = 'none';
      dom.searchInput.value = state.searchQuery;
      window.scrollTo(0, 0);
    },

    showDetail(id) {
      const item = dataManager.getItemById(id);
      if (!item) {
        this.navigate('/');
        return;
      }
      state.currentItem = item;
      dom.homeView.style.display = 'none';
      dom.detailView.style.display = 'block';
      renderer.renderDetail(item);
      window.scrollTo(0, 0);
    },

    navigate(path) {
      window.location.hash = path;
    },
  };

  // ========================================
  // 渲染模块
  // ========================================
  const renderer = {
    renderSidebar() {
      const categories = dataManager.getRootCategories();
      const allCount = dataManager.getItems().length;
      dom.countAll.textContent = allCount;

      let html = '<div class="sidebar-section-title">分类</div>';
      categories.forEach(cat => {
        const count = dataManager.countItemsByCategory(cat.id);
        const icon = icons[cat.icon] || icons['lightbulb'];
        const children = dataManager.getChildCategories(cat.id);

        html += `<button class="sidebar-item" data-category="${cat.id}">
          ${icon}
          <span>${cat.name}</span>
          <span class="sidebar-count">${count}</span>
        </button>`;

        if (children.length > 0) {
          children.forEach(child => {
            const childCount = dataManager.countItemsByCategory(child.id);
            const childIcon = icons[child.icon] || icons['lightbulb'];
            html += `<button class="sidebar-item sidebar-sub" data-category="${child.id}">
              ${childIcon}
              <span>${child.name}</span>
              <span class="sidebar-count">${childCount}</span>
            </button>`;
          });
        }
      });

      dom.categoryTree.innerHTML = html;

      // 绑定分类点击
      dom.categoryTree.querySelectorAll('.sidebar-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const catId = btn.dataset.category;
          state.currentCategory = catId;
          state.showTrash = false;
          this.updateActiveCategory();
          this.renderContentGrid();
          this.closeSidebarMobile();
          router.navigate('/');
        });
      });

      // 回收站按钮
      const trashBtn = document.getElementById('trash-btn');
      if (trashBtn) {
        trashBtn.addEventListener('click', () => {
          state.showTrash = true;
          state.currentCategory = 'all';
          this.updateActiveCategory();
          this.renderTrashView();
          this.closeSidebarMobile();
          router.navigate('/');
        });
      }

      // 更新回收站计数
      const trashCount = document.getElementById('trash-count');
      if (trashCount) {
        trashCount.textContent = trashManager.count();
      }
    },

    updateActiveCategory() {
      document.querySelectorAll('.sidebar-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === state.currentCategory) {
          btn.classList.add('active');
        }
      });

      // 更新筛选信息
      const cat = state.currentCategory === 'all'
        ? null
        : dataManager.getCategoryById(state.currentCategory);
      dom.currentFilter.textContent = cat ? cat.name : '全部收藏';
    },

    getFilteredItems() {
      const allItems = dataManager.getAllItems();
      let items = dataManager.getItems();

      // 建立id到数组位置的映射，用于按加入顺序排序
      const indexMap = {};
      allItems.forEach((item, idx) => {
        indexMap[item.id] = idx;
      });

      // 分类筛选
      if (state.currentCategory !== 'all') {
        const catId = state.currentCategory;
        const childIds = dataManager.getChildCategories(catId).map(c => c.id);
        const allIds = [catId, ...childIds];
        items = items.filter(item =>
          item.categories && item.categories.some(c => allIds.includes(c))
        );
      }

      // 搜索筛选
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        items = items.filter(item => {
          const title = (item.title || '').toLowerCase();
          const summary = (item.summary || '').toLowerCase();
          const tags = (item.tags || []).join(' ').toLowerCase();
          const transcript = (item.transcript || '').toLowerCase();
          return title.includes(q) || summary.includes(q) || tags.includes(q) || transcript.includes(q);
        });
      }

      // 按加入收藏的顺序排序（数组中越靠后=越新加入，显示在前面）
      items.sort((a, b) => (indexMap[b.id] ?? 0) - (indexMap[a.id] ?? 0));

      return items;
    },

    renderContentGrid() {
      const items = this.getFilteredItems();
      dom.resultCount.textContent = items.length + ' 条';

      if (items.length === 0) {
        dom.contentGrid.style.display = 'none';
        dom.emptyState.style.display = 'block';
        return;
      }

      dom.contentGrid.style.display = 'grid';
      dom.emptyState.style.display = 'none';

      // 更新视图模式
      dom.contentGrid.classList.toggle('list-mode', state.currentView === 'list');

      let html = '';
      items.forEach(item => {
        html += this.renderCard(item);
      });
      dom.contentGrid.innerHTML = html;

      // 绑定卡片点击
      dom.contentGrid.querySelectorAll('.content-card').forEach(card => {
        card.addEventListener('click', () => {
          router.navigate('/item/' + card.dataset.id);
        });
      });
    },

    renderCard(item) {
      const typeLabel = item.type === 'video' ? '视频' : '图文';
      const sourceLabel = sourceLabels[item.source] || item.source || '';
      const date = item.savedDate || '';
      const thumbnail = item.thumbnail || '';

      // 缩略图
      let thumbHtml;
      if (thumbnail) {
        thumbHtml = `<img src="${thumbnail}" alt="${this.escape(item.title)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <div class="card-thumbnail-placeholder" style="display:none;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </div>`;
      } else {
        thumbHtml = `<div class="card-thumbnail-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </div>`;
      }

      // 分类标签
      let catHtml = '';
      if (item.categories && item.categories.length > 0) {
        const catNames = item.categories.slice(0, 2).map(cid => {
          const cat = dataManager.getCategoryById(cid);
          return cat ? cat.name : '';
        }).filter(Boolean);
        catHtml = catNames.map(name => `<span class="card-category">${this.escape(name)}</span>`).join('');
      }

      return `<div class="content-card" data-id="${item.id}">
        <div class="card-thumbnail">
          <span class="card-type-badge ${item.type}">${typeLabel}</span>
          <span class="card-source">${this.escape(sourceLabel)}</span>
          ${thumbHtml}
        </div>
        <div class="card-body">
          <div class="card-title">${this.escape(item.title)}</div>
          <div class="card-meta">
            <div class="card-categories">${catHtml}</div>
            <span class="card-date">${date}</span>
          </div>
        </div>
      </div>`;
    },

    renderDetail(item) {
      const typeLabel = item.type === 'video' ? '视频' : '图文';
      const sourceLabel = sourceLabels[item.source] || item.source || '';
      const date = item.savedDate || '';

      let html = `
        <div class="detail-top-bar">
          <div class="detail-back" onclick="window.location.hash='/'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            返回
          </div>
          <button class="detail-delete-btn" id="detail-delete-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            删除
          </button>
        </div>
      `;

      // 标题区
      html += `
        <div class="detail-header">
          <h1 class="detail-title">${this.escape(item.title)}</h1>
          <div class="detail-meta">
            <span class="detail-badge ${item.type}">${typeLabel}</span>
            <span class="detail-source">${this.escape(sourceLabel)}</span>
            <span class="detail-date">${date}</span>
          </div>
        </div>
      `;

      // 分类
      if (item.categories && item.categories.length > 0) {
        const cats = item.categories.map(cid => {
          const cat = dataManager.getCategoryById(cid);
          return cat ? `<span class="detail-category">${this.escape(cat.name)}</span>` : '';
        }).join('');
        html += `<div class="detail-section">
          <div class="detail-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            分类
          </div>
          <div class="detail-categories">${cats}</div>
        </div>`;
      }

      // 摘要
      if (item.summary || item.summaryPoints) {
        html += `<div class="detail-section">
          <div class="detail-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            内容摘要
          </div>`;

        if (item.summary) {
          html += `<p class="detail-summary-text">${this.escape(item.summary)}</p>`;
        }

        if (item.summaryPoints && item.summaryPoints.length > 0) {
          html += `<ul class="detail-summary-points">`;
          item.summaryPoints.forEach(point => {
            html += `<li>${this.escape(point)}</li>`;
          });
          html += `</ul>`;
        }

        html += `</div>`;
      }

      // 视频类型：关键帧
      if (item.type === 'video' && item.keyframes && item.keyframes.length > 0) {
        html += `<div class="detail-section">
          <div class="detail-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            关键画面
          </div>
          <div class="keyframe-list">`;

        item.keyframes.forEach((kf, idx) => {
          const imgHtml = kf.image
            ? `<img src="${kf.image}" alt="${this.escape(kf.caption || '')}" onerror="this.parentElement.innerHTML='<div class=&quot;keyframe-image-placeholder&quot;><svg width=&quot;48&quot; height=&quot;48&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;1.5&quot;><rect x=&quot;2&quot; y=&quot;2&quot; width=&quot;20&quot; height=&quot;20&quot; rx=&quot;2&quot;/></svg></div>';">`
            : `<div class="keyframe-image-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/></svg></div>`;

          html += `<div class="keyframe-item">
            <span class="keyframe-time">${this.escape(kf.time || '')}</span>
            <div class="keyframe-image" data-lightbox-idx="${idx}" data-lightbox-group="keyframes">
              ${imgHtml}
            </div>
            ${kf.caption ? `<p class="keyframe-caption">${this.escape(kf.caption)}</p>` : ''}
          </div>`;
        });

        html += `</div></div>`;
      }

      // 图文类型：图片
      if (item.type === 'image-text' && item.images && item.images.length > 0) {
        html += `<div class="detail-section">
          <div class="detail-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            图片
          </div>
          <div class="image-list">`;

        item.images.forEach((img, idx) => {
          const imgHtml = img.image
            ? `<img src="${img.image}" alt="${this.escape(img.caption || '')}" onerror="this.parentElement.innerHTML='<div class=&quot;image-placeholder&quot;><svg width=&quot;48&quot; height=&quot;48&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;1.5&quot;><rect x=&quot;3&quot; y=&quot;3&quot; width=&quot;18&quot; height=&quot;18&quot; rx=&quot;2&quot;/></svg></div>';">`
            : `<div class="image-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div>`;

          html += `<div class="image-item">
            <div class="image-image" data-lightbox-idx="${idx}" data-lightbox-group="images">
              ${imgHtml}
            </div>
            ${img.caption ? `<p class="image-caption">${this.escape(img.caption)}</p>` : ''}
          </div>`;
        });

        html += `</div></div>`;
      }

      // 视频字幕
      if (item.type === 'video' && item.transcript) {
        html += `<div class="detail-section">
          <div class="detail-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
            字幕全文
          </div>
          <div class="detail-transcript">${this.escape(item.transcript)}</div>
        </div>`;
      }

      // 图文原文
      if (item.type === 'image-text' && item.originalText) {
        html += `<div class="detail-section">
          <div class="detail-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            原文内容
          </div>
          <div class="detail-original-text">${this.escape(item.originalText)}</div>
        </div>`;
      }

      // 标签
      if (item.tags && item.tags.length > 0) {
        const tagsHtml = item.tags.map(tag =>
          `<span class="detail-tag">#${this.escape(tag)}</span>`
        ).join('');
        html += `<div class="detail-section">
          <div class="detail-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            标签
          </div>
          <div class="detail-tags">${tagsHtml}</div>
        </div>`;
      }

      // 原始链接
      if (item.sourceUrl) {
        html += `<div class="detail-section" style="text-align:center;">
          <a href="${this.escape(item.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="detail-source-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            查看原始链接
          </a>
        </div>`;
      }

      dom.detailView.innerHTML = html;

      // 绑定灯箱
      this.bindLightbox(item);

      // 绑定删除按钮
      const deleteBtn = document.getElementById('detail-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          this.showDeleteConfirm(item);
        });
      }
    },

    showDeleteConfirm(item) {
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';
      overlay.innerHTML = `
        <div class="confirm-dialog">
          <div class="confirm-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3 class="confirm-title">确认删除？</h3>
          <p class="confirm-desc">"${this.escape(item.title.substring(0, 30))}${item.title.length > 30 ? '...' : ''}"</p>
          <p class="confirm-hint">删除后可在回收站中恢复</p>
          <div class="confirm-buttons">
            <button class="confirm-cancel" id="confirm-cancel">取消</button>
            <button class="confirm-delete" id="confirm-ok">删除</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('confirm-cancel').addEventListener('click', () => {
        document.body.removeChild(overlay);
      });
      document.getElementById('confirm-ok').addEventListener('click', () => {
        trashManager.deleteItem(item.id);
        document.body.removeChild(overlay);
        renderer.renderSidebar();
        router.navigate('/');
        renderer.renderContentGrid();
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) document.body.removeChild(overlay);
      });
    },

    renderTrashView() {
      const deletedItems = trashManager.getDeletedItems();

      let html = `
        <div class="filter-bar">
          <div class="filter-info">
            <span class="current-filter">回收站</span>
            <span class="result-count">${deletedItems.length} 条</span>
          </div>
        </div>
      `;

      if (deletedItems.length === 0) {
        html += `<div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <p>回收站为空</p>
          <p class="empty-hint">删除的内容会出现在这里，可随时恢复</p>
        </div>`;
      } else {
        html += '<div class="trash-list">';
        deletedItems.forEach(item => {
          const sourceLabel = sourceLabels[item.source] || item.source || '';
          const typeLabel = item.type === 'video' ? '视频' : '图文';
          const date = item.savedDate || '';

          let catHtml = '';
          if (item.categories && item.categories.length > 0) {
            const catNames = item.categories.slice(0, 2).map(cid => {
              const cat = dataManager.getCategoryById(cid);
              return cat ? cat.name : '';
            }).filter(Boolean);
            catHtml = catNames.map(name => `<span class="card-category">${this.escape(name)}</span>`).join('');
          }

          html += `<div class="trash-item">
            <div class="trash-item-info">
              <div class="trash-item-top">
                <span class="card-type-badge ${item.type}">${typeLabel}</span>
                <span class="card-source-inline">${this.escape(sourceLabel)}</span>
                <span class="trash-item-title">${this.escape(item.title)}</span>
              </div>
              <div class="card-meta">
                <div class="card-categories">${catHtml}</div>
                <span class="card-date">${date}</span>
              </div>
            </div>
            <button class="restore-btn" data-id="${item.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
              </svg>
              恢复
            </button>
          </div>`;
        });
        html += '</div>';
      }

      dom.homeView.innerHTML = html;
      dom.homeView.style.display = 'block';
      dom.detailView.style.display = 'none';

      // 绑定恢复按钮
      document.querySelectorAll('.restore-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          trashManager.restoreItem(id);
          renderer.renderSidebar();
          renderer.renderTrashView();
        });
      });
    },

    bindLightbox(item) {
      const images = [];
      if (item.type === 'video' && item.keyframes) {
        item.keyframes.forEach((kf, idx) => {
          if (kf.image) {
            images.push({ src: kf.image, caption: kf.time + (kf.caption ? ' - ' + kf.caption : '') });
          }
        });
      } else if (item.type === 'image-text' && item.images) {
        item.images.forEach(img => {
          if (img.image) {
            images.push({ src: img.image, caption: img.caption || '' });
          }
        });
      }

      state.lightboxImages = images;

      document.querySelectorAll('[data-lightbox-idx]').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.lightboxIdx);
          lightbox.open(idx);
        });
      });
    },

    closeSidebarMobile() {
      if (window.innerWidth < 1024) {
        dom.sidebar.classList.remove('open');
        dom.sidebarOverlay.style.display = 'none';
      }
    },

    escape(str) {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = String(str);
      return div.innerHTML;
    },
  };

  // ========================================
  // 灯箱模块
  // ========================================
  const lightbox = {
    open(index) {
      state.lightboxIndex = index;
      this.show();
      dom.lightbox.style.display = 'flex';
    },

    show() {
      const img = state.lightboxImages[state.lightboxIndex];
      if (!img) return;
      dom.lightboxImg.src = img.src;
      dom.lightboxCaption.textContent = img.caption || '';
    },

    next() {
      state.lightboxIndex = (state.lightboxIndex + 1) % state.lightboxImages.length;
      this.show();
    },

    prev() {
      state.lightboxIndex = (state.lightboxIndex - 1 + state.lightboxImages.length) % state.lightboxImages.length;
      this.show();
    },

    close() {
      dom.lightbox.style.display = 'none';
    },

    init() {
      dom.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
      dom.lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); this.next(); });
      dom.lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
      dom.lightbox.addEventListener('click', (e) => {
        if (e.target === dom.lightbox) this.close();
      });
      document.addEventListener('keydown', (e) => {
        if (dom.lightbox.style.display === 'none') return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowRight') this.next();
        if (e.key === 'ArrowLeft') this.prev();
      });
    },
  };

  // ========================================
  // 主应用
  // ========================================
  const app = {
    async init() {
      // 加载数据
      await dataManager.load();

      // 渲染侧边栏
      renderer.renderSidebar();

      // 渲染内容网格
      renderer.renderContentGrid();

      // 更新激活分类
      renderer.updateActiveCategory();

      // 初始化路由
      router.init();

      // 初始化灯箱
      lightbox.init();

      // 绑定全局事件
      this.bindEvents();
    },

    bindEvents() {
      // "全部收藏"按钮点击
      const allBtn = document.querySelector('[data-category="all"]');
      if (allBtn) {
        allBtn.addEventListener('click', () => {
          state.currentCategory = 'all';
          state.showTrash = false;
          router.showHome();
          renderer.updateActiveCategory();
          renderer.renderContentGrid();
          renderer.closeSidebarMobile();
          router.navigate('/');
        });
      }

      // 菜单切换（移动端）
      dom.menuToggle.addEventListener('click', () => {
        dom.sidebar.classList.add('open');
        dom.sidebarOverlay.style.display = 'block';
      });

      dom.sidebarClose.addEventListener('click', () => {
        dom.sidebar.classList.remove('open');
        dom.sidebarOverlay.style.display = 'none';
      });

      dom.sidebarOverlay.addEventListener('click', () => {
        dom.sidebar.classList.remove('open');
        dom.sidebarOverlay.style.display = 'none';
      });

      // Logo 点击
      dom.logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        state.currentCategory = 'all';
        state.searchQuery = '';
        state.showTrash = false;
        router.showHome();
        renderer.updateActiveCategory();
        renderer.renderContentGrid();
        router.navigate('/');
        renderer.closeSidebarMobile();
      });

      // 搜索
      let searchTimer;
      dom.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          state.searchQuery = e.target.value.trim();
          renderer.renderContentGrid();
        }, 200);
      });

      // 视图切换
      dom.viewToggle.addEventListener('click', () => {
        state.currentView = state.currentView === 'grid' ? 'list' : 'grid';
        renderer.renderContentGrid();
      });
    },
  };

  // ========================================
  // 启动
  // ========================================
  auth.init();

})();
