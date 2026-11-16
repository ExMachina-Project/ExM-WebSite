/* ═══════════════════════════════════════════════════════════════════════
   EXMACHINA · 智械计划 — 官网脚本
   ──────────────────────────────────────────────────────────────────────
   1. 站内安装命令域名注入
   2. 安装方式页签
   3. 复制到剪贴板
   4. 滚动进度条
   5. 滚动数字
   6. 集群拓扑（生成 + 依赖追踪 + 检查器）
   7. 审计轨迹演示（确定性脚本，不调用模型）
   8. SOUL 人设切换
   9. 移动端菜单
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────── 1. 域名注入 ───────── */
  var ORIGIN = (window.location.origin || "").replace(/\/$/, "");
  document.querySelectorAll(".site-origin").forEach(function (el) {
    el.textContent = ORIGIN + el.textContent;
  });
  document.querySelectorAll("[data-copy]").forEach(function (el) {
    el.setAttribute("data-copy", el.getAttribute("data-copy").replace(/__ORIGIN__/g, ORIGIN));
  });

  /* ───────── 2. 安装页签 ───────── */
  var tabs = document.querySelectorAll(".tab");
  var panes = document.querySelectorAll(".tabpane");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      panes.forEach(function (p) { p.classList.remove("is-active"); });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      var pane = document.querySelector('.tabpane[data-pane="' + tab.dataset.tab + '"]');
      if (pane) pane.classList.add("is-active");
    });
  });

  /* ───────── 3. 复制 ───────── */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      var text = btn.dataset.copy || "";
      var label = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;top:0;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (_) { /* 忽略 */ }
        document.body.removeChild(ta);
      }
      btn.textContent = "COPIED";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = label;
        btn.disabled = false;
      }, 1500);
    });
  });

  /* ───────── 4. 滚动进度 ───────── */
  var bar = document.getElementById("scrollProgress");
  if (bar) {
    var onScroll = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      bar.style.width = (p * 100).toFixed(2) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ───────── 5. 滚动数字 ───────── */
  (function () {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.textContent = el.dataset.count; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var target = parseInt(el.dataset.count, 10) || 0;
        var t0 = performance.now();
        (function tick(now) {
          var p = Math.min((now - t0) / 800, 1);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ───────── 6. 集群拓扑 ───────── */
  (function () {
    var edgesG = document.getElementById("topoEdges");
    var nodesG = document.getElementById("topoNodes");
    if (!edgesG || !nodesG) return;

    var NS = "http://www.w3.org/2000/svg";
    var CX = 380, CY = 300, RING = { 1: 150, 2: 212 };

    var CORE = {
      id: "core", label: "EXM / CORE", meta: "ORCHESTRATOR", role: "指挥体",
      desc: "负责任务分解、个体调度与结果汇总的核心指挥节点。",
      state: "NOMINAL", links: "14 ACTIVE", r: 22
    };

    var DEFS = [
      { id: "planner", label: "PLANNER", meta: "DECOMPOSITION", role: "任务规划", ring: 1, angle: -90, r: 12,
        desc: "把目标拆成 DAG，为每个节点附带验收口径与依赖。", state: "ACTIVE" },
      { id: "executor", label: "EXECUTOR", meta: "WORKSPACE", role: "实作", ring: 1, angle: -30, r: 12,
        desc: "工作区内执行实作任务，工具调用与命令受执行闸门管控。", state: "ACTIVE" },
      { id: "reviewer", label: "REVIEWER", meta: "CONTRACT", role: "校验", ring: 1, angle: 30, r: 12,
        desc: "校验 SyncReport 结构与业务口径，不合规即打回重写。", state: "ACTIVE" },
      { id: "research", label: "RESEARCH", meta: "EVIDENCE", role: "检索", ring: 1, angle: 90, r: 12,
        desc: "收集证据并标注证据等级（A 直接验证 — D 推断）。", state: "ACTIVE" },
      { id: "coder", label: "CODER", meta: "AWAITING APPROVAL", role: "代码执行", ring: 1, angle: 150, r: 12, warn: true,
        desc: "写操作进入审批队列，批准后代理执行并回灌输出。", state: "BLOCKED" },
      { id: "architect", label: "ARCHITECT", meta: "DESIGN", role: "架构", ring: 1, angle: 210, r: 12,
        desc: "评估改动的影响面与分层边界，指出结构性风险。", state: "ACTIVE" },
      { id: "memory", label: "MEMORY", meta: "CHORUS / PRIVATE", role: "分层记忆", ring: 2, angle: -72, r: 9,
        desc: "群体记忆共享决策与证据，个体记忆私有教训与技巧。", state: "NOMINAL" },
      { id: "tools", label: "TOOLS", meta: "GATEWAY", role: "工具网关", ring: 2, angle: -24, r: 9,
        desc: "沙箱、白名单、审批、审计；MCP 双向挂载。", state: "NOMINAL" },
      { id: "sync", label: "SYNC RPT", meta: "5 FIELDS", role: "契约回流", ring: 2, angle: 24, r: 9,
        desc: "结论 / 证据等级 / 风险 / 阻塞 / 置信度，五项俱全才收卷。", state: "ACTIVE" },
      { id: "ledger", label: "LEDGER", meta: "TASK/EVID/RISK", role: "三账", ring: 2, angle: 72, r: 9,
        desc: "任务账、证据账、风险账随任务原子更新，结论始终可追溯。", state: "ACTIVE" },
      { id: "audit", label: "AUDIT", meta: "POLICY", role: "风险审计", ring: 2, angle: 120, r: 9, warn: true,
        desc: "风险策略触发检查，任何结论都可追溯到依据与退路。", state: "REVIEW" },
      { id: "worker", label: "WORKER", meta: "EDGE NODE", role: "边缘算力", ring: 2, angle: 168, r: 9,
        desc: "旧设备接入承接派发，离线或超时自动回落本地执行。", state: "NOMINAL" },
      { id: "channel", label: "CHANNELS", meta: "9 PLATFORMS", role: "通道", ring: 2, angle: 216, r: 9,
        desc: "Telegram / Discord / Slack / Matrix / Webhook 等九类接入。", state: "NOMINAL" },
      { id: "plugin", label: "PLUGINS", meta: "DECL/PROC/RUST", role: "插件", ring: 2, angle: 264, r: 9,
        desc: "声明式零代码、任意语言进程、Rust 内置三类插件统一装载。", state: "NOMINAL" }
    ];

    var nodes = DEFS.map(function (d) {
      var rad = (d.angle * Math.PI) / 180;
      d.x = CX + Math.cos(rad) * RING[d.ring];
      d.y = CY + Math.sin(rad) * RING[d.ring];
      return d;
    });

    var links = nodes.map(function (n) { return { a: "core", b: n.id }; });
    [1, 2].forEach(function (ring) {
      var rs = nodes.filter(function (n) { return n.ring === ring; });
      rs.forEach(function (n, i) { links.push({ a: n.id, b: rs[(i + 1) % rs.length].id }); });
    });

    var pos = { core: { x: CX, y: CY } };
    nodes.forEach(function (n) { pos[n.id] = { x: n.x, y: n.y }; });

    var edgeEls = links.map(function (l) {
      var a = pos[l.a], b = pos[l.b];
      var el = document.createElementNS(NS, "line");
      el.setAttribute("x1", a.x.toFixed(1));
      el.setAttribute("y1", a.y.toFixed(1));
      el.setAttribute("x2", b.x.toFixed(1));
      el.setAttribute("y2", b.y.toFixed(1));
      el.setAttribute("class", "topo-edge");
      el.dataset.a = l.a;
      el.dataset.b = l.b;
      edgesG.appendChild(el);
      return el;
    });

    var nodeEls = {};

    function makeNode(d, isCore) {
      var haloR = Math.round(d.r * 2.1) + 8;
      var g = document.createElementNS(NS, "g");
      g.setAttribute("class", "topo-node");
      g.setAttribute("transform", "translate(" + d.x.toFixed(1) + " " + d.y.toFixed(1) + ")");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", d.label + " · " + d.role);
      g.dataset.id = d.id;

      function circ(cls, r, extra) {
        var c = document.createElementNS(NS, "circle");
        c.setAttribute("class", cls);
        c.setAttribute("r", r);
        if (extra) Object.keys(extra).forEach(function (k) { c.setAttribute(k, extra[k]); });
        g.appendChild(c);
      }

      circ("halo" + (isCore ? " topo-core-halo" : ""), haloR);
      if (isCore) circ("halo", haloR - 11, { "stroke-dasharray": "3 5" });
      circ("core", d.r);
      circ("pin", isCore ? 3.2 : 2.4);

      if (isCore) {
        var cross = document.createElementNS(NS, "path");
        cross.setAttribute("d", "M-7 0H7M0-7V7");
        cross.setAttribute("stroke", "var(--accent)");
        cross.setAttribute("stroke-width", "1");
        cross.setAttribute("fill", "none");
        g.appendChild(cross);
      }

      /* 标签沿径向朝外，左右按象限对齐，避免相邻重叠 */
      var anchor = "middle", lx = 0, ly;
      if (isCore) {
        ly = d.r + 30;
      } else {
        var rad = (d.angle * Math.PI) / 180;
        var cosv = Math.cos(rad);
        var push = d.r + 11;
        lx = cosv * push;
        ly = Math.sin(rad) * push - 2;
        if (cosv > 0.3) anchor = "start";
        else if (cosv < -0.3) anchor = "end";
      }

      var label = document.createElementNS(NS, "text");
      label.setAttribute("class", "label");
      label.setAttribute("text-anchor", anchor);
      label.setAttribute("x", lx.toFixed(1));
      label.setAttribute("y", ly.toFixed(1));
      label.textContent = d.label;
      g.appendChild(label);

      var meta = document.createElementNS(NS, "text");
      meta.setAttribute("class", "meta");
      meta.setAttribute("text-anchor", anchor);
      meta.setAttribute("x", lx.toFixed(1));
      meta.setAttribute("y", (ly + 10).toFixed(1));
      meta.textContent = d.meta;
      g.appendChild(meta);

      if (d.warn) g.classList.add("is-warn");
      nodesG.appendChild(g);
      nodeEls[d.id] = g;
    }

    var coreNode = Object.assign({ x: CX, y: CY }, CORE);
    makeNode(coreNode, true);
    nodes.forEach(function (n) {
      var c = links.filter(function (l) { return l.a === n.id || l.b === n.id; }).length;
      n.links = (c < 10 ? "0" + c : String(c)) + " ACTIVE";
      makeNode(n, false);
    });

    var byId = { core: coreNode };
    nodes.forEach(function (n) { byId[n.id] = n; });
    byId.core.links = "14 ACTIVE";

    var selected = "core", hovered = null;

    function nearSet(id) {
      var s = {};
      s[id] = true;
      links.forEach(function (l) {
        if (l.a === id) s[l.b] = true;
        if (l.b === id) s[l.a] = true;
      });
      return s;
    }

    function paint() {
      var focus = hovered || selected;
      var near = nearSet(focus);
      edgeEls.forEach(function (el) {
        var a = el.dataset.a, b = el.dataset.b;
        el.classList.toggle("is-hot", (a === focus && b === selected) || (b === focus && a === selected));
        el.classList.toggle("is-dim", !(near[a] && near[b]));
      });
      Object.keys(nodeEls).forEach(function (id) {
        nodeEls[id].classList.toggle("is-selected", id === selected);
        nodeEls[id].classList.toggle("is-faded", !near[id]);
      });
    }

    function show(d) {
      document.getElementById("inspKind").textContent = d.id === "core" ? "CORE" : d.meta.split(" ")[0];
      document.getElementById("inspRole").textContent = d.role;
      document.getElementById("inspName").textContent = d.label;
      document.getElementById("inspDesc").textContent = d.desc;
      document.getElementById("inspTarget").textContent = d.label;
      var st = document.getElementById("inspState");
      st.textContent = d.state;
      st.className = "v";
      if (d.state === "BLOCKED") st.classList.add("is-err");
      else if (d.state === "REVIEW") st.classList.add("is-warn");
      document.getElementById("inspLinks").textContent = d.links || "02 ACTIVE";
    }

    Object.keys(nodeEls).forEach(function (id) {
      var g = nodeEls[id];
      g.addEventListener("mouseenter", function () { hovered = id; paint(); });
      g.addEventListener("mouseleave", function () { hovered = null; paint(); });
      g.addEventListener("focus", function () { hovered = id; paint(); });
      g.addEventListener("blur", function () { hovered = null; paint(); });
      g.addEventListener("click", function () { selected = id; paint(); show(byId[id]); });
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selected = id;
          paint();
          show(byId[id]);
        }
      });
    });

    paint();
  })();

  /* ───────── 7. 审计轨迹演示 ───────── */
  (function () {
    var panel = document.getElementById("tracePanel");
    if (!panel) return;

    var AGENTS = [
      { id: "planner", name: "PLANNER-01", role: "拆解 DAG" },
      { id: "research", name: "RESEARCH-03", role: "收集证据" },
      { id: "coder", name: "CODER-04", role: "实作改动" },
      { id: "reviewer", name: "REVIEWER", role: "契约校验" }
    ];

    /* 确定性脚本：每一步推进状态、追加事件、记账 */
    var STEPS = [
      {
        t: "00:00", clock: "00:00",
        agent: "planner", agentState: "active", agentLabel: "RUNNING",
        code: "PLAN", codeCls: "",
        msg: "指挥体锁定边界，输出 <b>OrchestratorPlan</b>",
        sub: "L2 并行 · 4 节点 · 验收口径已附带",
        ledger: null
      },
      {
        t: "00:01", clock: "00:01",
        agent: "planner", agentState: "ok", agentLabel: "DONE",
        code: "PLAN_OK", codeCls: "ok",
        msg: "DAG 已编译，<b>3 个派发单</b>生成",
        sub: "T-8F2A → RESEARCH / CODER / REVIEWER",
        ledger: "task", taskAdd: 3
      },
      {
        t: "00:02", clock: "00:02",
        agent: "research", agentState: "active", agentLabel: "RUNNING",
        code: "DISPATCH", codeCls: "",
        msg: "<b>RESEARCH-03</b> 领到 DispatchOrder",
        sub: "边界 / 验收口径 / 依赖已随单下发",
        ledger: null
      },
      {
        t: "00:04", clock: "00:04",
        agent: "research", agentState: "ok", agentLabel: "SYNCED",
        code: "SYNC_OK", codeCls: "ok",
        msg: "SyncReport 交卷：<b>证据等级 A</b>",
        sub: "结论 / 风险 / 阻塞 / 置信度 五项俱全",
        ledger: "evidence", evAdd: 2
      },
      {
        t: "00:05", clock: "00:05",
        agent: "coder", agentState: "active", agentLabel: "RUNNING",
        code: "EXEC", codeCls: "",
        msg: "<b>CODER-04</b> 进入工作区执行改动",
        sub: "patch 工具 · 单文件原子提交",
        ledger: null
      },
      {
        t: "00:07", clock: "00:07",
        agent: "coder", agentState: "warn", agentLabel: "CONFLICT",
        code: "CONFLICT", codeCls: "warn",
        msg: "结论与 RESEARCH 冲突，<b>未静默合并</b>",
        sub: "CODER: 需重构 / RESEARCH: 改动面过大",
        ledger: "risk", riskAdd: 1
      },
      {
        t: "00:09", clock: "00:09",
        agent: "coder", agentState: "conflict", agentLabel: "BLOCKED",
        code: "JUDGE", codeCls: "judge",
        msg: "动态追加<b>裁决节点</b>，交指挥体裁定",
        sub: "分歧显式留在记录里，可回溯",
        ledger: null
      },
      {
        t: "00:12", clock: "00:12",
        agent: "reviewer", agentState: "active", agentLabel: "RUNNING",
        code: "JUDGED", codeCls: "judge",
        msg: "裁决：<b>按 CODER 方案</b>，附回退路径",
        sub: "风险账已记录影响 / 阻断 / 回退",
        ledger: null
      },
      {
        t: "00:14", clock: "00:14",
        agent: "reviewer", agentState: "ok", agentLabel: "VERIFIED",
        code: "VERIFY", codeCls: "ok",
        msg: "<b>REVIEWER</b> 校验通过，契约无缺口",
        sub: "结构与业务双校验 · 一次通过",
        ledger: "evidence", evAdd: 1
      },
      {
        t: "00:16", clock: "00:16",
        agent: "reviewer", agentState: "ok", agentLabel: "DONE",
        code: "COMMIT", codeCls: "ok",
        msg: "三账原子落库，<b>收束汇裁</b>完成",
        sub: "任务账 3 · 证据账 3 · 风险账 1",
        ledger: "task", taskAdd: 0, final: true
      }
    ];

    var agentsEl = document.getElementById("traceAgents");
    var eventsEl = document.getElementById("traceEvents");
    var answerEl = document.getElementById("traceAnswerBody");
    var fillEl = document.getElementById("traceFill");
    var clockEl = document.getElementById("traceClock");
    var liveEl = document.getElementById("traceLive");
    var playBtn = document.getElementById("tracePlay");
    var playIcon = document.getElementById("tracePlayIcon");
    var playText = document.getElementById("tracePlayText");
    var resetBtn = document.getElementById("traceReset");

    /* 生成个体列表 */
    var agentEls = {};
    AGENTS.forEach(function (a) {
      var row = document.createElement("div");
      row.className = "agent";
      row.innerHTML =
        '<span class="agent-dot"></span>' +
        '<span class="agent-name">' + a.name + '<span class="agent-role"> · ' + a.role + '</span></span>' +
        '<span class="agent-state">IDLE</span>';
      agentsEl.appendChild(row);
      agentEls[a.id] = row;
    });

    var counters = { task: 0, evidence: 0, risk: 0 };
    var ledgerEls = {};
    Object.keys(counters).forEach(function (k) {
      ledgerEls[k] = document.querySelector('.ledger[data-ledger="' + k + '"]');
    });

    var idx = 0;
    var timer = null;
    var playing = false;

    function setAgent(id, state, label) {
      var row = agentEls[id];
      if (!row) return;
      row.classList.remove("is-active", "is-ok", "is-warn", "is-conflict");
      if (state && state !== "idle") row.classList.add("is-" + state);
      row.querySelector(".agent-state").textContent = label;
    }

    function addEvent(step) {
      var li = document.createElement("li");
      li.className = "event";
      li.innerHTML =
        '<span class="event-t">' + step.t + "</span>" +
        '<span class="event-m">' + step.msg + "<i>" + step.sub + "</i></span>" +
        '<span class="event-c ' + step.codeCls + '">' + step.code + "</span>";
      eventsEl.appendChild(li);
      /* 最多保留 6 条，超出滚出顶部 */
      while (eventsEl.children.length > 6) eventsEl.removeChild(eventsEl.firstChild);
    }

    function bumpLedger(key, add) {
      if (!add) return;
      counters[key] += add;
      var el = ledgerEls[key];
      el.querySelector("[data-v]").textContent = counters[key];
      el.classList.add("is-hot");
      setTimeout(function () { el.classList.remove("is-hot"); }, 420);
    }

    function renderAnswer() {
      answerEl.innerHTML =
        '<div class="answer-report">' +
        '<div class="answer-row"><dt>结论</dt><dd><b>按 CODER 方案实施</b>，同时收敛改动面至单模块</dd></div>' +
        '<div class="answer-row"><dt>证据</dt><dd>静态分析可确认调用链 <span class="badge-ev">A</span>；运行时影响 <span class="badge-ev b">B</span></dd></div>' +
        '<div class="answer-row"><dt>风险</dt><dd>影响面受限 · 保留<em>一键回退</em> · 已记录检查点</dd></div>' +
        '<div class="answer-row"><dt>裁决</dt><dd>1 处分歧已显式裁定，未静默合并</dd></div>' +
        "</div>";
    }

    function runStep() {
      if (idx >= STEPS.length) {
        finish();
        return;
      }
      var step = STEPS[idx];

      setAgent(step.agent, step.agentState, step.agentLabel);
      addEvent(step);
      bumpLedger(step.ledger, step.taskAdd || step.evAdd || step.riskAdd);

      clockEl.textContent = step.clock;
      fillEl.style.width = (((idx + 1) / STEPS.length) * 100).toFixed(1) + "%";

      if (step.final) renderAnswer();

      idx++;
      if (playing) timer = setTimeout(runStep, reduceMotion ? 120 : 760);
    }

    function setPlayingUI() {
      playIcon.textContent = playing ? "❚❚" : "▶";
      playText.textContent = playing ? "PAUSE" : idx === 0 ? "RUN" : "RESUME";
      liveEl.textContent = playing ? "● RUNNING" : "● PAUSED";
      liveEl.className = "trace-live mono" + (playing ? " is-running" : "");
    }

    function finish() {
      playing = false;
      clearTimeout(timer);
      playIcon.textContent = "↻";
      playText.textContent = "REPLAY";
      liveEl.textContent = "● COMPLETE";
      liveEl.className = "trace-live mono is-done";
      fillEl.style.width = "100%";
    }

    function reset() {
      clearTimeout(timer);
      playing = false;
      idx = 0;
      counters = { task: 0, evidence: 0, risk: 0 };
      eventsEl.innerHTML = "";
      answerEl.innerHTML = '<p class="answer-idle">等待执行…</p>';
      clockEl.textContent = "00:00";
      fillEl.style.width = "0%";
      Object.keys(ledgerEls).forEach(function (k) {
        ledgerEls[k].querySelector("[data-v]").textContent = "0";
        ledgerEls[k].classList.remove("is-hot");
      });
      Object.keys(agentEls).forEach(function (id) {
        agentEls[id].classList.remove("is-active", "is-ok", "is-warn", "is-conflict");
        agentEls[id].querySelector(".agent-state").textContent = "IDLE";
      });
      liveEl.textContent = "● READY";
      liveEl.className = "trace-live mono";
      playIcon.textContent = "▶";
      playText.textContent = "RUN";
    }

    function toggle() {
      if (idx >= STEPS.length) {
        reset();
        playing = true;
        setPlayingUI();
        timer = setTimeout(runStep, 200);
        return;
      }
      playing = !playing;
      setPlayingUI();
      if (playing) {
        timer = setTimeout(runStep, 200);
      } else {
        clearTimeout(timer);
      }
    }

    playBtn.addEventListener("click", toggle);
    resetBtn.addEventListener("click", function () {
      reset();
      setPlayingUI();
    });

    /* 进入视口自动播放一次 */
    if (!reduceMotion && "IntersectionObserver" in window) {
      var auto = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && idx === 0 && !playing) {
            auto.disconnect();
            playing = true;
            setPlayingUI();
            timer = setTimeout(runStep, 420);
          }
        });
      }, { threshold: 0.35 });
      auto.observe(panel);
    }
  })();

  /* ───────── 8. SOUL 切换 ───────── */
  (function () {
    var SOULS = [
      {
        file: "agents/personas/machina.md",
        desc: "绝对理性，摒弃拟人表达，证据分级、冲突裁决、全程可审计。",
        sample: "【报告】主要风险集中在配置层。证据等级 B——静态分析可确认调用链，但未做运行时验证。"
      },
      {
        file: "agents/personas/warm.md",
        desc: "换一份 SOUL 文件，同一个底座立刻变成情感丰富的伙伴。",
        sample: "搞定啦！我顺手把配置层的三处隐患都清了，还给你写了个小测试兜底。"
      },
      {
        file: "agents/personas/minimal.md",
        desc: "只说结论，不解释过程。适合熟练用户与自动化流水线。",
        sample: "3 issues fixed. 1 test added. See diff."
      }
    ];

    var tabs = document.querySelectorAll(".soul-tab");
    if (!tabs.length) return;
    var fileEl = document.getElementById("soulFile");
    var descEl = document.getElementById("soulDesc");
    var sampleEl = document.getElementById("soulSample");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var i = parseInt(tab.dataset.soul, 10) || 0;
        tabs.forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        var s = SOULS[i];
        fileEl.textContent = s.file;
        descEl.textContent = s.desc;
        sampleEl.textContent = s.sample;
        sampleEl.style.animation = "none";
        void sampleEl.offsetWidth; /* 强制重排以重播动画 */
        sampleEl.style.animation = "";
      });
    });
  })();

  /* ───────── 9. 移动端菜单 ───────── */
  (function () {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  })();
})();
