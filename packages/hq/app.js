/* ============================================
   Mission Control — Sprint Blocks + Dashboard
   Pure vanilla JS — no dependencies
   state.json = structure, localStorage = task checkbox state
   ============================================ */

(function () {
  'use strict';

  var HASH = '526f5f655785ee7230d6679e465f1b046e223e5502a646db9fc7d851bd224b45';
  var AUTH_KEY = 'hq_auth';
  var TASKS_KEY = 'mc_tasks'; // localStorage: { taskId: true/false }

  function _ls() { try { return window.localStorage; } catch(e) { return null; } }
  function _ss() { try { return window.sessionStorage; } catch(e) { return null; } }

  var _memAuth = false;
  function getAuth() { try { var s = _ss(); return s && s.getItem(AUTH_KEY) === 'true'; } catch(e) { return _memAuth; } }
  function setAuth() { _memAuth = true; try { var s = _ss(); if(s) s.setItem(AUTH_KEY, 'true'); } catch(e) {} }

  // ── Task State (localStorage) ─────────────

  var taskState = {};

  function loadTaskState() {
    var ls = _ls(); if (!ls) return;
    try { var raw = ls.getItem(TASKS_KEY); if (raw) taskState = JSON.parse(raw); } catch(e) {}
  }

  function saveTaskState() {
    var ls = _ls(); if (!ls) return;
    try { ls.setItem(TASKS_KEY, JSON.stringify(taskState)); } catch(e) {}
  }

  function isTaskDone(id) { return taskState[id] === true; }

  function toggleTask(id) {
    taskState[id] = !isTaskDone(id);
    saveTaskState();
  }

  // ── Password Gate ──────────────────────────

  async function sha256(msg) {
    var buf = new TextEncoder().encode(msg);
    var hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  function showApp() {
    document.getElementById('gate').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initApp();
  }

  function initGate() {
    if (getAuth()) { showApp(); return; }
    var form = document.getElementById('gate-form');
    var input = document.getElementById('gate-input');
    var error = document.getElementById('gate-error');
    input.focus();

    async function tryLogin() {
      var v = input.value; if (!v) return;
      var match = false;
      try { match = (await sha256(v)) === HASH; } catch(e) { match = (v === 'even2026'); }
      if (match) { setAuth(); showApp(); }
      else { error.textContent = 'Invalid password'; input.value = ''; input.focus(); setTimeout(function() { error.textContent = ''; }, 2000); }
    }

    form.addEventListener('submit', function(e) { e.preventDefault(); tryLogin(); });
  }

  // ── App State ─────────────────────────────

  var data = null;
  var focusProjectId = null;

  // ── Init ──────────────────────────────────

  function initApp() {
    loadTaskState();
    initTheme();
    initTabs();
    initBackBtn();
    loadData();
  }

  async function loadData() {
    try {
      var res = await fetch('data/state.json');
      if (!res.ok) throw new Error('Failed');
      data = await res.json();
      renderAll();
    } catch(e) {
      console.error('Error loading state.json:', e);
    }
  }

  function renderAll() {
    renderMissionHero();
    renderProjectList();
    renderNumbers();
    renderDashboard();
  }

  // ── Theme ─────────────────────────────────

  function initTheme() {
    var ls = _ls();
    var saved = ls ? ls.getItem('hq_theme') : null;
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    document.getElementById('theme-toggle').addEventListener('click', function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) { document.documentElement.removeAttribute('data-theme'); try { _ls().setItem('hq_theme', 'light'); } catch(e) {} }
      else { document.documentElement.setAttribute('data-theme', 'dark'); try { _ls().setItem('hq_theme', 'dark'); } catch(e) {} }
    });
  }

  // ── Tabs ──────────────────────────────────

  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { switchTab(btn.getAttribute('data-tab')); });
    });
  }

  function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('[data-tab="' + tab + '"]').classList.add('active');
    document.getElementById('view-blocks').classList.toggle('hidden', tab !== 'blocks');
    document.getElementById('view-dashboard').classList.toggle('hidden', tab !== 'dashboard');
    if (tab !== 'blocks') exitFocus();
  }

  // ── Back Button ───────────────────────────

  function initBackBtn() {
    document.getElementById('back-btn').addEventListener('click', exitFocus);
  }

  // ── Mission Hero ──────────────────────────

  function renderMissionHero() {
    var el = document.getElementById('mission-hero');
    if (!data || !data.mission) { el.innerHTML = ''; return; }
    var m = data.mission;
    var deadline = new Date(m.deadline + 'T23:59:59');
    var now = new Date();
    var daysLeft = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));

    // Determine current week
    var todayStr = formatISO(now);
    var weeks = m.weeks || [];

    var weekSegments = weeks.map(function(w) {
      if (todayStr > w.end) return 'is-done';
      if (todayStr >= w.start && todayStr <= w.end) return 'is-current';
      return '';
    }).map(function(cls) {
      return '<div class="week-segment ' + cls + '"></div>';
    }).join('');

    var weekLabels = weeks.map(function(w) {
      var cls = '';
      if (todayStr > w.end) cls = 'is-done';
      else if (todayStr >= w.start && todayStr <= w.end) cls = 'is-current';
      return '<div class="week-label ' + cls + '">W' + w.num + ' ' + w.name + '</div>';
    }).join('');

    el.innerHTML =
      '<div class="mission-hero-card">' +
        '<div class="mission-target">' + esc(m.target) + '</div>' +
        '<div class="mission-deadline">Deadline: ' + formatDate(deadline) + '</div>' +
        '<div class="mission-countdown">' + daysLeft + '<span>days left</span></div>' +
        '<div class="week-track">' + weekSegments + '</div>' +
        '<div class="week-labels">' + weekLabels + '</div>' +
      '</div>';
  }

  // ── Project List ──────────────────────────

  function getActiveBlockIndex(project) {
    for (var i = 0; i < project.blocks.length; i++) {
      var block = project.blocks[i];
      var allDone = block.tasks.every(function(t) { return isTaskDone(t.id); });
      if (!allDone) return i;
    }
    return project.blocks.length; // all complete
  }

  function renderProjectList() {
    var el = document.getElementById('project-list');
    if (!data || !data.projects) { el.innerHTML = ''; return; }

    if (focusProjectId) {
      el.classList.add('hidden');
      document.getElementById('mission-hero').classList.add('hidden');
      return;
    }

    el.classList.remove('hidden');
    document.getElementById('mission-hero').classList.remove('hidden');

    el.innerHTML = data.projects.map(function(project) {
      var totalBlocks = project.blocks.length;
      var activeIdx = getActiveBlockIndex(project);
      var doneBlocks = activeIdx;
      var isAllDone = activeIdx >= totalBlocks;

      // Block progress segments
      var segments = project.blocks.map(function(b, i) {
        if (i < activeIdx) return '<div class="block-segment is-done"></div>';
        if (i === activeIdx) return '<div class="block-segment is-active"></div>';
        return '<div class="block-segment"></div>';
      }).join('');

      var currentBlock = isAllDone ? null : project.blocks[activeIdx];
      var currentTasks = currentBlock ? currentBlock.tasks : [];
      var tasksDone = currentTasks.filter(function(t) { return isTaskDone(t.id); }).length;

      var blockInfo = isAllDone
        ? 'All blocks complete'
        : 'Block ' + (activeIdx + 1) + ': ' + currentBlock.name + ' — ' + tasksDone + '/' + currentTasks.length + ' tasks';

      return '<div class="project-card" data-project="' + project.id + '">' +
        '<div class="project-card-top">' +
          '<span class="project-card-name">' + esc(project.name) + '</span>' +
          '<span class="project-card-progress-text">' + doneBlocks + '/' + totalBlocks + '</span>' +
        '</div>' +
        '<div class="block-track">' + segments + '</div>' +
        '<div class="project-card-block">' +
          '<span>' + esc(blockInfo) + '</span>' +
          (isAllDone ? '' : '<span class="project-card-enter">Enter &#8594;</span>') +
        '</div>' +
      '</div>';
    }).join('');

    el.querySelectorAll('.project-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var id = card.getAttribute('data-project');
        enterFocus(id);
      });
    });
  }

  // ── Focus Mode ────────────────────────────

  function enterFocus(projectId) {
    focusProjectId = projectId;
    document.getElementById('project-list').classList.add('hidden');
    document.getElementById('mission-hero').classList.add('hidden');
    document.getElementById('focus-mode').classList.remove('hidden');
    document.getElementById('back-btn').classList.remove('hidden');
    document.getElementById('tab-switcher').classList.add('hidden');

    var project = data.projects.find(function(p) { return p.id === projectId; });
    if (project) document.getElementById('header-title').textContent = project.name;

    renderFocus();
  }

  function exitFocus() {
    focusProjectId = null;
    document.getElementById('focus-mode').classList.add('hidden');
    document.getElementById('focus-mode').innerHTML = '';
    document.getElementById('back-btn').classList.add('hidden');
    document.getElementById('tab-switcher').classList.remove('hidden');
    document.getElementById('header-title').textContent = 'Mission Control';
    renderProjectList();
  }

  function renderFocus() {
    var el = document.getElementById('focus-mode');
    var project = data.projects.find(function(p) { return p.id === focusProjectId; });
    if (!project) return;

    var activeIdx = getActiveBlockIndex(project);
    var isAllDone = activeIdx >= project.blocks.length;

    var html = '';

    // Project name
    html += '<div class="focus-project-name">' + esc(project.name) + '</div>';

    // Completed blocks (collapsed)
    if (activeIdx > 0) {
      html += '<div class="completed-blocks">';
      for (var c = 0; c < activeIdx; c++) {
        html += '<div class="completed-block">' +
          '<span class="completed-block-check"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>' +
          'Block ' + (c + 1) + ': ' + esc(project.blocks[c].name) +
        '</div>';
      }
      html += '</div>';
    }

    if (isAllDone) {
      html += '<div class="block-complete-banner">' +
        '<div class="block-complete-text">All blocks complete. Project done.</div>' +
      '</div>';
    } else {
      var block = project.blocks[activeIdx];
      var tasks = block.tasks;
      var done = tasks.filter(function(t) { return isTaskDone(t.id); }).length;
      var total = tasks.length;
      var pct = total > 0 ? Math.round((done / total) * 100) : 0;
      var allTasksDone = done === total;

      html += '<div class="focus-block-name">Block ' + (activeIdx + 1) + ': ' + esc(block.name) + '</div>';
      html += '<div class="focus-progress">' +
        '<div class="focus-bar"><div class="focus-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<span class="focus-bar-text">' + done + '/' + total + ' tasks</span>' +
      '</div>';

      // Tasks
      html += '<div class="task-list">';
      tasks.forEach(function(task) {
        var isDone = isTaskDone(task.id);
        html += '<div class="task-item" data-task="' + task.id + '">' +
          '<button class="task-checkbox ' + (isDone ? 'checked' : '') + '" aria-label="Toggle task">' +
            (isDone ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
          '</button>' +
          '<div class="task-content">' +
            '<div class="task-text ' + (isDone ? 'is-done' : '') + '">' + esc(task.text) + '</div>' +
            (task.tag ? '<div class="task-tag">' + esc(task.tag) + '</div>' : '') +
          '</div>' +
        '</div>';
      });
      html += '</div>';

      // Block complete banner
      if (allTasksDone) {
        var nextBlock = project.blocks[activeIdx + 1];
        html += '<div class="block-complete-banner">' +
          '<div class="block-complete-text">Block ' + (activeIdx + 1) + ' done.' +
            (nextBlock ? ' Ready for Block ' + (activeIdx + 2) + '?' : ' Project complete.') +
          '</div>' +
        '</div>';
      }

      // Next block teaser (if not last)
      if (!allTasksDone && activeIdx + 1 < project.blocks.length) {
        var next = project.blocks[activeIdx + 1];
        html += '<div class="next-block-teaser">Next block: ' + esc(next.name) + ' (unlocks when done)</div>';
      }

      // Locked future blocks
      if (activeIdx + 1 < project.blocks.length) {
        html += '<div class="locked-blocks">';
        for (var l = activeIdx + 1; l < project.blocks.length; l++) {
          html += '<div class="locked-block">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
            'Block ' + (l + 1) + ': ' + esc(project.blocks[l].name) +
          '</div>';
        }
        html += '</div>';
      }
    }

    el.innerHTML = html;

    // Attach task toggle handlers
    el.querySelectorAll('.task-checkbox').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var taskId = btn.closest('.task-item').getAttribute('data-task');
        toggleTask(taskId);
        renderFocus();
      });
    });
  }

  // ── Dashboard ─────────────────────────────

  function renderDashboard() {
    if (!data) return;
    renderPipeline();
    renderCadence();
    renderPlatforms();
  }

  function renderPipeline() {
    var el = document.getElementById('pipeline-cards');
    var totalEl = document.getElementById('pipeline-total');
    if (!data.pipeline) return;

    totalEl.textContent = (data.numbers ? data.numbers.pipeline_total : '') + ' pipeline';

    el.innerHTML = data.pipeline.map(function(p) {
      var dotClass = p.status === 'active' ? 'green' : p.status === 'waiting' ? 'yellow' : 'gray';
      return '<div class="pipe-card">' +
        '<div class="pipe-card-top">' +
          '<span class="pipe-dot ' + dotClass + '"></span>' +
          '<span class="pipe-name">' + esc(p.name) + '</span>' +
        '</div>' +
        '<div class="pipe-value">' + esc(p.value) + '</div>' +
        '<div class="pipe-note">' + esc(p.note) + '</div>' +
        '<div class="pipe-type">' + esc(p.type) + '</div>' +
      '</div>';
    }).join('');
  }

  function renderCadence() {
    var el = document.getElementById('cadence-grid');
    if (!data.content_cadence) return;

    var cc = data.content_cadence;
    var channels = cc.channels;
    var brandNames = Object.keys(cc.brands);

    var headerRow = '<tr><th></th>' + brandNames.map(function(b) { return '<th>' + esc(b) + '</th>'; }).join('') + '</tr>';

    var rows = channels.map(function(ch) {
      var cells = brandNames.map(function(brand) {
        var entry = cc.brands[brand][ch];
        if (entry === null || entry === undefined) return '<td><span class="cadence-chip na">—</span></td>';
        if (entry.status === 'blocked') return '<td><span class="cadence-chip blocked">' + esc(entry.note || 'Blocked') + '</span></td>';
        if (entry.status === 'not_started') return '<td><span class="cadence-chip not-started">Not started</span></td>';
        var label = entry.done + '/' + entry.target + ' this ' + entry.period;
        var cls = entry.done >= entry.target ? 'on-track' : entry.done > 0 ? 'behind' : 'not-started';
        return '<td><span class="cadence-chip ' + cls + '">' + esc(label) + '</span></td>';
      }).join('');
      return '<tr><td>' + esc(ch) + '</td>' + cells + '</tr>';
    }).join('');

    el.innerHTML = '<table class="cadence-table"><thead>' + headerRow + '</thead><tbody>' + rows + '</tbody></table>';
  }

  function renderPlatforms() {
    var el = document.getElementById('platforms');
    if (!data.platforms) return;

    el.innerHTML = data.platforms.map(function(p) {
      return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" class="platform-card">' +
        '<div>' +
          '<div class="platform-name">' + esc(p.name) + '</div>' +
          '<div class="platform-action">' + esc(p.action) + '</div>' +
        '</div>' +
        '<span class="platform-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>' +
      '</a>';
    }).join('');
  }

  // ── Numbers Footer ────────────────────────

  function renderNumbers() {
    if (!data || !data.numbers) return;
    document.getElementById('num-mrr').textContent = data.numbers.mrr;
    document.getElementById('num-pipeline').textContent = data.numbers.pipeline_total;
    document.getElementById('num-costs').textContent = data.numbers.costs;

    var deadline = new Date(data.mission.deadline + 'T23:59:59');
    var daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));
    document.getElementById('num-days').textContent = daysLeft;
  }

  // ── Utilities ─────────────────────────────

  function esc(str) {
    if (str == null) return '';
    var div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function formatISO(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function formatDate(d) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // ── Boot ──────────────────────────────────

  document.addEventListener('DOMContentLoaded', initGate);

})();
