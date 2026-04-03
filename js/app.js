/* ============================================================
   app.js — Tech Fluency for Ecommerce Leaders
   Depends on: lessons-data.js, modules-data.js
   ============================================================ */

/* ── Storage helpers ── */
var STORE_KEY = 'techfluency_v2';

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch(e) { return {}; }
}

function saveState(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  catch(e) { console.warn('localStorage unavailable'); }
}

function getCompleted()      { return loadState().completed || []; }
function getCompletedPS()    { return loadState().completedPS || []; }
function getResponses()      { return loadState().responses || {}; }
function getRubricScores()   { return loadState().rubricScores || {}; }

function markUnitComplete(dayRef) {
  var s = loadState();
  s.completed = s.completed || [];
  if (s.completed.indexOf(dayRef) === -1) s.completed.push(dayRef);
  saveState(s);
}

function markPSComplete(psId) {
  var s = loadState();
  s.completedPS = s.completedPS || [];
  if (s.completedPS.indexOf(psId) === -1) s.completedPS.push(psId);
  saveState(s);
}

function saveResponse(key, value) {
  var s = loadState();
  s.responses = s.responses || {};
  s.responses[key] = value;
  saveState(s);
}

function saveRubricScore(psId, idx, score) {
  var s = loadState();
  s.rubricScores = s.rubricScores || {};
  s.rubricScores[psId] = s.rubricScores[psId] || {};
  s.rubricScores[psId][idx] = score;
  saveState(s);
}

function getLastUnit() {
  var s = loadState();
  return s.lastUnit || null;
}

function setLastUnit(unit) {
  var s = loadState();
  s.lastUnit = unit;
  saveState(s);
}

/* ── App State ── */
var AppState = {
  view: 'dashboard',   // dashboard | module | unit | ps
  moduleId: null,
  unitId: null,
  psId: null
};

/* ── Routing / Navigation ── */
function navigate(view, opts) {
  opts = opts || {};
  AppState.view = view;
  AppState.moduleId = opts.moduleId || null;
  AppState.unitId   = opts.unitId   || null;
  AppState.psId     = opts.psId     || null;
  renderApp();
  window.scrollTo(0, 0);
}

/* ── Unit sequence helpers ── */
function flatUnits() {
  var list = [];
  modulesData.forEach(function(mod) {
    mod.units.forEach(function(u) { list.push({ mod: mod, unit: u }); });
    list.push({ mod: mod, ps: mod.problemSet });
  });
  return list;
}

function findUnitIdx(unitId) {
  var flat = flatUnits();
  for (var i = 0; i < flat.length; i++) {
    if ((flat[i].unit && flat[i].unit.id === unitId) ||
        (flat[i].ps   && flat[i].ps.id   === unitId)) return i;
  }
  return -1;
}

function prevNext(currentId) {
  var flat = flatUnits();
  var idx  = findUnitIdx(currentId);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null
  };
}

function isUnitUnlocked(unit, mod) {
  var completed = getCompleted();
  var completedPS = getCompletedPS();
  var modIdx = modulesData.indexOf(mod);
  if (modIdx === 0) return true;
  // Module N requires previous module's PS complete
  var prevMod = modulesData[modIdx - 1];
  if (completedPS.indexOf(prevMod.problemSet.id) === -1) return false;
  // Within a module, units unlock sequentially
  var unitIdx = mod.units.indexOf(unit);
  if (unitIdx === 0) return true;
  var prevUnit = mod.units[unitIdx - 1];
  return completed.indexOf(prevUnit.dayRef) !== -1;
}

function isPSUnlocked(mod) {
  var completed = getCompleted();
  return mod.units.every(function(u) {
    return completed.indexOf(u.dayRef) !== -1;
  });
}

function moduleProgress(mod) {
  var completed = getCompleted();
  var completedPS = getCompletedPS();
  var done = mod.units.filter(function(u) {
    return completed.indexOf(u.dayRef) !== -1;
  }).length;
  var psCount = completedPS.indexOf(mod.problemSet.id) !== -1 ? 1 : 0;
  var total = mod.units.length + 1;
  return { done: done + psCount, total: total };
}

function overallProgress() {
  var completed = getCompleted();
  var completedPS = getCompletedPS();
  var totalUnits = 0, doneUnits = 0;
  modulesData.forEach(function(mod) {
    totalUnits += mod.units.length + 1;
    mod.units.forEach(function(u) {
      if (completed.indexOf(u.dayRef) !== -1) doneUnits++;
    });
    if (completedPS.indexOf(mod.problemSet.id) !== -1) doneUnits++;
  });
  return { done: doneUnits, total: totalUnits };
}

/* ── Continue Where Left Off ── */
function continueLastUnit() {
  var last = getLastUnit();
  if (last) { openUnit(last); return; }
  // Find first incomplete unit
  var found = null;
  modulesData.some(function(mod) {
    return mod.units.some(function(u) {
      if (getCompleted().indexOf(u.dayRef) === -1 && isUnitUnlocked(u, mod)) {
        found = { unit: u, mod: mod };
        return true;
      }
    });
  });
  if (found) openUnit(found.unit.id);
}

/* ── Open helpers ── */
function openUnit(unitId) {
  var found = null;
  modulesData.some(function(mod) {
    mod.units.some(function(u) {
      if (u.id === unitId) { found = { unit: u, mod: mod }; return true; }
    });
  });
  if (!found || !isUnitUnlocked(found.unit, found.mod)) return;
  setLastUnit(unitId);
  navigate('unit', { moduleId: found.mod.id, unitId: unitId });
}

function openPS(psId) {
  var found = null;
  modulesData.some(function(mod) {
    if (mod.problemSet.id === psId) { found = mod; return true; }
  });
  if (!found || !isPSUnlocked(found)) return;
  setLastUnit(psId);
  navigate('ps', { moduleId: found.id, psId: psId });
}

function openModule(modId) {
  navigate('module', { moduleId: modId });
}

/* ── Keyboard navigation ── */
document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
  if (AppState.view === 'unit' || AppState.view === 'ps') {
    var currentId = AppState.view === 'unit' ? AppState.unitId : AppState.psId;
    var pn = prevNext(currentId);
    if (e.key === 'ArrowLeft'  && pn.prev) { e.preventDefault(); pn.prev.unit ? openUnit(pn.prev.unit.id) : openPS(pn.prev.ps.id); }
    if (e.key === 'ArrowRight' && pn.next) { e.preventDefault(); pn.next.unit ? openUnit(pn.next.unit.id) : openPS(pn.next.ps.id); }
    if (e.key === 'Escape') navigate('dashboard');
  }
});

/* ════════════════════════════════════════
   RENDER FUNCTIONS
════════════════════════════════════════ */

function renderApp() {
  var dash = document.getElementById('dashboard');
  var shell = document.getElementById('app-shell');

  if (AppState.view === 'dashboard' || AppState.view === 'module') {
    shell.classList.remove('active');
    dash.style.display = '';
    if (AppState.view === 'module') {
      var mod = modulesData.find(function(m) { return m.id === AppState.moduleId; });
      renderDashboard(mod);
    } else {
      renderDashboard(null);
    }
  } else {
    dash.style.display = 'none';
    shell.classList.add('active');
    renderSidebar();
    renderContent();
  }
}

/* ── Dashboard ── */
function renderDashboard(openMod) {
  var prog = overallProgress();
  var pct  = Math.round(prog.done / prog.total * 100);
  var completed = getCompleted();
  var lastUnitId = getLastUnit();

  // Update progress bar
  var fill = document.getElementById('overallFill');
  if (fill) { fill.style.width = pct + '%'; }
  var lbl = document.getElementById('progressLabel');
  if (lbl) lbl.textContent = prog.done + ' / ' + prog.total + ' complete';

  // Continue button
  var contBtn = document.getElementById('continueBtn');
  if (contBtn) {
    contBtn.style.display = lastUnitId ? 'inline-block' : 'none';
  }

  var container = document.getElementById('moduleGrid');
  if (!container) return;
  container.innerHTML = '';

  modulesData.forEach(function(mod) {
    var p = moduleProgress(mod);
    var locked = mod.id > 1 && !isPrevModComplete(mod);
    var pctMod = Math.round(p.done / p.total * 100);

    var card = document.createElement('div');
    card.className = 'module-card' + (locked ? ' locked' : '');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', locked ? '-1' : '0');
    card.setAttribute('aria-label', 'Module ' + mod.id + ': ' + mod.title);

    var circumference = 2 * Math.PI * 16;
    var offset = circumference - (pctMod / 100 * circumference);

    card.innerHTML =
      '<div class="module-card-header">' +
        '<div class="module-number">M' + mod.id + '</div>' +
        '<div>' +
          '<div class="module-card-title">' + escT(mod.title) + '</div>' +
          '<p class="module-card-desc">' + escT(mod.description) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="module-card-meta">' +
        '<span>' + mod.units.length + ' units · ' + escT(mod.estimatedTime) + (locked ? ' · 🔒 Complete previous module' : '') + '</span>' +
        '<div class="radial-progress" role="progressbar" aria-valuenow="' + pctMod + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + pctMod + '% complete">' +
          '<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">' +
            '<circle class="track" cx="22" cy="22" r="16"/>' +
            '<circle class="fill" cx="22" cy="22" r="16" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '"/>' +
          '</svg>' +
          '<div class="radial-pct">' + pctMod + '%</div>' +
        '</div>' +
      '</div>';

    if (!locked) {
      card.addEventListener('click', function() { openModule(mod.id); });
      card.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModule(mod.id); } });
    }

    // If module overview requested, show it inline
    if (openMod && openMod.id === mod.id) {
      container.appendChild(card);
      container.appendChild(renderModuleOverviewEl(mod));
      return;
    }
    container.appendChild(card);
  });
}

function isPrevModComplete(mod) {
  var idx = modulesData.indexOf(mod);
  if (idx === 0) return true;
  return getCompletedPS().indexOf(modulesData[idx - 1].problemSet.id) !== -1;
}

function renderModuleOverviewEl(mod) {
  var div = document.createElement('div');
  div.className = 'module-overview';
  div.setAttribute('role', 'region');
  div.setAttribute('aria-label', 'Module ' + mod.id + ' overview');

  var objHtml = mod.objectives.map(function(o) { return '<li>' + escT(o) + '</li>'; }).join('');
  var completed = getCompleted();
  var completedPS = getCompletedPS();

  var unitsHtml = mod.units.map(function(u) {
    var isComp = completed.indexOf(u.dayRef) !== -1;
    var isLocked = !isUnitUnlocked(u, mod);
    var cls = 'unit-row' + (isLocked ? ' locked' : '');
    var statusHtml = isComp ? '<span class="unit-status done" aria-label="Completed">✓ Done</span>' : (isLocked ? '<span class="unit-status" aria-label="Locked">🔒</span>' : '<span class="unit-status" aria-label="Not started">—</span>');
    return '<div class="' + cls + '" role="button" tabindex="' + (isLocked ? '-1' : '0') + '" data-unit="' + u.id + '" aria-label="' + escT(u.title) + (isLocked ? ', locked' : '') + '">' +
      '<span class="unit-number">Unit ' + u.id + '</span>' +
      '<div class="unit-info"><h4>' + escT(u.title) + '</h4><p>' + escT(u.readingTime) + '</p></div>' +
      statusHtml + '</div>';
  }).join('');

  var psComp = completedPS.indexOf(mod.problemSet.id) !== -1;
  var psLocked = !isPSUnlocked(mod);
  var psCls = 'unit-row ps-row' + (psLocked ? ' locked' : '');
  var psStatus = psComp ? '<span class="unit-status done">✓ Done</span>' : (psLocked ? '<span class="unit-status">🔒</span>' : '<span class="unit-status" style="color:var(--amber)">Ready</span>');
  var psHtml = '<div class="' + psCls + '" role="button" tabindex="' + (psLocked ? '-1' : '0') + '" data-ps="' + mod.problemSet.id + '" aria-label="Problem Set: ' + escT(mod.problemSet.title) + (psLocked ? ', locked' : '') + '">' +
    '<span class="unit-number" style="color:var(--amber)">Problem Set</span>' +
    '<div class="unit-info"><h4>' + escT(mod.problemSet.title) + '</h4></div>' +
    psStatus + '</div>';

  div.innerHTML =
    '<h1>' + escT(mod.title) + '</h1>' +
    '<p class="tagline">' + escT(mod.subtitle) + ' · ' + escT(mod.estimatedTime) + '</p>' +
    '<div class="objectives-box"><h3>Learning Objectives</h3><ul>' + objHtml + '</ul></div>' +
    '<div class="units-list">' + unitsHtml + psHtml + '</div>' +
    '<button class="nav-btn" style="margin-top:20px" id="backFromModule">← Back to all modules</button>';

  setTimeout(function() {
    div.querySelectorAll('.unit-row:not(.locked)').forEach(function(row) {
      var uid = row.dataset.unit;
      var pid = row.dataset.ps;
      function go() { if (uid) openUnit(uid); else if (pid) openPS(pid); }
      row.addEventListener('click', go);
      row.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    var backBtn = div.querySelector('#backFromModule');
    if (backBtn) backBtn.addEventListener('click', function() { navigate('dashboard'); });
  }, 0);
  return div;
}

/* ── Sidebar ── */
function renderSidebar() {
  var sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  var completed = getCompleted();
  var completedPS = getCompletedPS();
  var currentId = AppState.view === 'unit' ? AppState.unitId : AppState.psId;

  var html = '<div class="sidebar-header"><a href="#" id="sidebarHomeLink">← All Modules</a></div>';
  modulesData.forEach(function(mod) {
    html += '<div class="sidebar-module">';
    html += '<div class="sidebar-module-title" aria-expanded="true">M' + mod.id + ' ' + escT(mod.title) + '</div>';
    html += '<div class="sidebar-units">';
    mod.units.forEach(function(u) {
      var isComp = completed.indexOf(u.dayRef) !== -1;
      var isActive = u.id === currentId;
      var isLocked = !isUnitUnlocked(u, mod);
      var cls = 'sidebar-unit' + (isActive ? ' active' : '') + (isComp ? ' completed' : '') + (isLocked ? ' locked' : '');
      html += '<div class="' + cls + '" role="menuitem" tabindex="' + (isLocked ? '-1' : '0') + '" data-unit="' + u.id + '" aria-current="' + (isActive ? 'page' : 'false') + '" aria-label="' + escT(u.title) + (isLocked ? ', locked' : '') + '">' +
        escT(u.title) + '</div>';
    });
    var psComp = completedPS.indexOf(mod.problemSet.id) !== -1;
    var psActive = mod.problemSet.id === currentId;
    var psLocked = !isPSUnlocked(mod);
    var psCls = 'sidebar-unit problem-set' + (psActive ? ' active' : '') + (psComp ? ' completed' : '');
    html += '<div class="' + psCls + '" role="menuitem" tabindex="' + (psLocked ? '-1' : '0') + '" data-ps="' + mod.problemSet.id + '" aria-current="' + (psActive ? 'page' : 'false') + '" aria-label="Problem Set: ' + escT(mod.problemSet.title) + (psLocked ? ', locked' : '') + '">' +
      '<span class="sidebar-unit-dot" style="background:var(--amber)" aria-hidden="true"></span>Problem Set</div>';
    html += '</div></div>';
  });
  sidebar.innerHTML = html;

  sidebar.querySelector('#sidebarHomeLink').addEventListener('click', function(e) { e.preventDefault(); navigate('dashboard'); });
  sidebar.querySelectorAll('[data-unit]').forEach(function(el) {
    el.addEventListener('click', function() { openUnit(el.dataset.unit); });
    el.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openUnit(el.dataset.unit); } });
  });
  sidebar.querySelectorAll('[data-ps]').forEach(function(el) {
    el.addEventListener('click', function() { openPS(el.dataset.ps); });
    el.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPS(el.dataset.ps); } });
  });
}

/* ── Content area ── */
function renderContent() {
  var area = document.getElementById('contentArea');
  if (!area) return;
  if (AppState.view === 'unit')  { area.innerHTML = buildUnitPage(); bindUnitEvents(); initMermaid(); }
  if (AppState.view === 'ps')    { area.innerHTML = buildPSPage();   bindPSEvents(); }
}

/* ── Topbar (breadcrumb + nav) ── */
function buildTopbar(breadcrumbs, currentId) {
  var pn = prevNext(currentId);
  var crumbHtml = breadcrumbs.map(function(c, i) {
    return i < breadcrumbs.length - 1
      ? '<a href="#" data-nav="' + c.nav + '">' + escT(c.label) + '</a><span aria-hidden="true"> › </span>'
      : '<span aria-current="page" class="current">' + escT(c.label) + '</span>';
  }).join('');

  var prevId = pn.prev ? (pn.prev.unit ? pn.prev.unit.id : pn.prev.ps.id) : null;
  var nextId = pn.next ? (pn.next.unit ? pn.next.unit.id : pn.next.ps.id) : null;

  return '<div class="unit-header" aria-label="Page navigation">' +
    '<div class="breadcrumb" aria-label="Breadcrumb">' + crumbHtml + '</div>' +
    '<div class="nav-arrows" role="group" aria-label="Unit navigation">' +
      '<button class="nav-arrow" id="navPrev" ' + (prevId ? 'data-nav-id="' + prevId + '"' : 'disabled') + ' aria-label="Previous unit"' + (!prevId ? ' aria-disabled="true"' : '') + '>← Prev</button>' +
      '<button class="nav-arrow" id="navNext" ' + (nextId ? 'data-nav-id="' + nextId + '"' : 'disabled') + ' aria-label="Next unit"' + (!nextId ? ' aria-disabled="true"' : '') + '>Next →</button>' +
    '</div>' +
  '</div>';
}

/* ── Unit page ── */
function buildUnitPage() {
  var mod  = modulesData.find(function(m) { return m.id === AppState.moduleId; });
  var unit = mod ? mod.units.find(function(u) { return u.id === AppState.unitId; }) : null;
  if (!mod || !unit) return '<p>Unit not found</p>';

  var lesson = (typeof lessonsData !== 'undefined')
    ? lessonsData.find(function(l) { return l.day === unit.dayRef; })
    : null;

  var isComplete = getCompleted().indexOf(unit.dayRef) !== -1;

  var topbar = buildTopbar([
    { label: 'Modules', nav: 'home' },
    { label: 'M' + mod.id + ': ' + mod.title, nav: 'mod:' + mod.id },
    { label: unit.title }
  ], unit.id);

  var coldOpen = '';
  if (lesson && lesson.coldOpen) {
    var savedCO = getResponses()['cold_' + unit.dayRef] || '';
    coldOpen = '<div class="cold-open" role="complementary" aria-label="Before you start">' +
      '<h3>Before You Start</h3>' +
      '<p>' + escT(lesson.coldOpen) + '</p>' +
      '<textarea aria-label="Your initial thoughts" placeholder="What is your initial thinking?" data-save-key="cold_' + unit.dayRef + '">' + escT(savedCO) + '</textarea>' +
    '</div>';
  }

  var mainContent = lesson ? lesson.content : '<p>Content not available.</p>';

  var coldRevisit = '';
  if (lesson && lesson.coldRevisit) {
    coldRevisit = '<div class="info-box" style="margin-top:2rem">' +
      '<div class="info-title">Revisit Your Initial Thinking</div>' +
      '<p>' + escT(lesson.coldRevisit) + '</p>' +
    '</div>';
  }

  var diagramHtml = buildDiagram(unit);

  var conceptCheck = buildConceptCheck(unit, lesson);

  var thinkLeader = buildThinkLeader(unit);

  var completeBtnHtml = '<button class="complete-btn' + (isComplete ? ' done' : '') + '" id="completeBtn" aria-label="' + (isComplete ? 'Already completed' : 'Mark unit as complete') + '">' +
    (isComplete ? '✓ Completed' : 'Mark Complete') + '</button>';

  var printBtn = '<button class="nav-btn" id="printBtn" aria-label="Print or export this unit" style="display:block;margin:10px auto">Print / Export</button>';

  return '<div role="main">' +
    topbar +
    '<article class="unit-article" aria-label="' + escT(unit.title) + '">' +
      '<p class="unit-eyebrow" aria-label="Module ' + mod.id + '">Module ' + mod.id + ' · Unit ' + unit.id + '</p>' +
      '<h1 class="unit-title">' + escT(unit.title) + '</h1>' +
      '<div class="unit-meta">' +
        '<span>⏱ ' + escT(unit.readingTime) + '</span>' +
        (lesson ? '<span>📖 Day ' + lesson.day + ' content</span>' : '') +
        (isComplete ? '<span style="color:var(--success)">✓ Complete</span>' : '') +
      '</div>' +
      coldOpen +
      '<div class="lesson-body">' + mainContent + '</div>' +
      coldRevisit +
      diagramHtml +
      conceptCheck +
      thinkLeader +
      completeBtnHtml +
      printBtn +
    '</article>' +
  '</div>';
}

function buildDiagram(unit) {
  if (!unit.diagram) return '';
  return '<div class="diagram-wrap" role="figure" aria-label="' + escT(unit.diagram.title) + '">' +
    '<p>' + escT(unit.diagram.title) + '</p>' +
    '<div class="mermaid" aria-label="Architecture diagram: ' + escT(unit.diagram.title) + '">' + unit.diagram.definition + '</div>' +
  '</div>';
}

function buildConceptCheck(unit, lesson) {
  if (!lesson || !lesson.questions || !lesson.questions.length) return '';
  var qs = lesson.questions.slice(0, 4);
  var html = '<section class="concept-check" aria-label="Concept Check">' +
    '<div class="concept-check-header" id="cc-heading-' + unit.id + '">Concept Check</div>';
  qs.forEach(function(q, qi) {
    html += '<div class="quiz-q" role="group" aria-labelledby="qq-' + unit.id + '-' + qi + '">' +
      '<div class="quiz-q-num" id="qq-' + unit.id + '-' + qi + '">Question ' + (qi + 1) + '</div>' +
      '<div class="quiz-q-text">' + escT(q.q) + '</div>';
    q.opts.forEach(function(opt, oi) {
      html += '<div class="quiz-opt" role="button" tabindex="0" ' +
        'data-idx="' + oi + '" data-correct="' + q.correct + '" ' +
        'data-explain="' + escAttr(q.explain) + '" ' +
        'aria-label="Option ' + (oi + 1) + ': ' + escAttr(opt) + '">' + escT(opt) + '</div>';
    });
    html += '<div class="quiz-feedback" role="alert" aria-live="polite"></div></div>';
  });
  html += '</section>';
  return html;
}

function buildThinkLeader(unit) {
  if (!unit.thinkLeader) return '';
  var saved = getResponses()['tl_' + unit.id] || '';
  return '<section class="think-leader" aria-label="Think Like a Leader">' +
    '<div class="think-leader-header">Think Like a Leader</div>' +
    '<p>' + escT(unit.thinkLeader.prompt) + '</p>' +
    '<textarea aria-label="Your response to the leadership prompt" placeholder="Write your answer here before revealing the model answer..." data-save-key="tl_' + unit.id + '">' + escT(saved) + '</textarea>' +
    '<button class="reveal-btn" id="revealBtn-' + unit.id + '" aria-expanded="false" aria-controls="modelAnswer-' + unit.id + '">Reveal Model Answer</button>' +
    '<div class="model-answer" id="modelAnswer-' + unit.id + '" role="region" aria-label="Model answer">' +
      '<div class="model-answer-label">Model Answer</div>' +
      '<p>' + escT(unit.thinkLeader.modelAnswer) + '</p>' +
    '</div>' +
  '</section>';
}

function buildDecisionTree(dt) {
  if (!dt) return '';
  var node = dt.nodes[dt.start];
  return '<div class="decision-tree" data-dt-id="' + dt.id + '" role="region" aria-label="Interactive Decision Tree">' +
    '<div class="dt-header">Interactive Decision Tree</div>' +
    renderDTNode(dt, dt.start) +
  '</div>';
}

function renderDTNode(dt, nodeId) {
  var node = dt.nodes[nodeId];
  if (!node) return '';
  if (node.type === 'question') {
    var opts = node.options.map(function(o) {
      return '<button class="dt-option" data-dt="' + dt.id + '" data-next="' + o.next + '">' + escT(o.text) + '</button>';
    }).join('');
    return '<div class="dt-question">' + escT(node.text) + '</div><div class="dt-options">' + opts + '</div>';
  }
  if (node.type === 'result') {
    return '<div class="dt-result"><h3>' + escT(node.title) + '</h3><p>' + escT(node.body) + '</p>' +
      '<button class="dt-restart" data-dt="' + dt.id + '">Start over</button></div>';
  }
  return '';
}

/* ── Problem Set page ── */
function buildPSPage() {
  var mod = modulesData.find(function(m) { return m.id === AppState.moduleId; });
  if (!mod) return '<p>Not found</p>';
  var ps = mod.problemSet;
  var isComplete = getCompletedPS().indexOf(ps.id) !== -1;
  var responses = getResponses();
  var rubricScores = getRubricScores()[ps.id] || {};

  var topbar = buildTopbar([
    { label: 'Modules', nav: 'home' },
    { label: 'M' + mod.id + ': ' + mod.title, nav: 'mod:' + mod.id },
    { label: 'Problem Set' }
  ], ps.id);

  var partsHtml = ps.parts.map(function(part, pi) {
    var savedVal = responses['ps_' + ps.id + '_' + pi] || '';
    return '<div class="ps-question">' +
      '<div class="ps-question-label">' + escT(part.label) + '</div>' +
      '<h3>' + escT(part.question) + '</h3>' +
      '<textarea aria-label="' + escT(part.label) + '" placeholder="' + escAttr(part.placeholder) + '" data-save-key="ps_' + ps.id + '_' + pi + '">' + escT(savedVal) + '</textarea>' +
    '</div>';
  }).join('');

  var rubricHtml = '';
  if (ps.rubric) {
    rubricHtml = '<div class="rubric" role="group" aria-label="Self-assessment rubric"><h4>Self-Assessment Rubric</h4>';
    ps.rubric.forEach(function(r, ri) {
      rubricHtml += '<div class="rubric-item"><label>' + escT(r.criterion) + '</label><div class="rubric-score" role="radiogroup" aria-label="Score for ' + escAttr(r.criterion) + '">';
      r.levels.forEach(function(lvl, si) {
        var selected = rubricScores[ri] === si ? ' selected' : '';
        rubricHtml += '<button class="' + selected + '" role="radio" aria-checked="' + (rubricScores[ri] === si ? 'true' : 'false') + '" data-rubric-ps="' + ps.id + '" data-rubric-item="' + ri + '" data-rubric-score="' + si + '" aria-label="Level ' + (si + 1) + ': ' + escAttr(lvl) + '">' + (si + 1) + ' — ' + escT(lvl) + '</button>';
      });
      rubricHtml += '</div></div>';
    });
    rubricHtml += '</div>';
  }

  var interactiveHtml = '';
  if (ps.interactive === 'trace-request') interactiveHtml = buildTraceRequest();

  return '<div role="main">' +
    topbar +
    '<div class="problem-set" aria-label="Problem Set: ' + escT(ps.title) + '">' +
      '<div class="problem-set-header">' +
        '<div class="problem-set-badge">Problem Set · Module ' + mod.id + '</div>' +
        '<h2>' + escT(ps.title) + '</h2>' +
        '<p>' + escT(ps.scenario) + '</p>' +
      '</div>' +
      interactiveHtml +
      partsHtml +
      rubricHtml +
      '<button class="complete-btn" style="background:var(--amber);margin-top:1.5rem" id="submitPS" aria-label="Submit problem set and mark complete">' + (isComplete ? '✓ Submitted' : 'Submit & Mark Complete') + '</button>' +
    '</div>' +
  '</div>';
}

/* ── Trace The Request ── */
var traceSteps = [
  { label: 'DNS',    title: 'DNS Lookup', body: 'Your browser needs to find the IP address for shop.example.com. It checks its own cache first, then your OS cache, then asks a DNS resolver.', risk: 'Slow or misconfigured DNS can add 100–500ms before any content loads. Cache poisoning can redirect users to malicious servers.' },
  { label: 'TCP',    title: 'TCP Connection', body: 'Your browser opens a TCP connection to the server IP (3-way handshake: SYN → SYN-ACK → ACK). This takes one round-trip.', risk: 'Each round-trip adds latency proportional to distance. London → Tokyo = 200ms round-trip, before data even starts flowing.' },
  { label: 'TLS',    title: 'TLS Handshake', body: 'For HTTPS, browser and server negotiate encryption keys (1-2 more round-trips in TLS 1.2; TLS 1.3 reduces this to 1 round-trip).', risk: 'Expired or invalid SSL certificates cause browser warnings and hard failures. Weak cipher suites create security vulnerabilities.' },
  { label: 'HTTP',   title: 'HTTP Request', body: 'Browser sends: GET /product/123 HTTP/1.1 with headers including Cookie, Accept, User-Agent. The request payload is small.', risk: 'Large cookies or request headers slow the initial request. Cache-Control headers determine whether the browser even makes this request.' },
  { label: 'Server', title: 'Server Processing', body: 'Server receives request, runs application code: authenticate user, query database for product, check inventory, render HTML or return JSON.', risk: 'Slow database queries, missing indexes, and N+1 query problems cause most server slowness. Each uncached DB query adds 50–200ms.' },
  { label: 'CDN',    title: 'Response & CDN Cache', body: 'Server sends HTML response. If CDN is between user and origin, static assets (images, CSS, JS) are served from the nearest edge server.', risk: 'Without a CDN, every asset request hits your origin. 50 resources × 200ms = 10s for a Tokyo user hitting a London server.' },
  { label: 'Render', title: 'Browser Rendering', body: 'Browser parses HTML, builds DOM, fetches CSS/JS, executes JavaScript, calculates layout, and paints pixels. Each blocking script pauses rendering.', risk: 'Render-blocking JS in <head> pauses all rendering. Large images without dimensions cause layout shifts. Unoptimised JS bundles delay interactivity.' }
];

var traceState = { step: 0 };

function buildTraceRequest() {
  var dotsHtml = traceSteps.map(function(s, i) {
    var cls = i === 0 ? 'trace-step-dot active' : 'trace-step-dot';
    var lineHtml = i < traceSteps.length - 1 ? '<div style="flex:1;height:2px;background:var(--border);margin-top:11px"></div>' : '';
    return '<div style="display:flex;align-items:flex-start;flex:1">' +
      '<div class="' + cls + '" data-trace-step="' + i + '">' +
        '<div class="dot" aria-label="Step ' + (i+1) + ': ' + escAttr(s.label) + '">' + (i+1) + '</div>' +
        '<div class="trace-step-label">' + escT(s.label) + '</div>' +
      '</div>' + lineHtml + '</div>';
  }).join('');
  var step = traceSteps[0];
  return '<div class="trace-request" role="region" aria-label="Trace the Request interactive">' +
    '<div class="trace-header">Interactive: Trace the Request — click each step to explore what happens</div>' +
    '<div class="trace-steps" role="list" aria-label="Request steps">' + dotsHtml + '</div>' +
    '<div class="trace-content" id="traceContent">' + renderTraceStep(0) + '</div>' +
    '<div class="trace-nav">' +
      '<button id="tracePrev" disabled aria-label="Previous step">← Back</button>' +
      '<span style="font-family:monospace;font-size:.8rem;color:var(--text-dim)" aria-live="polite" aria-atomic="true" id="traceCount">Step 1 of ' + traceSteps.length + '</span>' +
      '<button id="traceNext" aria-label="Next step">Next →</button>' +
    '</div>' +
  '</div>';
}

function renderTraceStep(idx) {
  var s = traceSteps[idx];
  return '<div class="trace-step-detail">' +
    '<h3>' + (idx+1) + '. ' + escT(s.title) + '</h3>' +
    '<p>' + escT(s.body) + '</p>' +
    '<div class="what-can-go-wrong"><strong>What can go wrong:</strong> ' + escT(s.risk) + '</div>' +
  '</div>';
}

/* ── Event binding ── */
function bindUnitEvents() {
  var area = document.getElementById('contentArea');
  if (!area) return;

  // Topbar nav
  area.querySelectorAll('[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      var nav = el.dataset.nav;
      if (nav === 'home') navigate('dashboard');
      else if (nav && nav.startsWith('mod:')) openModule(parseInt(nav.split(':')[1]));
    });
  });
  var navPrev = area.querySelector('#navPrev');
  var navNext = area.querySelector('#navNext');
  if (navPrev && !navPrev.disabled) {
    navPrev.addEventListener('click', function() {
      var id = navPrev.dataset.navId;
      var flat = flatUnits();
      var entry = flat.find(function(f) { return (f.unit && f.unit.id === id) || (f.ps && f.ps.id === id); });
      if (entry && entry.unit) openUnit(id); else if (entry && entry.ps) openPS(id);
    });
  }
  if (navNext && !navNext.disabled) {
    navNext.addEventListener('click', function() {
      var id = navNext.dataset.navId;
      var flat = flatUnits();
      var entry = flat.find(function(f) { return (f.unit && f.unit.id === id) || (f.ps && f.ps.id === id); });
      if (entry && entry.unit) openUnit(id); else if (entry && entry.ps) openPS(id);
    });
  }

  // Auto-save textareas
  area.querySelectorAll('textarea[data-save-key]').forEach(function(ta) {
    ta.addEventListener('input', function() { saveResponse(ta.dataset.saveKey, ta.value); });
  });

  // Concept check
  area.querySelectorAll('.quiz-opt').forEach(function(opt) {
    opt.addEventListener('click', function() { handleQuizAnswer(opt); });
    opt.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleQuizAnswer(opt); }
    });
  });

  // Think Like a Leader reveal
  area.querySelectorAll('[id^="revealBtn-"]').forEach(function(btn) {
    var unitId = btn.id.replace('revealBtn-', '');
    var target = area.querySelector('#modelAnswer-' + unitId);
    btn.addEventListener('click', function() {
      if (target) {
        var showing = target.classList.toggle('show');
        btn.setAttribute('aria-expanded', showing ? 'true' : 'false');
        btn.textContent = showing ? 'Hide Model Answer' : 'Reveal Model Answer';
      }
    });
  });

  // Complete button
  var completeBtn = area.querySelector('#completeBtn');
  if (completeBtn && !completeBtn.classList.contains('done')) {
    completeBtn.addEventListener('click', function() {
      var mod = modulesData.find(function(m) { return m.id === AppState.moduleId; });
      var unit = mod && mod.units.find(function(u) { return u.id === AppState.unitId; });
      if (unit) {
        markUnitComplete(unit.dayRef);
        completeBtn.classList.add('done');
        completeBtn.textContent = '✓ Completed';
        completeBtn.setAttribute('aria-label', 'Already completed');
        renderSidebar();
      }
    });
  }

  // Print
  var printBtn = area.querySelector('#printBtn');
  if (printBtn) printBtn.addEventListener('click', function() { window.print(); });

  // Decision trees
  area.querySelectorAll('.decision-tree').forEach(function(dtEl) {
    bindDecisionTree(dtEl);
  });

  // Trace request
  bindTraceRequest(area);
}

function handleQuizAnswer(opt) {
  var parent = opt.closest('.quiz-q');
  if (!parent) return;
  var opts = parent.querySelectorAll('.quiz-opt');
  var feedback = parent.querySelector('.quiz-feedback');
  var idx = parseInt(opt.dataset.idx);
  var correct = parseInt(opt.dataset.correct);
  var explain = opt.dataset.explain;
  opts.forEach(function(o) { o.classList.remove('correct', 'wrong'); o.setAttribute('aria-pressed', 'false'); });
  if (idx === correct) {
    opt.classList.add('correct');
    feedback.className = 'quiz-feedback show correct-fb';
    feedback.innerHTML = '<strong>Correct!</strong> ' + escT(explain);
  } else {
    opt.classList.add('wrong');
    opts[correct].classList.add('correct');
    feedback.className = 'quiz-feedback show wrong-fb';
    feedback.innerHTML = '<strong>Not quite.</strong> ' + escT(explain);
  }
  opt.setAttribute('aria-pressed', 'true');
}

function bindPSEvents() {
  var area = document.getElementById('contentArea');
  if (!area) return;

  // Topbar nav
  area.querySelectorAll('[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      var nav = el.dataset.nav;
      if (nav === 'home') navigate('dashboard');
      else if (nav && nav.startsWith('mod:')) openModule(parseInt(nav.split(':')[1]));
    });
  });

  var navPrev = area.querySelector('#navPrev');
  var navNext = area.querySelector('#navNext');
  if (navPrev && !navPrev.disabled) {
    navPrev.addEventListener('click', function() {
      var id = navPrev.dataset.navId;
      var flat = flatUnits();
      var entry = flat.find(function(f) { return (f.unit && f.unit.id === id) || (f.ps && f.ps.id === id); });
      if (entry && entry.unit) openUnit(id); else if (entry) openPS(id);
    });
  }
  if (navNext && !navNext.disabled) {
    navNext.addEventListener('click', function() {
      var id = navNext.dataset.navId;
      var flat = flatUnits();
      var entry = flat.find(function(f) { return (f.unit && f.unit.id === id) || (f.ps && f.ps.id === id); });
      if (entry && entry.unit) openUnit(id); else if (entry) openPS(id);
    });
  }

  // Auto-save
  area.querySelectorAll('textarea[data-save-key]').forEach(function(ta) {
    ta.addEventListener('input', function() { saveResponse(ta.dataset.saveKey, ta.value); });
  });

  // Rubric
  area.querySelectorAll('[data-rubric-ps]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var psId = btn.dataset.rubricPs;
      var item = parseInt(btn.dataset.rubricItem);
      var score = parseInt(btn.dataset.rubricScore);
      saveRubricScore(psId, item, score);
      var group = btn.closest('.rubric-score');
      group.querySelectorAll('button').forEach(function(b) {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
    });
  });

  // Submit
  var submitBtn = area.querySelector('#submitPS');
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      var mod = modulesData.find(function(m) { return m.id === AppState.moduleId; });
      if (mod) {
        markPSComplete(mod.problemSet.id);
        submitBtn.textContent = '✓ Submitted';
        submitBtn.disabled = true;
        renderSidebar();
      }
    });
  }

  // Trace request
  bindTraceRequest(area);
}

function bindTraceRequest(area) {
  if (!area) return;
  var prev = area.querySelector('#tracePrev');
  var next = area.querySelector('#traceNext');
  var content = area.querySelector('#traceContent');
  var count = area.querySelector('#traceCount');
  if (!prev || !next || !content) return;

  function updateTrace(idx) {
    traceState.step = idx;
    content.innerHTML = renderTraceStep(idx);
    if (count) count.textContent = 'Step ' + (idx + 1) + ' of ' + traceSteps.length;
    prev.disabled = idx === 0;
    next.disabled = idx === traceSteps.length - 1;
    area.querySelectorAll('.trace-step-dot').forEach(function(d, i) {
      d.classList.remove('active', 'done');
      if (i < idx) d.classList.add('done');
      if (i === idx) d.classList.add('active');
    });
  }

  prev.addEventListener('click', function() { if (traceState.step > 0) updateTrace(traceState.step - 1); });
  next.addEventListener('click', function() { if (traceState.step < traceSteps.length - 1) updateTrace(traceState.step + 1); });
  area.querySelectorAll('[data-trace-step]').forEach(function(dot) {
    dot.addEventListener('click', function() { updateTrace(parseInt(dot.dataset.traceStep)); });
  });
}

function bindDecisionTree(dtEl) {
  var dtId = dtEl.dataset.dtId;
  var mod = null;
  var dt = null;
  modulesData.forEach(function(m) {
    m.units.forEach(function(u) {
      if (u.decisionTree && u.decisionTree.id === dtId) { mod = m; dt = u.decisionTree; }
    });
  });
  if (!dt) return;

  function render(nodeId) {
    var inner = dtEl.querySelector('.dt-question, .dt-options, .dt-result');
    var existing = dtEl.querySelectorAll('.dt-question, .dt-options, .dt-result');
    existing.forEach(function(e) { e.remove(); });
    var html = renderDTNode(dt, nodeId);
    var temp = document.createElement('div');
    temp.innerHTML = html;
    while (temp.firstChild) dtEl.appendChild(temp.firstChild);
    bindDTButtons(dtEl, render);
  }
  bindDTButtons(dtEl, render);
}

function bindDTButtons(dtEl, renderFn) {
  dtEl.querySelectorAll('.dt-option').forEach(function(btn) {
    btn.addEventListener('click', function() { renderFn(btn.dataset.next); });
  });
  dtEl.querySelectorAll('.dt-restart').forEach(function(btn) {
    var dtId = btn.dataset.dt;
    btn.addEventListener('click', function() {
      var dt = null;
      modulesData.forEach(function(m) { m.units.forEach(function(u) { if (u.decisionTree && u.decisionTree.id === dtId) dt = u.decisionTree; }); });
      if (dt) renderFn(dt.start);
    });
  });
}

function initMermaid() {
  if (typeof mermaid !== 'undefined') {
    try { mermaid.init(undefined, document.querySelectorAll('.mermaid')); } catch(e) {}
  }
}

/* ── Utility ── */
function escT(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function escAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

/* ── Copy buttons for pre elements ── */
function addCopyButtons() {
  document.querySelectorAll('.lesson-body pre').forEach(function(pre) {
    if (pre.querySelector('.copy-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.addEventListener('click', function() {
      var text = pre.textContent.replace('Copy', '').trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          btn.textContent = 'Copied!';
          setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
        });
      }
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

/* ── Init ── */
function init() {
  // Mermaid config (no unsafe-inline — using external file is OK per CSP)
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: { primaryColor: '#00d4aa', primaryTextColor: '#f0f0f0', background: '#0a0a0a', lineColor: '#888' },
      securityLevel: 'strict'
    });
  }

  // Wire up static buttons
  var contBtn = document.getElementById('continueBtn');
  if (contBtn) contBtn.addEventListener('click', continueLastUnit);

  var resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm('Reset all progress? This cannot be undone.')) {
        localStorage.removeItem(STORE_KEY);
        navigate('dashboard');
      }
    });
  }

  // Initial render
  renderDashboard(null);
}

document.addEventListener('DOMContentLoaded', init);
