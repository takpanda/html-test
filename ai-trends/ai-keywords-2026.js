const TAG_META = {
  HOT: { label: '🔥 HOT', className: 'tag-hot' },
  RISING: { label: '📈 RISING', className: 'tag-rising' },
  NEW: { label: '✨ NEW', className: 'tag-new' },
  CORE: { label: 'CORE', className: 'tag-core' }
};

function renderStats(stats) {
  const container = document.getElementById('stats');
  container.innerHTML = stats.map(stat => `
    <div class="stat">
      <div class="num">${stat.num}</div>
      <div class="label">${stat.label}</div>
    </div>
  `).join('');
}

function renderCategories(categories) {
  const container = document.getElementById('categories');
  container.innerHTML = categories.map(category => `
    <section class="category" id="${category.id}">
      <div class="category-header">
        <div class="category-icon">${category.icon}</div>
        <div>
          <div class="category-title">${category.title}</div>
          <div class="category-desc">${category.description}</div>
        </div>
      </div>
      <div class="keyword-grid">
        ${category.keywords.map(renderKeywordCard).join('')}
      </div>
    </section>
  `).join('');
}

function renderKeywordCard(keyword) {
  const tag = TAG_META[keyword.tag] || { label: keyword.tag, className: 'tag-core' };
  const score = Number(keyword.score || 0);
  return `
    <article class="keyword-card">
      <span class="tag ${tag.className}">${tag.label}</span>
      <h3>${keyword.name}</h3>
      <p>${keyword.description}</p>
      <div class="trend-bar">
        <div class="bar-bg"><div class="bar-fill" style="width:${score}%"></div></div>
        <div class="pct">${score}%</div>
      </div>
    </article>
  `;
}

async function loadPage() {
  const response = await fetch('./ai-keywords-2026-data.json');
  if (!response.ok) {
    throw new Error(`Failed to load data: ${response.status}`);
  }

  const data = await response.json();
  document.title = data.meta.pageTitle;
  document.getElementById('page-title').textContent = data.meta.title;
  document.getElementById('page-subtitle').textContent = data.meta.subtitle;
  document.getElementById('page-year').textContent = data.meta.year;
  document.getElementById('updated-at').textContent = data.meta.updatedAt;
  document.getElementById('repo-link').href = data.meta.repoUrl;

  renderStats(data.stats);
  renderCategories(data.categories);
}

loadPage().catch(error => {
  console.error(error);
  document.getElementById('categories').innerHTML = `
    <section class="error-panel">
      <h2>データの読み込みに失敗しました</h2>
      <p>${error.message}</p>
    </section>
  `;
});
