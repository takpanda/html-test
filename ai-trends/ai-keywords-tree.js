const TAG_META = {
  HOT: { label: '🔥 HOT', className: 'tag-hot' },
  RISING: { label: '📈 RISING', className: 'tag-rising' },
  NEW: { label: '✨ NEW', className: 'tag-new' },
  CORE: { label: 'CORE', className: 'tag-core' }
};

function renderStats(data) {
  const keywordCount = data.categories.reduce((sum, category) => sum + category.keywords.length, 0);
  const stats = [
    { value: data.categories.length, label: 'カテゴリ' },
    { value: keywordCount, label: 'キーワード' },
    { value: 'Tree', label: '表示モード' }
  ];

  document.getElementById('tree-stats').innerHTML = stats.map(stat => `
    <div class="stat-chip">
      <strong>${stat.value}</strong>
      <span>${stat.label}</span>
    </div>
  `).join('');
}

function renderKeyword(keyword) {
  const tag = TAG_META[keyword.tag] || { label: keyword.tag, className: 'tag-core' };
  return `
    <li class="tree-node">
      <div class="node-card keyword-item">
        <div class="node-title">${keyword.name}</div>
        <div class="node-desc">${keyword.description}</div>
        <div class="keyword-meta">
          <span class="tag ${tag.className}">${tag.label}</span>
          <span class="score">${keyword.score}%</span>
        </div>
      </div>
    </li>
  `;
}

function renderCategory(category) {
  return `
    <li class="tree-node">
      <details class="category-details" open>
        <summary class="node-card category-card">
          <div class="summary-main">
            <div class="node-icon">${category.icon}</div>
            <div>
              <div class="node-title">${category.title}</div>
              <div class="node-desc">${category.description}</div>
            </div>
          </div>
          <span class="chevron">›</span>
        </summary>
        <ul class="keyword-list">
          ${category.keywords.map(renderKeyword).join('')}
        </ul>
      </details>
    </li>
  `;
}

function attachActions() {
  const detailsNodes = () => Array.from(document.querySelectorAll('.category-details'));
  document.getElementById('expand-all').addEventListener('click', () => {
    detailsNodes().forEach(node => { node.open = true; });
  });
  document.getElementById('collapse-all').addEventListener('click', () => {
    detailsNodes().forEach(node => { node.open = false; });
  });
}

async function loadTreePage() {
  const response = await fetch('./ai-keywords-2026-data.json');
  if (!response.ok) {
    throw new Error(`Failed to load data: ${response.status}`);
  }

  const data = await response.json();
  document.title = `${data.meta.title} - ツリービュー`;
  document.getElementById('page-title').textContent = `${data.meta.title} - ツリービュー`;
  renderStats(data);
  document.getElementById('tree-root').innerHTML = `<ul>${data.categories.map(renderCategory).join('')}</ul>`;
  attachActions();
}

loadTreePage().catch(error => {
  console.error(error);
  document.getElementById('tree-root').innerHTML = `<p>データの読み込みに失敗しました: ${error.message}</p>`;
});
