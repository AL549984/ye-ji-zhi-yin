import './styles.css';
import { productData } from './data/product-data.js';

const app = document.querySelector('#app');
const allEvents = productData.events;

const state = {
  region: '全部地区',
  sector: '全部板块',
  strength: '全部信号',
  direction: '全部方向',
  query: '',
  view: 'table'
};

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const unique = values => [...new Set(values)];
const csvEscape = value => `"${String(value ?? '').replaceAll('"', '""')}"`;

const makeFilterOptions = (label, values) => [label, ...unique(values)]
  .map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
  .join('');

const latestEvents = [...allEvents].sort((a, b) => b.date.localeCompare(a.date));

const metricCards = productData.metrics.map((item, index) => `
  <article class="metric-tile surface reveal" style="--delay:${index * 60}ms">
    <span>0${index + 1}</span>
    <strong data-count="${escapeHtml(item.value)}">0</strong>
    <p>${escapeHtml(item.label)}</p>
  </article>
`).join('');

const latestSignals = latestEvents.slice(0, 4).map(item => `
  <li>
    <span>${escapeHtml(item.date)}</span>
    <strong>${escapeHtml(item.company)}</strong>
    <em>${escapeHtml(item.strength)}</em>
  </li>
`).join('');

const exchangeChips = productData.exchanges.map(exchange => `<span>${escapeHtml(exchange)}</span>`).join('');
const countries = productData.countries.map(country => `<span>${escapeHtml(country)}</span>`).join('、');

const qualityTiles = productData.completeness.map(item => `
  <article class="quality-tile">
    <strong>${escapeHtml(item.value)}</strong>
    <span>${escapeHtml(item.label)}</span>
  </article>
`).join('');

const insightCards = productData.insights.map((item, index) => `
  <article class="insight-card surface reveal" style="--delay:${index * 80}ms">
    <span>0${index + 1}</span>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.text)}</p>
  </article>
`).join('');

const methodCards = productData.methodology.map((item, index) => `
  <article class="method-card reveal" style="--delay:${index * 70}ms">
    <span>${String(index + 1).padStart(2, '0')}</span>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.text)}</p>
  </article>
`).join('');

const getFilteredEvents = () => allEvents.filter(item => {
  const haystack = [
    item.company,
    item.ticker,
    item.region,
    item.sector,
    item.eventType,
    item.strength,
    item.direction,
    item.impactChain,
    item.relatedLinks,
    item.signal,
    item.excerpt,
    item.interpretation,
    item.source
  ].join(' ').toLowerCase();

  return (state.region === '全部地区' || item.region === state.region)
    && (state.sector === '全部板块' || item.sector === state.sector)
    && (state.strength === '全部信号' || item.strength === state.strength)
    && (state.direction === '全部方向' || item.direction === state.direction)
    && haystack.includes(state.query.trim().toLowerCase());
});

const summarizeEvents = events => {
  if (!events.length) return '当前筛选没有命中事件样本。';
  const regionCount = unique(events.map(item => item.region)).length;
  const sectorEntries = Object.entries(events.reduce((acc, item) => {
    acc[item.sector] = (acc[item.sector] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
  const topSectors = sectorEntries.filter(item => item[1] === sectorEntries[0][1]).map(item => item[0]);
  const sectorText = sectorEntries.length === 1
    ? `命中板块为 ${sectorEntries[0][0]}`
    : topSectors.length === sectorEntries.length
      ? '样本分布较分散'
      : `集中板块为 ${topSectors.slice(0, 2).join('、')}`;
  const latestDate = [...events].sort((a, b) => b.date.localeCompare(a.date))[0].date;

  return `命中 ${events.length} 条，覆盖 ${regionCount} 个地区；${sectorText}，最新事件日期 ${latestDate}。`;
};

const renderRows = events => {
  if (!events.length) {
    return '<tr><td class="empty-state" colspan="6">没有匹配的事件样本，换一个筛选条件或关键词试试。</td></tr>';
  }

  return events.map(item => `
    <tr>
      <td class="company-cell">
        <strong>${escapeHtml(item.company)}</strong>
        <span>${escapeHtml(item.eventType)}</span>
        <em>${escapeHtml(item.ticker)}</em>
      </td>
      <td class="market-cell">
        <strong>${escapeHtml(item.region)}</strong>
        <span>${escapeHtml(item.sector)}</span>
      </td>
      <td class="signal-cell">
        <mark>${escapeHtml(item.strength)}</mark>
        <span>${escapeHtml(item.direction)}</span>
      </td>
      <td class="date-cell">${escapeHtml(item.date)}</td>
      <td class="evidence-cell">
        <p>${escapeHtml(item.signal)}</p>
        <small>${escapeHtml(item.excerpt)}</small>
        <span>${escapeHtml(item.interpretation)}</span>
      </td>
      <td class="source-actions">
        <a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noreferrer">来源</a>
        <a href="${escapeHtml(item.recordUrl)}" target="_blank" rel="noreferrer">Base</a>
      </td>
    </tr>
  `).join('');
};

const renderCards = events => {
  if (!events.length) return '<div class="empty-card surface">没有匹配的事件样本。</div>';

  return events.map(item => `
    <article class="event-card surface">
      <div class="event-head">
        <div><strong>${escapeHtml(item.company)}</strong><span>${escapeHtml(item.ticker)}</span></div>
        <mark>${escapeHtml(item.strength)}</mark>
      </div>
      <p>${escapeHtml(item.signal)}</p>
      <dl>
        <div><dt>地区</dt><dd>${escapeHtml(item.region)}</dd></div>
        <div><dt>板块</dt><dd>${escapeHtml(item.sector)}</dd></div>
        <div><dt>方向</dt><dd>${escapeHtml(item.direction)}</dd></div>
        <div><dt>日期</dt><dd>${escapeHtml(item.date)}</dd></div>
      </dl>
      <section>
        <span>产业链解读</span>
        <p>${escapeHtml(item.interpretation)}</p>
      </section>
      <footer>
        <a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(item.source)}</a>
        <a href="${escapeHtml(item.recordUrl)}" target="_blank" rel="noreferrer">Base 记录</a>
      </footer>
    </article>
  `).join('');
};

const renderWorkbench = () => {
  const filteredEvents = getFilteredEvents();
  const count = document.querySelector('[data-result-count]');
  const summary = document.querySelector('[data-filter-summary]');
  const tbody = document.querySelector('[data-event-rows]');
  const cards = document.querySelector('[data-card-rows]');
  const tableShell = document.querySelector('[data-table-view]');
  const cardShell = document.querySelector('[data-card-view]');

  count.textContent = `${filteredEvents.length}/${allEvents.length}`;
  summary.textContent = summarizeEvents(filteredEvents);
  tbody.innerHTML = renderRows(filteredEvents);
  cards.innerHTML = renderCards(filteredEvents);
  tableShell.hidden = state.view !== 'table';
  cardShell.hidden = state.view !== 'card';

  document.querySelectorAll('[data-view]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === state.view));
  });
};

const exportCsv = () => {
  const rows = getFilteredEvents();
  const headers = ['公司', '代码/上市地', '地区', '板块', '事件类型', '信号强度', '方向', '日期', '信号', '摘录', '产业链', '解读', '来源', '官方链接'];
  const body = rows.map(item => [
    item.company,
    item.ticker,
    item.region,
    item.sector,
    item.eventType,
    item.strength,
    item.direction,
    item.date,
    item.signal,
    item.excerpt,
    item.impactChain,
    item.interpretation,
    item.source,
    item.sourceUrl
  ].map(csvEscape).join(','));
  const csv = [headers.map(csvEscape).join(','), ...body].join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'guidance-monitor-events.csv';
  link.click();
  URL.revokeObjectURL(url);
};

app.innerHTML = `
  <nav class="topbar">
    <a class="brand" href="#top" aria-label="Guidance Monitor 首页">
      <span class="brand-mark"></span>
      <span>Guidance Monitor</span>
    </a>
    <div class="nav-links">
      <a href="#system">设计系统</a>
      <a href="#insights">洞察</a>
      <a href="#method">方法论</a>
      <a href="#workbench">工作台</a>
    </div>
    <a class="nav-cta" href="${escapeHtml(productData.baseUrl)}" target="_blank" rel="noreferrer">Open Base</a>
  </nav>

  <header id="top" class="hero">
    <canvas class="signal-canvas" data-signal-canvas aria-hidden="true"></canvas>
    <div class="hero-inner section-shell">
      <section class="hero-copy reveal">
        <p class="eyebrow">Global Listed Guidance Intelligence</p>
        <h1>把上市公司披露转成可复核的供应链信号。</h1>
        <p class="lead">围绕 AI 基础设施、半导体、HBM、光通信、服务器和数据中心，追踪公开披露中的前瞻业绩线索。</p>
        <div class="hero-actions">
          <a class="button primary" href="#workbench">进入工作台</a>
          <a class="button ghost" href="${escapeHtml(productData.docUrl)}" target="_blank" rel="noreferrer">查看正式文档</a>
        </div>
      </section>
      <aside class="hero-console surface reveal" style="--delay:120ms">
        <div class="console-top">
          <span></span><span></span><span></span>
          <strong>${escapeHtml(productData.lastUpdated)}</strong>
        </div>
        <ul>${latestSignals}</ul>
      </aside>
    </div>
  </header>

  <main>
    <section class="metrics section-shell" aria-label="核心指标">${metricCards}</section>

    <section id="system" class="section-shell block system-grid">
      <div class="section-heading reveal">
        <p class="eyebrow">Design System</p>
        <h2>情报指挥台，而不是普通落地页。</h2>
        <p>视觉系统采用深色矿物底、金色证据链、青绿色状态提示和紧凑信息密度，服务于商业演示与研究复核。</p>
      </div>
      <div class="system-panel surface reveal">
        <div>
          <span>Palette</span>
          <strong>Lacquer / Gold / Patina</strong>
        </div>
        <div>
          <span>Typography</span>
          <strong>Editorial display + mono labels</strong>
        </div>
        <div>
          <span>Motion</span>
          <strong>Reveal / Signal mesh / Micro feedback</strong>
        </div>
      </div>
    </section>

    <section class="section-shell block coverage-grid">
      <article class="coverage-card surface reveal">
        <p class="eyebrow">Market Coverage</p>
        <h2>覆盖范围</h2>
        <p>当前已覆盖${countries}等市场。</p>
        <div class="exchange-cloud">${exchangeChips}</div>
      </article>
      <article class="quality-card surface reveal" style="--delay:90ms">
        <p class="eyebrow">Data Integrity</p>
        <h2>字段完整度</h2>
        <div class="quality-grid">${qualityTiles}</div>
      </article>
    </section>

    <section id="insights" class="section-shell block">
      <div class="section-heading reveal">
        <p class="eyebrow">Commercial Insights</p>
        <h2>把披露语言翻译成产业链判断。</h2>
      </div>
      <div class="insight-grid">${insightCards}</div>
    </section>

    <section id="method" class="section-shell block">
      <div class="section-heading reveal">
        <p class="eyebrow">Methodology</p>
        <h2>事实、摘录、解读分层。</h2>
        <p>每条事件都保留官方来源入口与 Base 记录，便于销售演示、研究复核和后续自动同步。</p>
      </div>
      <div class="method-grid">${methodCards}</div>
    </section>

    <section id="workbench" class="section-shell block workbench">
      <div class="workbench-head reveal">
        <div>
          <p class="eyebrow">Evidence Workbench</p>
          <h2>事件情报工作台</h2>
          <p>筛选、复核、导出完整事件库。每条记录都保留来源和 Base 复核入口。</p>
        </div>
        <strong data-result-count>0/0</strong>
      </div>

      <div class="workbench-shell surface reveal">
        <aside class="filter-rail">
          <label><span>地区</span><select data-filter="region">${makeFilterOptions('全部地区', allEvents.map(item => item.region))}</select></label>
          <label><span>板块</span><select data-filter="sector">${makeFilterOptions('全部板块', allEvents.map(item => item.sector))}</select></label>
          <label><span>信号</span><select data-filter="strength">${makeFilterOptions('全部信号', allEvents.map(item => item.strength))}</select></label>
          <label><span>方向</span><select data-filter="direction">${makeFilterOptions('全部方向', allEvents.map(item => item.direction))}</select></label>
          <label><span>搜索</span><input data-search type="search" placeholder="公司、代码、关键词" /></label>
        </aside>

        <section class="data-panel">
          <div class="data-toolbar">
            <p data-filter-summary></p>
            <div>
              <button type="button" data-view="table" aria-pressed="true">表格</button>
              <button type="button" data-view="card" aria-pressed="false">卡片</button>
              <button type="button" data-export>导出 CSV</button>
            </div>
          </div>
          <div class="table-shell" data-table-view>
            <table>
              <thead>
	                <tr>
	                  <th>公司</th>
	                  <th>市场/板块</th>
	                  <th>信号</th>
	                  <th>日期</th>
	                  <th>披露证据</th>
	                  <th>复核</th>
	                </tr>
              </thead>
              <tbody data-event-rows></tbody>
            </table>
          </div>
          <div class="event-grid" data-card-view hidden>
            <div data-card-rows></div>
          </div>
        </section>
      </div>
    </section>

    <section class="section-shell block boundary">
      <div class="surface">
        <p class="eyebrow">Commercial Boundary</p>
        <h2>商用展示边界</h2>
        <p>${escapeHtml(productData.commercialBoundary)}</p>
      </div>
    </section>
  </main>

  <footer class="footer section-shell">
    <p>© Guidance Monitor · 数据来源：正式文档、Feishu Base 与公司官方披露。</p>
  </footer>
`;

document.querySelectorAll('[data-filter]').forEach(control => {
  control.addEventListener('change', event => {
    state[event.target.dataset.filter] = event.target.value;
    renderWorkbench();
  });
});

document.querySelector('[data-search]').addEventListener('input', event => {
  state.query = event.target.value;
  renderWorkbench();
});

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', event => {
    state.view = event.currentTarget.dataset.view;
    renderWorkbench();
  });
});

document.querySelector('[data-export]').addEventListener('click', exportCsv);

const setupReveal = () => {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.04, rootMargin: '0px 0px -8% 0px' });
  items.forEach(item => observer.observe(item));
};

const setupSpotlight = () => {
  document.querySelectorAll('.surface').forEach(surface => {
    surface.addEventListener('pointermove', event => {
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      surface.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
};

const setupCounters = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-count]').forEach(counter => {
    const target = Number(counter.dataset.count);
    if (reduceMotion) {
      counter.textContent = String(target);
      return;
    }
    const duration = 900;
    const start = performance.now();
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
};

const setupSignalCanvas = () => {
  const canvas = document.querySelector('[data-signal-canvas]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animationFrame = null;
  const points = Array.from({ length: 34 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00045,
    vy: (Math.random() - 0.5) * 0.00045,
    r: 1.2 + (index % 5) * 0.35
  }));
  const resize = () => {
    canvas.width = Math.floor(canvas.clientWidth * devicePixelRatio);
    canvas.height = Math.floor(canvas.clientHeight * devicePixelRatio);
  };
  const draw = () => {
    if (document.hidden && !reduceMotion) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(216, 178, 91, 0.75)';
    ctx.strokeStyle = 'rgba(76, 211, 194, 0.18)';
    ctx.lineWidth = 1 * devicePixelRatio;

    points.forEach(point => {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0.06 || point.x > 0.94) point.vx *= -1;
      if (point.y < 0.08 || point.y > 0.92) point.vy *= -1;
    });

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = (a.x - b.x) * width;
        const dy = (a.y - b.y) * height;
        const distance = Math.hypot(dx, dy);
        if (distance < 190 * devicePixelRatio) {
          ctx.globalAlpha = 1 - distance / (190 * devicePixelRatio);
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, point.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!reduceMotion) animationFrame = requestAnimationFrame(draw);
  };
  resize();
  addEventListener('resize', () => {
    resize();
    if (reduceMotion) draw();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !reduceMotion) {
      animationFrame = requestAnimationFrame(draw);
    }
  });
  addEventListener('pagehide', () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
  draw();
};

renderWorkbench();
setupReveal();
setupSpotlight();
setupCounters();
setupSignalCanvas();
