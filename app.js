/* The Grammar Line – Schüler-App */
(function () {
  "use strict";
  const C = window.COURSE, G = C.game, CK = window.GrammarCheck;
  const LS_KEY = "grammarline.v1";
  const UNITS = C.modules.concat([C.finalChallenge]);
  const EX = {};
  UNITS.forEach((u) => u.exercises.forEach((e, i) => { EX[e.id] = { ex: e, unit: u, index: i }; }));

  /* ---------- Hilfsfunktionen ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function h(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    });
    kids.flat().forEach((k) => { if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(k)); });
    return n;
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const nl2br = (s) => esc(s).replace(/\n/g, "<br>");
  const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Zustand ---------- */
  function emptyProgress() {
    return { ex: {}, bestStreak: 0, streak: 0, settings: { avatar: "fox", pet: "none", theme: "auto", t: 0 }, updated: 0 };
  }
  function mergeProgress(a, b) {
    a = a && typeof a === "object" ? a : {}; b = b && typeof b === "object" ? b : {};
    const out = emptyProgress();
    const exA = a.ex || {}, exB = b.ex || {};
    new Set(Object.keys(exA).concat(Object.keys(exB))).forEach((id) => {
      const x = exA[id] || {}, y = exB[id] || {};
      const xp = Math.max(+x.xp || 0, +y.xp || 0);
      const newer = (+x.t || 0) >= (+y.t || 0) ? x : y;
      const rec = { done: !!(x.done || y.done), xp, sol: xp > 0 ? false : !!(x.sol || y.sol), att: Math.max(+x.att || 0, +y.att || 0), t: Math.max(+x.t || 0, +y.t || 0) };
      const ans = typeof newer.ans === "string" ? newer.ans : (typeof x.ans === "string" ? x.ans : y.ans);
      if (typeof ans === "string") rec.ans = ans;
      if (x.hint || y.hint) rec.hint = true;
      out.ex[id] = rec;
    });
    const newerTop = (+a.updated || 0) >= (+b.updated || 0) ? a : b;
    out.bestStreak = Math.max(+a.bestStreak || 0, +b.bestStreak || 0);
    out.streak = +newerTop.streak || 0;
    const sa = a.settings || {}, sb = b.settings || {};
    const s = (+sa.t || 0) >= (+sb.t || 0) ? sa : sb;
    out.settings = { avatar: s.avatar || "fox", pet: s.pet || "none", theme: s.theme || "auto", t: +s.t || 0 };
    out.updated = Math.max(+a.updated || 0, +b.updated || 0);
    return out;
  }
  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      return { progress: mergeProgress(raw.progress, {}), auth: raw.auth && raw.auth.token ? raw.auth : null };
    } catch (e) { return { progress: emptyProgress(), auth: null }; }
  }
  let state = loadState();
  let storageOk = true;
  function persist() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); storageOk = true; } catch (e) { storageOk = false; }
  }
  const P = () => state.progress;
  const rec = (id) => P().ex[id] || null;
  function touch(id) {
    const r = P().ex[id] || (P().ex[id] = { done: false, xp: 0, sol: false, att: 0, t: 0 });
    r.t = Date.now();
    P().updated = Date.now();
    return r;
  }

  /* ---------- Berechnungen ---------- */
  function totalXP(p) { p = p || P(); return Object.keys(p.ex).reduce((s, id) => s + (EX[id] ? (+p.ex[id].xp || 0) : 0), 0); }
  function levelInfo(xp) {
    let i = 0;
    G.levels.forEach((l, k) => { if (xp >= l.min) i = k; });
    const cur = G.levels[i], next = G.levels[i + 1];
    const pct = next ? Math.round(((xp - cur.min) / (next.min - cur.min)) * 100) : 100;
    return { level: i + 1, title: cur.title, min: cur.min, next: next ? next.min : null, pct };
  }
  function unitStats(u, p) {
    p = p || P();
    const main = u.exercises.filter((e) => !e.bonus), bonus = u.exercises.filter((e) => e.bonus);
    const isDone = (e) => p.ex[e.id] && p.ex[e.id].done;
    const done = main.filter(isDone).length;
    return {
      done, total: main.length, bonusDone: bonus.filter(isDone).length, bonusTotal: bonus.length,
      complete: done === main.length,
      noPeek: done === main.length && main.every((e) => (p.ex[e.id].xp || 0) > 0),
      xp: u.exercises.reduce((s, e) => s + ((p.ex[e.id] && p.ex[e.id].xp) || 0), 0),
      maxXp: u.exercises.reduce((s, e) => s + e.xp, 0)
    };
  }
  const allExercises = () => Object.values(EX).map((x) => x.ex);
  const BADGES = [
    { id: "first", icon: "🎫", name: "First ticket", desc: "Die erste Aufgabe gelöst", test: (p) => allExercises().some((e) => p.ex[e.id] && p.ex[e.id].done) },
    { id: "streak5", icon: "🔥", name: "On a roll", desc: "5 Aufgaben nacheinander beim ersten Versuch richtig", test: (p) => p.bestStreak >= 5 },
    { id: "streak10", icon: "⚡", name: "Express train", desc: "10 Aufgaben nacheinander beim ersten Versuch richtig", test: (p) => p.bestStreak >= 10 },
    { id: "writer", icon: "✍️", name: "Writer", desc: "5 Schreibaufgaben abgeschlossen", test: (p) => allExercises().filter((e) => e.type === "free" && p.ex[e.id] && p.ex[e.id].done).length >= 5 },
    { id: "nopeek", icon: "🔍", name: "No peeking", desc: "Eine Station ohne Blick in die Lösung abgeschlossen", test: (p) => C.modules.some((u) => unitStats(u, p).noPeek) },
    { id: "bonus3", icon: "💎", name: "Bonus hunter", desc: "3 Bonusaufgaben gelöst", test: (p) => allExercises().filter((e) => e.bonus && p.ex[e.id] && p.ex[e.id].done).length >= 3 },
    { id: "half", icon: "🚉", name: "Halfway there", desc: "6 Stationen abgeschlossen", test: (p) => C.modules.filter((u) => unitStats(u, p).complete).length >= 6 },
    { id: "line", icon: "🗺️", name: "End of the line", desc: "Alle 12 Stationen abgeschlossen", test: (p) => C.modules.every((u) => unitStats(u, p).complete) },
    { id: "bonusall", icon: "🏆", name: "Bonus master", desc: "Alle Bonusaufgaben gelöst", test: (p) => allExercises().filter((e) => e.bonus).every((e) => p.ex[e.id] && p.ex[e.id].done) },
    { id: "final", icon: "🎓", name: "Graduate", desc: "Die Abschluss-Challenge gemeistert", test: (p) => unitStats(C.finalChallenge, p).complete }
  ];
  const earnedBadges = (p) => BADGES.filter((b) => b.test(p || P())).map((b) => b.id);
  const itemFor = (list, id) => list.find((x) => x.id === id) || list[0];
  const unlocked = (item) => levelInfo(totalXP()).level >= item.level;

  function snapshot() {
    const xp = totalXP();
    return { xp, level: levelInfo(xp).level, badges: earnedBadges(), complete: UNITS.filter((u) => unitStats(u).complete).map((u) => u.id) };
  }

  /* ---------- Server ---------- */
  async function api(method, path, body) {
    const headers = { "content-type": "application/json" };
    if (state.auth && state.auth.token) headers.authorization = "Bearer " + state.auth.token;
    let res;
    try {
      res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
    } catch (e) {
      const err = new Error("Der Server ist nicht erreichbar. Prüfe deine Internetverbindung.");
      err.status = 0; throw err;
    }
    let data = {};
    try { data = await res.json(); } catch (e) { /* leer */ }
    if (!res.ok) {
      const err = new Error(data.error || (res.status === 404 ? "Der Server ist nicht erreichbar (Funktion nicht gefunden)." : "Fehler " + res.status));
      err.status = res.status; throw err;
    }
    return data;
  }
  let syncTimer = null, syncStatus = "local";
  function scheduleSync(delay) {
    if (!state.auth) { syncStatus = "local"; renderSyncLabel(); return; }
    syncStatus = "pending"; renderSyncLabel();
    clearTimeout(syncTimer);
    syncTimer = setTimeout(doSync, delay == null ? 1200 : delay);
  }
  async function doSync() {
    if (!state.auth) return;
    try {
      const r = await api("PUT", "/api/progress", { progress: P() });
      state.progress = mergeProgress(P(), r.progress);
      persist();
      syncStatus = "saved";
    } catch (e) {
      if (e.status === 401) { forcedLogout(); return; }
      syncStatus = "error";
      clearTimeout(syncTimer);
      syncTimer = setTimeout(doSync, 15000);
    }
    renderSyncLabel();
  }
  function forcedLogout() {
    state.auth = null;
    state.progress = emptyProgress();
    persist();
    applyTheme();
    toast("Du wurdest abgemeldet (Sitzung abgelaufen oder von der Lehrkraft geändert). Bitte melde dich erneut an.");
    render();
  }
  async function refreshFromServer() {
    if (!state.auth) return;
    try {
      const r = await api("GET", "/api/me");
      state.auth.className = r.user.className;
      const before = JSON.stringify(P());
      state.progress = mergeProgress(P(), r.user.progress);
      persist();
      if (JSON.stringify(P()) !== before) { applyTheme(); render(); }
      scheduleSync(300);
    } catch (e) {
      if (e.status === 401) forcedLogout();
      else { syncStatus = "error"; renderSyncLabel(); }
    }
  }
  window.addEventListener("online", () => { if (state.auth) scheduleSync(200); });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && state.auth && syncStatus === "pending") { clearTimeout(syncTimer); doSync(); }
  });

  /* ---------- Speichern + Belohnungen ---------- */
  function commit(before, originEl) {
    persist();
    scheduleSync();
    const after = snapshot();
    renderHeader();
    const gained = after.xp - before.xp;
    if (gained > 0) floatXP(gained, originEl);
    after.badges.filter((b) => before.badges.indexOf(b) === -1).forEach((id) => {
      const b = BADGES.find((x) => x.id === id);
      toast(`${b.icon} Neues Abzeichen: ${b.name}`, "gold");
    });
    const newlyComplete = after.complete.filter((u) => before.complete.indexOf(u) === -1);
    newlyComplete.forEach((uid) => {
      const u = UNITS.find((x) => x.id === uid);
      toast(u.isFinal ? "🎓 Abschluss-Challenge geschafft!" : `🎫 Stempel für „${u.title}“ erhalten!`, "gold");
    });
    if (newlyComplete.length || after.level > before.level) confetti();
    if (after.level > before.level) showLevelUp(after.level);
    if (!storageOk && !state.auth) toast("Hinweis: Dein Browser erlaubt kein lokales Speichern. Melde dich an, um deinen Fortschritt zu sichern.");
  }

  /* ---------- Ausgabe: Kopfzeile ---------- */
  function renderHeader() {
    const xp = totalXP(), L = levelInfo(xp), s = P().settings;
    const av = itemFor(G.avatars, s.avatar), pet = itemFor(G.pets, s.pet);
    const box = $("#xpbox");
    box.innerHTML = "";
    box.append(
      h("div", { class: "levelchip", "aria-label": `Level ${L.level}, ${xp} XP` },
        h("div", { class: "lv" }, h("span", { text: `Level ${L.level} – ${L.title}` }), h("span", { text: `${xp} XP` })),
        h("div", { class: "bar", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(L.pct), "aria-label": "Fortschritt bis zum nächsten Level" }, h("span", { style: `width:${L.pct}%` }))
      ),
      h("a", { class: "avatar-btn", href: "#/travelcard", title: "Travelcard öffnen", "aria-label": "Travelcard öffnen" },
        h("span", { text: av.icon }), pet.icon ? h("span", { class: "pet", text: pet.icon }) : null),
      h("span", { class: "sync", id: "syncLabel" })
    );
    renderSyncLabel();
  }
  function renderSyncLabel() {
    const n = $("#syncLabel");
    if (!n) return;
    const map = {
      local: state.auth ? "" : "nur auf diesem Gerät",
      pending: "wird gespeichert …",
      saved: "gespeichert ✓",
      error: "offline – wird später gespeichert"
    };
    n.textContent = map[syncStatus] || "";
    const k = $("#kontoSync");
    if (k) k.textContent = map[syncStatus] || "";
  }
  function applyTheme() {
    const t = P().settings.theme || "auto";
    const theme = G.themes.find((x) => x.id === t) && unlocked(G.themes.find((x) => x.id === t)) ? t : "auto";
    document.documentElement.dataset.theme = theme;
  }

  /* ---------- Toasts, Dialoge, Effekte ---------- */
  function toast(text, kind) {
    const t = h("div", { class: "toast" + (kind ? " " + kind : ""), text });
    $("#toasts").append(t);
    setTimeout(() => t.remove(), 4200);
  }
  function floatXP(n, originEl) {
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    if (originEl && originEl.getBoundingClientRect) { const r = originEl.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top; }
    const f = h("div", { class: "xp-float", text: `+${n} XP`, style: `left:${Math.max(10, x - 30)}px;top:${Math.max(70, y)}px` });
    document.body.append(f);
    setTimeout(() => f.remove(), 1200);
  }
  const dlg = () => $("#dlg");
  function openDialog(content, onClose) {
    const d = dlg();
    d.innerHTML = "";
    d.append(content);
    const done = () => { d.removeEventListener("close", done); if (onClose) onClose(d.returnValue); };
    d.addEventListener("close", done);
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
    const f = $("[data-autofocus]", d) || $("button", d);
    if (f) f.focus();
  }
  function closeDialog(val) { const d = dlg(); if (typeof d.close === "function") d.close(val); else { d.removeAttribute("open"); d.returnValue = val; d.dispatchEvent(new Event("close")); } }
  function confirmDlg(o) {
    return new Promise((resolve) => {
      if (typeof dlg().showModal !== "function") { resolve(window.confirm(o.text)); return; }
      const body = h("div", { class: "dlg-body" },
        o.icon ? h("div", { class: "big", "aria-hidden": "true", text: o.icon }) : null,
        h("h3", { id: "dlg-title", text: o.title }),
        h("p", { text: o.text }),
        h("div", { class: "dlg-actions" },
          h("button", { class: "btn ghost", type: "button", onclick: () => closeDialog("ok") }, o.okLabel || "OK"),
          h("button", { class: "btn primary", type: "button", "data-autofocus": true, onclick: () => closeDialog("cancel") }, o.cancelLabel || "Abbrechen"))
      );
      openDialog(body, (v) => resolve(v === "ok"));
    });
  }
  function showLevelUp(level) {
    const L = G.levels[level - 1];
    const news = [].concat(
      G.avatars.filter((a) => a.level === level).map((a) => `${a.icon} Avatar „${a.name}“`),
      G.pets.filter((a) => a.level === level && a.icon).map((a) => `${a.icon} Begleiter „${a.name}“`),
      G.themes.filter((a) => a.level === level).map((a) => `🎨 Hintergrund „${a.name}“`)
    );
    const body = h("div", { class: "dlg-body" },
      h("div", { class: "big", "aria-hidden": "true", text: "🚆" }),
      h("h3", { id: "dlg-title", text: `Level ${level}: ${L.title}!` }),
      h("p", { text: "Stark – du bist eine Stufe aufgestiegen. Bleib dran!" }),
      news.length ? h("div", {}, h("p", { html: "<b>Neu freigeschaltet:</b>" }), h("ul", {}, news.map((n) => h("li", { text: n })))) : null,
      h("div", { class: "dlg-actions" },
        news.length ? h("button", { class: "btn ghost", type: "button", onclick: () => { closeDialog("go"); location.hash = "#/travelcard"; } }, "Zur Travelcard") : null,
        h("button", { class: "btn primary", type: "button", "data-autofocus": true, onclick: () => closeDialog("ok") }, "Weiter"))
    );
    openDialog(body);
  }
  function confetti() {
    if (reduceMotion()) return;
    const cv = $("#confetti"), ctx = cv.getContext && cv.getContext("2d");
    if (!ctx) return;
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const css = getComputedStyle(document.documentElement);
    const cols = ["--line", "--gold", "--bonus", "--ok"].map((v) => css.getPropertyValue(v).trim() || "#0E8A7E");
    const parts = Array.from({ length: 140 }, () => ({
      x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.4, vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4, r: 4 + Math.random() * 6, a: Math.random() * 6, c: pick(cols)
    }));
    const start = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach((p) => { p.x += p.vx; p.y += p.vy; p.a += 0.1; ctx.fillStyle = p.c; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (t - start < 2200) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
    })(start);
  }

  /* ---------- Router ---------- */
  function route() {
    const hsh = (location.hash || "#/").replace(/^#\/?/, "");
    const parts = hsh.split("/");
    return { name: parts[0] || "map", arg: parts[1] };
  }
  const moduleTab = {};
  function render() {
    const r = route();
    const main = $("#main");
    main.innerHTML = "";
    $$(".mainnav a").forEach((a) => a.removeAttribute("aria-current"));
    const nav = r.name === "m" ? "map" : r.name;
    const cur = $(`.mainnav a[data-nav="${nav}"]`);
    if (cur) cur.setAttribute("aria-current", "page");
    renderHeader();
    if (r.name === "m") {
      const u = UNITS.find((x) => x.id === r.arg);
      if (u) viewModule(main, u); else viewMap(main);
    } else if (r.name === "travelcard") viewTravelcard(main);
    else if (r.name === "konto") viewKonto(main);
    else viewMap(main);
  }
  window.addEventListener("hashchange", () => { const d = $("#dlg"); if (d && d.open) closeDialog("nav"); render(); window.scrollTo(0, 0); const m = $("#main"); if (m) m.focus({ preventScroll: true }); });

  /* ---------- Ansicht: Streckenkarte ---------- */
  function progressRing(done, total) {
    const pct = total ? done / total : 0;
    const c = 2 * Math.PI * 15;
    return `<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="var(--line)" stroke-width="6" stroke-dasharray="${(pct * c).toFixed(1)} ${c.toFixed(1)}"/></svg>`;
  }
  function nextUnit() {
    return C.modules.find((u) => !unitStats(u).complete) || (unitStats(C.finalChallenge).complete ? null : C.finalChallenge);
  }
  function viewMap(main) {
    const xp = totalXP(), L = levelInfo(xp), nu = nextUnit();
    const started = Object.keys(P().ex).length > 0;
    const wrap = h("div", { class: "home" });
    const left = h("div", {});
    left.append(h("section", { class: "hero" },
      h("h1", {}, "The Grammar Line"),
      h("p", { text: "Zwölf Stationen durch die englische Grammatik – von den Zeitformen bis zu den Modalverben. Du begleitest Lena bei ihrem Praktikum in Manchester, wiederholst die Regeln und übst so lange, bis alles sitzt." }),
      h("div", { class: "cta" },
        nu ? h("a", { class: "btn primary", href: `#/m/${nu.id}` }, started ? `Weiter mit: ${nu.title}` : "Bei Station 1 starten") : h("span", { class: "pill gold", text: "Alle Stationen geschafft!" }),
        !state.auth ? h("a", { class: "btn ghost", href: "#/konto" }, "Anmelden und Fortschritt sichern") : null)
    ));
    const list = h("ol", { class: "line-map", "aria-label": "Stationen" });
    UNITS.forEach((u, i) => {
      const st = unitStats(u);
      const li = h("li", { class: "station" + (st.complete ? " done" : "") + (u.isFinal ? " final" : "") });
      const label = u.isFinal ? "★" : String(i + 1);
      const a = h("a", { href: `#/m/${u.id}` });
      a.append(
        h("span", { class: "dot", html: (st.complete ? "" : progressRing(st.done, st.total)) + `<span>${st.complete ? "✓" : label}</span>` }),
        h("span", { class: "name", text: u.title }),
        h("span", { class: "sub", text: u.subtitle }),
        h("span", { class: "meta" },
          h("span", { class: "pill" + (st.complete ? " ok" : ""), text: `${st.done}/${st.total} Aufgaben` }),
          st.bonusTotal ? h("span", { class: "pill bonus", text: `Bonus ${st.bonusDone}/${st.bonusTotal}` }) : null,
          h("span", { class: "pill", text: `${st.xp}/${st.maxXp} XP` }))
      );
      a.setAttribute("aria-label", `Station ${u.isFinal ? "Finale" : i + 1}: ${u.title}, ${st.done} von ${st.total} Aufgaben erledigt`);
      li.append(a);
      list.append(li);
    });
    left.append(list);

    const side = h("aside", { class: "side", "aria-label": "Dein Stand" });
    const s = P().settings, av = itemFor(G.avatars, s.avatar), pet = itemFor(G.pets, s.pet);
    side.append(h("div", { class: "panel" },
      h("div", { class: "row" }, h("span", { style: "font-size:2.4rem;line-height:1", text: av.icon + (pet.icon ? " " + pet.icon : "") }),
        h("div", {}, h("b", { text: state.auth ? state.auth.nick : "Gast" }), h("div", { class: "muted", text: `Level ${L.level} – ${L.title}` }))),
      h("div", { class: "bar", style: "margin:12px 0 6px" }, h("span", { style: `width:${L.pct}%` })),
      h("p", { class: "muted", style: "margin:0;font-size:.92rem", text: L.next ? `Noch ${L.next - xp} XP bis Level ${L.level + 1}.` : "Höchstes Level erreicht – beeindruckend!" })
    ));
    const badges = earnedBadges();
    side.append(h("div", { class: "panel" },
      h("h3", { text: "So funktioniert's" }),
      h("p", { style: "font-size:.95rem", text: "Lies bei jeder Station zuerst die Erklärung und löse dann die Aufgaben. Für richtige Lösungen bekommst du XP, steigst im Level auf und schaltest Avatare, Begleiter und Hintergründe frei. Bonusaufgaben sind etwas kniffliger und bringen extra XP." }),
      h("p", { style: "font-size:.95rem;margin:0", html: `Abzeichen: <b>${badges.length}/${BADGES.length}</b> · <a href="#/travelcard">Travelcard ansehen</a>` })
    ));
    if (!state.auth) side.append(h("div", { class: "panel" },
      h("h3", { text: "Ohne Anmeldung unterwegs" }),
      h("p", { style: "font-size:.95rem", text: "Dein Fortschritt wird nur in diesem Browser gespeichert. Mit einem Konto kannst du auf jedem Gerät weitermachen." }),
      h("a", { class: "btn small", href: "#/konto" }, "Konto anlegen oder anmelden")));
    wrap.append(left, side);
    main.append(wrap);
  }

  /* ---------- Ansicht: Station ---------- */
  function viewModule(main, u) {
    const idx = UNITS.indexOf(u);
    const st = unitStats(u);
    const tab = moduleTab[u.id] || (st.done > 0 || st.bonusDone > 0 ? "ex" : "theory");
    const page = h("div", { class: "read" });
    page.append(h("div", { class: "crumbs" }, h("a", { href: "#/" }, "Streckenkarte")));
    page.append(h("div", { class: "module-head" },
      h("div", { class: "big-dot", "aria-hidden": "true", text: u.isFinal ? "★" : String(idx + 1) }),
      h("div", {}, h("h1", { text: u.title }), h("p", { text: u.subtitle }))));
    page.append(h("div", { class: "scene" },
      h("span", { class: "who", text: u.scene.who + ":" }), h("p", { lang: "en", html: u.scene.text })));
    const prog = h("div", { class: "progress-line", id: "modProgress" });
    page.append(prog);
    const tabs = h("div", { class: "tabs", role: "tablist" });
    const bTheory = h("button", { role: "tab", type: "button", id: "tab-theory", "aria-controls": "panel-theory" }, "Erklärung");
    const bEx = h("button", { role: "tab", type: "button", id: "tab-ex", "aria-controls": "panel-ex" }, "Übungen");
    tabs.append(bTheory, bEx);
    page.append(tabs);
    const pTheory = h("section", { class: "theory", id: "panel-theory", role: "tabpanel", "aria-labelledby": "tab-theory", html: wrapTables(u.theory) });
    pTheory.append(h("div", { class: "row", style: "margin-top:24px" }, h("button", { class: "btn primary", type: "button", onclick: () => { select("ex"); window.scrollTo({ top: tabs.offsetTop - 80, behavior: reduceMotion() ? "auto" : "smooth" }); } }, "Zu den Übungen")));
    const pEx = h("section", { id: "panel-ex", role: "tabpanel", "aria-labelledby": "tab-ex" });
    u.exercises.forEach((e, i) => pEx.append(renderExercise(e, i, u)));
    const next = UNITS[idx + 1], prev = UNITS[idx - 1];
    pEx.append(h("div", { class: "row", style: "justify-content:space-between;margin-top:10px" },
      prev ? h("a", { class: "btn ghost", href: `#/m/${prev.id}` }, "Vorherige Station") : h("span"),
      next ? h("a", { class: "btn primary", href: `#/m/${next.id}` }, `Nächste Station: ${next.title}`) : h("a", { class: "btn primary", href: "#/travelcard" }, "Zur Travelcard")));
    page.append(pTheory, pEx);
    main.append(page);
    function select(which) {
      moduleTab[u.id] = which;
      bTheory.setAttribute("aria-selected", which === "theory" ? "true" : "false");
      bEx.setAttribute("aria-selected", which === "ex" ? "true" : "false");
      pTheory.hidden = which !== "theory";
      pEx.hidden = which !== "ex";
    }
    bTheory.onclick = () => select("theory");
    bEx.onclick = () => select("ex");
    tabs.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") { const n = moduleTab[u.id] === "ex" ? "theory" : "ex"; select(n); (n === "ex" ? bEx : bTheory).focus(); }
    });
    select(tab);
    refreshModuleMeta(u);
  }
  function wrapTables(html) { return html.replace(/<table/g, '<div class="table-wrap"><table').replace(/<\/table>/g, "</table></div>"); }
  function refreshModuleMeta(u) {
    const st = unitStats(u);
    const prog = $("#modProgress");
    if (prog) {
      prog.innerHTML = "";
      prog.append(h("div", { class: "bar", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(st.total), "aria-valuenow": String(st.done), "aria-label": "Erledigte Aufgaben" }, h("span", { style: `width:${Math.round((st.done / st.total) * 100)}%` })),
        h("span", { text: `${st.done}/${st.total} Aufgaben` + (st.bonusTotal ? ` · Bonus ${st.bonusDone}/${st.bonusTotal}` : "") }));
    }
    const t = $("#tab-ex");
    if (t) t.textContent = `Übungen (${st.done + st.bonusDone}/${st.total + st.bonusTotal})`;
  }

  /* ---------- Aufgabenkarte ---------- */
  const PRAISE = ["Stark gelöst!", "Genau so!", "Sauber – alles richtig!", "Perfekt!", "Das sitzt!", "Excellent work!", "Well done!"];
  const NUDGE = ["Fast geschafft!", "Guter Ansatz!", "Du bist nah dran!", "Noch ein kleiner Schritt!"];
  function renderExercise(ex, i, u) {
    const r = rec(ex.id);
    const card = h("article", { class: "ex-card" + (ex.bonus ? " bonus" : "") + (r && r.done ? " is-done" : ""), id: "ex-" + ex.id, "aria-labelledby": "h-" + ex.id });
    const status = h("span", { class: "pill ok", hidden: !(r && r.done) }, "✓ erledigt");
    card.append(h("div", { class: "ex-head" },
      h("h3", { id: "h-" + ex.id, text: `${ex.bonus ? "Bonus" : "Aufgabe " + (i + 1)}: ${ex.title.replace(/^Bonus: /, "")}` }),
      h("div", { class: "ex-tags" }, h("span", { class: "pill gold", text: `+${ex.xp} XP` }), status)));
    card.append(h("p", { class: "instr", text: ex.prompt }));
    const body = h("div", { class: "ex-body" });
    card.append(body);
    const fb = h("div", { class: "ex-feedback", "aria-live": "polite" });
    const hintBox = h("div", { class: "hintbox", hidden: true, html: "<b>Tipp:</b> " + esc(ex.hint || "") });
    const solBox = h("div", { class: "solution", hidden: true });
    const setDone = () => { card.classList.add("is-done"); status.hidden = false; refreshModuleMeta(u); };

    if (ex.type === "free") {
      buildFree(ex, body, fb, solBox, setDone, card);
      card.append(fb, solBox);
      return card;
    }
    const ctl = TYPES[ex.type](ex, body);
    const bCheck = h("button", { class: "btn primary", type: "button" }, "Prüfen");
    const bHint = ex.hint ? h("button", { class: "btn ghost", type: "button" }, "Tipp") : null;
    const bSol = h("button", { class: "btn ghost", type: "button" }, "Lösung anzeigen");
    const bReset = h("button", { class: "btn ghost", type: "button" }, "Neu versuchen");
    card.append(h("div", { class: "ex-actions" }, bCheck, bHint, bSol, bReset), hintBox, fb, solBox);

    bCheck.onclick = () => {
      const res = ctl.check();
      if (res.incomplete) { fb.className = "ex-feedback bad"; fb.textContent = res.incomplete; return; }
      const before = snapshot();
      const wasDone = !!(rec(ex.id) && rec(ex.id).done);
      const R = touch(ex.id);
      R.att = (R.att || 0) + 1;
      if (res.ok) {
        if (!wasDone) {
          R.done = true;
          R.xp = R.sol ? 0 : ex.xp;
          if (R.att === 1 && !R.sol) { P().streak = (P().streak || 0) + 1; P().bestStreak = Math.max(P().bestStreak || 0, P().streak); }
        }
        const pet = itemFor(G.pets, P().settings.pet);
        fb.className = "ex-feedback good";
        fb.innerHTML = `<b>${pick(PRAISE)}</b> ` + (wasDone ? "Du hast die Aufgabe noch einmal geübt." : (R.xp > 0 ? `Du bekommst ${R.xp} XP.` : "Aufgabe abgeschlossen – beim nächsten Mal schaffst du es ganz ohne Lösung.")) +
          (ex.note ? `<br><span class="muted">${esc(ex.note)}</span>` : "") +
          (pet.icon && !wasDone ? `<span class="petline">${pet.icon} ${esc(pet.line)}</span>` : "");
        if (!wasDone) setDone();
      } else {
        if (!wasDone) P().streak = 0;
        fb.className = "ex-feedback bad";
        fb.innerHTML = `<b>${pick(NUDGE)}</b> ${res.right} von ${res.total} richtig. Die markierten Stellen kannst du direkt verbessern und noch einmal prüfen.` + (ex.hint && hintBox.hidden ? " Ein Tipp hilft dir vielleicht weiter." : "");
      }
      commit(before, bCheck);
    };
    if (bHint) bHint.onclick = () => { hintBox.hidden = !hintBox.hidden; };
    bSol.onclick = async () => {
      const r2 = rec(ex.id);
      const done = r2 && r2.done;
      const ok = await confirmDlg({
        icon: "🤔", title: "Lösung anzeigen?",
        text: done ? "Möchtest du es noch einmal selbst versuchen, bevor du die Lösung ansiehst?" :
          "Möchtest du es noch einmal selbst versuchen? Wenn du dir jetzt die Lösung ansiehst, gibt es für diese Aufgabe keine XP mehr. Abschließen kannst du sie trotzdem: Trage die richtigen Antworten ein und prüfe.",
        okLabel: "Lösung zeigen", cancelLabel: "Ich versuche es noch einmal"
      });
      if (!ok) return;
      if (!done) { const before = snapshot(); const R = touch(ex.id); R.sol = true; P().streak = 0; commit(before); }
      solBox.hidden = false;
      solBox.innerHTML = "<h4>Lösung</h4>" + ctl.solution() + (ex.note ? `<p class="muted" style="margin:8px 0 0">${esc(ex.note)}</p>` : "");
      solBox.scrollIntoView({ block: "nearest", behavior: reduceMotion() ? "auto" : "smooth" });
    };
    bReset.onclick = () => { ctl.reset(); fb.className = "ex-feedback"; fb.textContent = ""; solBox.hidden = true; };
    return card;
  }

  /* ---------- Freitext mit Selbstkontrolle ---------- */
  function buildFree(ex, body, fb, solBox, setDone, card) {
    const r = rec(ex.id);
    const ta = h("textarea", { "aria-label": "Deine Antwort", placeholder: "Schreibe deine Antwort hier …", spellcheck: "true", lang: "en" });
    ta.value = (r && r.ans) || "";
    const count = h("div", { class: "count" });
    const upd = () => { const w = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0; count.textContent = `${w} Wörter`; };
    upd();
    let saveT;
    ta.addEventListener("input", () => {
      upd();
      clearTimeout(saveT);
      saveT = setTimeout(() => { const before = snapshot(); const R = touch(ex.id); R.ans = ta.value.slice(0, 3000); commit(before); }, 800);
    });
    body.append(h("div", { class: "free" }, ta, count));
    const bShow = h("button", { class: "btn primary", type: "button" }, "Musterlösung anzeigen");
    const actions = h("div", { class: "ex-actions" }, bShow);
    card.append(actions);
    bShow.onclick = async () => {
      const text = ta.value.trim();
      const ok = await confirmDlg({
        icon: text ? "📝" : "✏️",
        title: "Musterlösung anzeigen?",
        text: text.length < 20 ? "Du hast noch kaum etwas geschrieben. Möchtest du es zuerst selbst versuchen? Du lernst am meisten, wenn du deine eigene Antwort mit der Musterlösung vergleichst." :
          "Möchtest du deine Antwort noch einmal überarbeiten, bevor du sie mit der Musterlösung vergleichst?",
        okLabel: "Musterlösung zeigen", cancelLabel: "Ich schreibe noch weiter"
      });
      if (!ok) return;
      showModel();
    };
    function showModel() {
      solBox.hidden = false;
      solBox.innerHTML = "";
      solBox.append(h("h4", { text: "Musterlösung" }), h("div", { class: "model", lang: "en", html: ex.model }),
        h("p", { style: "margin:14px 0 4px", html: "<b>Vergleiche selbst:</b> Deine Antwort darf ganz anders formuliert sein. Wichtig ist, ob sie diese Punkte erfüllt:" }));
      const ul = h("ul", { class: "criteria" });
      (ex.criteria || []).forEach((c, k) => {
        const id = `${ex.id}-c${k}`;
        ul.append(h("li", {}, h("input", { type: "checkbox", id }), h("label", { for: id, text: c })));
      });
      solBox.append(ul);
      const done = rec(ex.id) && rec(ex.id).done;
      const bMark = h("button", { class: "btn line", type: "button" }, done ? "Erledigt ✓" : "Meine Antwort passt – als erledigt markieren");
      const bRevise = h("button", { class: "btn ghost", type: "button" }, "Ich überarbeite meine Antwort");
      if (done) bMark.disabled = true;
      solBox.append(h("div", { class: "ex-actions" }, bMark, bRevise));
      bRevise.onclick = () => { ta.focus(); fb.className = "ex-feedback"; fb.textContent = "Überarbeite deine Antwort in Ruhe und vergleiche danach noch einmal."; };
      bMark.onclick = () => {
        if (ta.value.trim().length < 20) { fb.className = "ex-feedback bad"; fb.textContent = "Schreibe zuerst deine eigene Antwort (mindestens ein paar Sätze), bevor du sie als erledigt markierst."; ta.focus(); return; }
        const before = snapshot();
        const R = touch(ex.id);
        R.ans = ta.value.slice(0, 3000);
        if (!R.done) { R.done = true; R.xp = ex.xp; R.att = (R.att || 0) + 1; }
        fb.className = "ex-feedback good";
        const pet = itemFor(G.pets, P().settings.pet);
        fb.innerHTML = `<b>${pick(PRAISE)}</b> Deine Selbstkontrolle zählt – du bekommst ${ex.xp} XP.` + (pet.icon ? `<span class="petline">${pet.icon} ${esc(pet.line)}</span>` : "");
        bMark.disabled = true; bMark.textContent = "Erledigt ✓";
        setDone();
        commit(before, bMark);
      };
      solBox.scrollIntoView({ block: "nearest", behavior: reduceMotion() ? "auto" : "smooth" });
    }
  }

  /* ---------- Aufgabentypen ---------- */
  const TYPES = {};
  const uid = (() => { let n = 0; return (p) => `${p}-${++n}`; })();
  const listSolution = (arr) => "<ol>" + arr.map((x) => `<li>${x}</li>`).join("") + "</ol>";
  const capFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const alsoOk = (answers) => answers.length > 1 ? ` <span class="muted">(auch richtig: ${answers.slice(1, 4).map(esc).join(" / ")})</span>` : "";

  TYPES.mc = (ex, body) => {
    const groups = ex.items.map((it, i) => {
      const name = uid(ex.id + "-q" + i);
      const wrap = h("fieldset", { class: "mc-item", style: "border:0;padding:0;margin:0 0 16px" });
      wrap.append(h("legend", { class: "q", lang: "en", text: it.q }));
      const opts = h("div", { class: "opts" });
      const labels = it.o.map((o, k) => {
        const inp = h("input", { type: "radio", name, value: String(k) });
        const lab = h("label", { class: "opt" }, inp, h("span", { lang: "en", text: o }));
        inp.addEventListener("change", () => labels.forEach((l) => l.classList.remove("right", "wrong")));
        opts.append(lab);
        return lab;
      });
      const expl = h("div", { class: "explain", hidden: true, text: it.e || "" });
      wrap.append(opts, expl);
      body.append(wrap);
      return { it, labels, expl };
    });
    return {
      check() {
        let right = 0, missing = 0;
        groups.forEach((g) => {
          g.labels.forEach((l) => l.classList.remove("right", "wrong"));
          const sel = g.labels.findIndex((l) => $("input", l).checked);
          if (sel < 0) { missing++; return; }
          if (sel === g.it.a) { right++; g.labels[sel].classList.add("right"); if (g.it.e) g.expl.hidden = false; }
          else { g.labels[sel].classList.add("wrong"); g.expl.hidden = true; }
        });
        if (missing) return { incomplete: `Beantworte bitte zuerst alle Fragen (${missing} fehlen noch).` };
        return { ok: right === groups.length, right, total: groups.length };
      },
      solution() {
        groups.forEach((g) => { g.labels[g.it.a].classList.add("right"); if (g.it.e) g.expl.hidden = false; });
        return listSolution(groups.map((g) => {
          const ans = `<b>${esc(g.it.o[g.it.a])}</b>`;
          const q = g.it.q.indexOf("___") !== -1 ? esc(g.it.q).replace("___", ans) : `${esc(g.it.q)} → ${ans}`;
          return `<span lang="en">${q}</span>` + (g.it.e ? `<div class="explain">${esc(g.it.e)}</div>` : "");
        }));
      },
      reset() { groups.forEach((g) => { g.labels.forEach((l) => { l.classList.remove("right", "wrong"); $("input", l).checked = false; }); g.expl.hidden = true; }); }
    };
  };

  TYPES.tf = (ex, body) => {
    const labels = ex.labels || ["richtig", "falsch"];
    const rows = ex.items.map((it) => {
      const row = h("div", { class: "tf-item" });
      const seg = h("div", { class: "seg", role: "group", "aria-label": it[0] });
      let val = null;
      const btns = [true, false].map((v, k) => {
        const b = h("button", { type: "button", "aria-pressed": "false" }, labels[k]);
        b.onclick = () => { val = v; btns.forEach((x, j) => x.setAttribute("aria-pressed", j === k ? "true" : "false")); row.classList.remove("right", "wrong"); };
        seg.append(b);
        return b;
      });
      const expl = h("div", { class: "explain", hidden: true, text: it[2] || "" });
      row.append(h("div", { class: "s", lang: "en", text: it[0] }), seg, expl);
      body.append(row);
      return { it, row, btns, expl, get: () => val, set: (v) => { val = v; } };
    });
    return {
      check() {
        if (rows.some((r) => r.get() === null)) return { incomplete: "Entscheide dich bitte bei jeder Aussage." };
        let right = 0;
        rows.forEach((r) => { const ok = r.get() === r.it[1]; if (ok) right++; r.row.classList.toggle("right", ok); r.row.classList.toggle("wrong", !ok); r.expl.hidden = !(ok && r.it[2]); });
        return { ok: right === rows.length, right, total: rows.length };
      },
      solution() {
        rows.forEach((r) => { r.expl.hidden = !r.it[2]; });
        return listSolution(rows.map((r) => `<span lang="en">${esc(r.it[0])}</span> → <b>${r.it[1] ? labels[0] : labels[1]}</b>` + (r.it[2] ? `<div class="explain">${esc(r.it[2])}</div>` : "")));
      },
      reset() { rows.forEach((r) => { r.set(null); r.btns.forEach((b) => b.setAttribute("aria-pressed", "false")); r.row.classList.remove("right", "wrong"); r.expl.hidden = true; }); }
    };
  };

  function dataTable(t) {
    return `<div class="table-wrap data-table"><table class="gram"><thead><tr>${t.head.map((x) => `<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  TYPES.gap = (ex, body) => {
    if (ex.table) body.insertAdjacentHTML("beforeend", dataTable(ex.table));
    const p = h("p", { class: "gaptext", lang: "en" });
    const inputs = [];
    ex.text.split(/(\{\d+\}|\n)/).forEach((part) => {
      const m = part.match(/^\{(\d+)\}$/);
      if (part === "\n") { p.append(h("br")); return; }
      if (!m) { if (part) p.append(document.createTextNode(part)); return; }
      const k = +m[1];
      const longest = Math.max.apply(null, ex.gaps[k].map((a) => a.length));
      const inp = h("input", { type: "text", autocomplete: "off", autocapitalize: "none", autocorrect: "off", spellcheck: "false", "aria-label": `Lücke ${k + 1}`, style: `width:${Math.min(22, Math.max(6, longest + 2))}ch` });
      inp.addEventListener("input", () => inp.classList.remove("right", "wrong"));
      inputs[k] = inp;
      p.append(h("span", { class: "gapno", "aria-hidden": "true", text: String(k + 1) }), inp);
    });
    body.append(p);
    return {
      check() {
        if (inputs.some((i) => !i.value.trim())) return { incomplete: "Fülle bitte zuerst alle Lücken aus." };
        let right = 0;
        inputs.forEach((inp, k) => { const ok = CK.matches(inp.value, ex.gaps[k]); if (ok) right++; inp.classList.toggle("right", ok); inp.classList.toggle("wrong", !ok); });
        return { ok: right === inputs.length, right, total: inputs.length };
      },
      solution() { return listSolution(ex.gaps.map((g) => `<b lang="en">${esc(g[0])}</b>${alsoOk(g)}`)); },
      reset() { inputs.forEach((i) => { i.value = ""; i.classList.remove("right", "wrong"); }); }
    };
  };

  TYPES.choice = (ex, body) => {
    const p = h("p", { class: "gaptext", lang: "en" });
    const sels = [];
    ex.text.split(/(\[\[[^\]]+\]\]|\n)/).forEach((part) => {
      if (part === "\n") { p.append(h("br")); return; }
      const m = part.match(/^\[\[([^\]]+)\]\]$/);
      if (!m) { if (part) p.append(document.createTextNode(part)); return; }
      const opts = m[1].split("|");
      const correct = opts.findIndex((o) => o.endsWith("*"));
      const clean = opts.map((o) => o.replace(/\*$/, ""));
      const sel = h("select", { "aria-label": `Auswahl ${sels.length + 1}` }, h("option", { value: "" }, "…"), clean.map((o, k) => h("option", { value: String(k) }, o)));
      sel.addEventListener("change", () => sel.classList.remove("right", "wrong"));
      sels.push({ sel, correct, clean });
      p.append(h("span", { class: "gapno", "aria-hidden": "true", text: String(sels.length) }), sel);
    });
    body.append(p);
    return {
      check() {
        if (sels.some((s) => s.sel.value === "")) return { incomplete: "Wähle bitte bei jeder Lücke eine Form aus." };
        let right = 0;
        sels.forEach((s) => { const ok = +s.sel.value === s.correct; if (ok) right++; s.sel.classList.toggle("right", ok); s.sel.classList.toggle("wrong", !ok); });
        return { ok: right === sels.length, right, total: sels.length };
      },
      solution() { return listSolution(sels.map((s) => `<b lang="en">${esc(s.clean[s.correct])}</b>`)); },
      reset() { sels.forEach((s) => { s.sel.value = ""; s.sel.classList.remove("right", "wrong"); }); }
    };
  };

  TYPES.match = (ex, body) => {
    const rights = shuffle(Array.from(new Set(ex.pairs.map((p) => p[1]))));
    const rows = ex.pairs.map((pair, i) => {
      const sel = h("select", { "aria-label": `Zuordnung für: ${pair[0]}` }, h("option", { value: "" }, "– wählen –"), rights.map((r) => h("option", { value: r }, r)));
      const row = h("div", { class: "match-item" }, h("div", { class: "l", lang: "en", text: pair[0] }), sel);
      sel.addEventListener("change", () => row.classList.remove("right", "wrong"));
      body.append(row);
      return { pair, sel, row };
    });
    return {
      check() {
        if (rows.some((r) => !r.sel.value)) return { incomplete: "Ordne bitte zuerst alles zu." };
        let right = 0;
        rows.forEach((r) => { const ok = r.sel.value === r.pair[1]; if (ok) right++; r.row.classList.toggle("right", ok); r.row.classList.toggle("wrong", !ok); });
        return { ok: right === rows.length, right, total: rows.length };
      },
      solution() { return listSolution(rows.map((r) => `<span lang="en">${esc(r.pair[0])}</span> → <b>${esc(r.pair[1])}</b>`)); },
      reset() { rows.forEach((r) => { r.sel.value = ""; r.row.classList.remove("right", "wrong"); }); }
    };
  };

  TYPES.categorize = (ex, body) => {
    body.append(h("p", { class: "helper", text: "Tippe ein Kärtchen an und dann die passende Spalte. Am Computer kannst du die Kärtchen auch ziehen. Ein zweiter Tipp auf ein Kärtchen hebt die Auswahl auf." }));
    const pool = h("div", { class: "pool", "aria-label": "Noch nicht zugeordnet" });
    let selected = null;
    const chips = shuffle(ex.items).map((it) => {
      const c = h("button", { type: "button", class: "chip", draggable: "true", "aria-pressed": "false", lang: "en", text: it[0] });
      c._cat = it[1];
      c.addEventListener("click", (e) => { e.stopPropagation(); selectChip(selected === c ? null : c); });
      c.addEventListener("dragstart", (e) => { selectChip(c); try { e.dataTransfer.setData("text/plain", it[0]); e.dataTransfer.effectAllowed = "move"; } catch (err) { /* */ } });
      pool.append(c);
      return c;
    });
    function selectChip(c) {
      selected = c;
      chips.forEach((x) => x.setAttribute("aria-pressed", x === c ? "true" : "false"));
      buckets.forEach((b) => b.el.classList.toggle("target", !!c));
    }
    function moveTo(target) {
      if (!selected) return;
      selected.classList.remove("right", "wrong");
      target.append(selected);
      selectChip(null);
    }
    const bucketsWrap = h("div", { class: "buckets" });
    const buckets = ex.categories.map((cat) => {
      const items = h("div", { class: "bucket-items" });
      const head = h("button", { type: "button", class: "bucket-head" }, h("h4", { text: cat }));
      head.style.cssText = "all:unset;display:block;width:100%;cursor:pointer";
      head.firstChild.style.cssText = "padding:10px 12px;border-bottom:1px solid var(--border);margin:0";
      head.setAttribute("aria-label", `Ausgewähltes Kärtchen in „${cat}“ ablegen`);
      const el = h("div", { class: "bucket" }, head, items);
      el.addEventListener("click", () => moveTo(items));
      el.addEventListener("dragover", (e) => { e.preventDefault(); el.classList.add("dragover"); });
      el.addEventListener("dragleave", () => el.classList.remove("dragover"));
      el.addEventListener("drop", (e) => { e.preventDefault(); el.classList.remove("dragover"); moveTo(items); });
      bucketsWrap.append(el);
      return { el, items, cat };
    });
    pool.addEventListener("click", () => moveTo(pool));
    pool.addEventListener("dragover", (e) => e.preventDefault());
    pool.addEventListener("drop", (e) => { e.preventDefault(); moveTo(pool); });
    body.append(pool, bucketsWrap);
    return {
      check() {
        if (pool.children.length) return { incomplete: "Ordne bitte zuerst alle Kärtchen einer Spalte zu." };
        let right = 0;
        buckets.forEach((b, k) => Array.from(b.items.children).forEach((c) => { const ok = c._cat === k; if (ok) right++; c.classList.toggle("right", ok); c.classList.toggle("wrong", !ok); }));
        return { ok: right === chips.length, right, total: chips.length };
      },
      solution() {
        return ex.categories.map((cat, k) => `<p style="margin:0 0 8px"><b>${esc(cat)}:</b> <span lang="en">${ex.items.filter((i) => i[1] === k).map((i) => esc(i[0])).join(", ")}</span></p>`).join("");
      },
      reset() { chips.forEach((c) => { c.classList.remove("right", "wrong"); pool.append(c); }); selectChip(null); }
    };
  };

  TYPES.order = (ex, body) => {
    const rows = ex.items.map((it, n) => {
      const words = it.words.split(" ");
      let order = shuffle(words.map((w, i) => i));
      let guard = 0;
      while (order.every((v, i) => v === i) && guard++ < 10) order = shuffle(order);
      const ans = h("div", { class: "order-answer", "aria-label": `Dein Satz ${n + 1}`, lang: "en" });
      const pool = h("div", { class: "order-pool", lang: "en" });
      const chips = order.map((i) => {
        const c = h("button", { type: "button", class: "chip", text: words[i] });
        c.onclick = () => { ans.classList.remove("right", "wrong"); (c.parentNode === pool ? ans : pool).append(c); };
        pool.append(c);
        return c;
      });
      body.append(h("div", { class: "order-item" }, ans, pool));
      return { it, ans, pool, chips };
    });
    return {
      check() {
        if (rows.some((r) => r.pool.children.length)) return { incomplete: "Verwende bitte alle Wörter." };
        let right = 0;
        rows.forEach((r) => {
          const text = Array.from(r.ans.children).map((c) => c.textContent).join(" ");
          const ok = CK.matches(text, r.it.a);
          if (ok) right++;
          r.ans.classList.toggle("right", ok); r.ans.classList.toggle("wrong", !ok);
        });
        return { ok: right === rows.length, right, total: rows.length };
      },
      solution() { return listSolution(rows.map((r) => `<b lang="en">${esc(capFirst(r.it.a[0]))}${/\b(what|where|when|did|do|does|had|have|is|are|was|were)\b/i.test(r.it.a[0].split(" ")[0]) ? "?" : "."}</b>` + (r.it.a.length > 1 ? ` <span class="muted">(auch richtig: ${esc(r.it.a[1])})</span>` : ""))); },
      reset() { rows.forEach((r) => { r.chips.forEach((c) => r.pool.append(c)); r.ans.classList.remove("right", "wrong"); }); }
    };
  };

  TYPES.transform = (ex, body) => {
    const rows = ex.items.map((it, n) => {
      const id = uid(ex.id + "-t");
      const inp = h("input", { type: "text", id, autocomplete: "off", autocapitalize: "sentences", autocorrect: "off", spellcheck: "false", lang: "en", placeholder: "Deine Antwort" });
      inp.addEventListener("input", () => inp.classList.remove("right", "wrong"));
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { const nx = rows[n + 1]; if (nx) nx.inp.focus(); } });
      body.append(h("div", { class: "tr-item" }, h("label", { for: id, text: `${n + 1}. ${it.q}` }), inp));
      return { it, inp };
    });
    return {
      check() {
        if (rows.some((r) => !r.inp.value.trim())) return { incomplete: "Bearbeite bitte zuerst alle Sätze." };
        let right = 0;
        rows.forEach((r) => { const ok = CK.matches(r.inp.value, r.it.a); if (ok) right++; r.inp.classList.toggle("right", ok); r.inp.classList.toggle("wrong", !ok); });
        return { ok: right === rows.length, right, total: rows.length };
      },
      solution() { return listSolution(rows.map((r) => `<b lang="en">${esc(r.it.a[0])}</b>${alsoOk(r.it.a)}`)); },
      reset() { rows.forEach((r) => { r.inp.value = ""; r.inp.classList.remove("right", "wrong"); }); }
    };
  };

  /* ---------- Ansicht: Travelcard ---------- */
  const THEME_SWATCH = {
    auto: "linear-gradient(135deg,#F3F6FA 50%,#0F1626 50%)", day: "linear-gradient(135deg,#F3F6FA 60%,#0E8A7E 60%)",
    night: "linear-gradient(135deg,#0F1626 60%,#2BC2AE 60%)", seaside: "linear-gradient(135deg,#E6F2FA 60%,#1467B8 60%)",
    highlands: "linear-gradient(135deg,#EFF0E8 60%,#6A4A97 60%)", neon: "linear-gradient(135deg,#120B24 60%,#FF3EA5 60%)",
    royal: "linear-gradient(135deg,#1A1030 60%,#D4AF37 60%)"
  };
  function viewTravelcard(main) {
    const p = P(), xp = totalXP(), L = levelInfo(xp), s = p.settings;
    const av = itemFor(G.avatars, s.avatar), pet = itemFor(G.pets, s.pet);
    const page = h("div", {});
    page.append(h("div", { class: "page-head" },
      h("h1", {}, "Travelcard"),
      h("p", { text: "Hier siehst du deinen Stand, deine Stempel und Abzeichen. Mit jedem Level schaltest du neue Avatare, Begleiter und Hintergründe frei." })));
    const done = allExercises().filter((e) => p.ex[e.id] && p.ex[e.id].done).length;
    page.append(h("div", { class: "panel" },
      h("div", { class: "row", style: "gap:16px" },
        h("span", { style: "font-size:3.4rem;line-height:1", text: av.icon + (pet.icon ? " " + pet.icon : "") }),
        h("div", {}, h("h2", { style: "margin:0", text: state.auth ? state.auth.nick : "Gast" }),
          h("div", { class: "muted", text: `Level ${L.level} – ${L.title}` + (state.auth && state.auth.className ? ` · Klasse ${state.auth.className}` : "") }))),
      h("div", { class: "bar", style: "margin:14px 0 14px;height:12px" }, h("span", { style: `width:${L.pct}%` })),
      h("div", { class: "stats" },
        h("div", { class: "stat" }, h("b", { text: String(xp) }), "XP"),
        h("div", { class: "stat" }, h("b", { text: `${done}/${allExercises().length}` }), "Aufgaben"),
        h("div", { class: "stat" }, h("b", { text: `${C.modules.filter((u) => unitStats(u).complete).length}/${C.modules.length}` }), "Stationen"),
        h("div", { class: "stat" }, h("b", { text: String(p.bestStreak || 0) }), "beste Serie"))));

    const setSetting = (k, v) => { const before = snapshot(); p.settings[k] = v; p.settings.t = Date.now(); p.updated = Date.now(); applyTheme(); commit(before); render(); };
    const pickGrid = (title, list, key, renderIcon) => {
      const grid = h("div", { class: "card-grid" });
      list.forEach((it) => {
        const ok = unlocked(it);
        const b = h("button", { type: "button", class: "pick", "aria-pressed": s[key] === it.id ? "true" : "false", disabled: !ok },
          renderIcon(it), h("span", { class: "nm", text: it.name }), h("span", { class: "lk", text: ok ? (it.note || (s[key] === it.id ? "ausgewählt" : "")) : `🔒 ab Level ${it.level}` }));
        b.onclick = () => setSetting(key, it.id);
        grid.append(b);
      });
      return h("section", { class: "section" }, h("h2", { text: title }), grid);
    };
    page.append(pickGrid("Avatar", G.avatars, "avatar", (it) => h("span", { class: "ic", text: it.icon })));
    page.append(pickGrid("Begleiter", G.pets, "pet", (it) => h("span", { class: "ic", text: it.icon || "–" })));
    page.append(pickGrid("Hintergrund", G.themes, "theme", (it) => h("span", { class: "swatch", style: `background:${THEME_SWATCH[it.id]}` })));

    const stamps = h("div", { class: "stamps" });
    UNITS.forEach((u, i) => {
      const st = unitStats(u);
      stamps.append(h("div", { class: "stamp" + (st.complete ? " earned" : "") },
        h("span", { class: "ic", text: u.isFinal ? "🎓" : "🎫" }), h("span", { class: "nm", text: u.isFinal ? "Final stop" : `${i + 1}. ${u.title}` }),
        h("span", { class: "ds", text: st.complete ? "abgestempelt" : `${st.done}/${st.total} erledigt` })));
    });
    page.append(h("section", { class: "section" }, h("h2", { text: "Stempel" }), stamps));
    const earned = earnedBadges();
    const bgrid = h("div", { class: "stamps" });
    BADGES.forEach((b) => bgrid.append(h("div", { class: "stamp" + (earned.indexOf(b.id) !== -1 ? " earned" : "") },
      h("span", { class: "ic", text: b.icon }), h("span", { class: "nm", text: b.name }), h("span", { class: "ds", text: b.desc }))));
    page.append(h("section", { class: "section" }, h("h2", { text: "Abzeichen" }), bgrid));
    main.append(page);
  }

  /* ---------- Ansicht: Konto ---------- */
  let kontoMode = "login";
  function viewKonto(main) {
    const page = h("div", { class: "read" });
    page.append(h("div", { class: "page-head" }, h("h1", {}, "Konto"),
      h("p", { text: "Du kannst den Kurs ohne Anmeldung nutzen. Mit einem Konto wird dein Fortschritt auf dem Server gespeichert – so kannst du am Handy, zu Hause und in der Schule weitermachen, und deine Lehrkraft sieht deinen Lernstand." })));
    if (state.auth) {
      const msg = h("div", { class: "msg", hidden: true });
      const oldPw = h("input", { type: "password", autocomplete: "current-password", required: true });
      const newPw = h("input", { type: "password", autocomplete: "new-password", minlength: "6", required: true });
      const pwForm = h("form", { class: "form" },
        h("label", {}, "Bisheriges Passwort", oldPw),
        h("label", {}, "Neues Passwort", newPw, h("span", { class: "note", text: "mindestens 6 Zeichen" })),
        h("div", {}, h("button", { class: "btn", type: "submit" }, "Passwort ändern")));
      pwForm.onsubmit = async (e) => {
        e.preventDefault();
        try {
          const r = await api("POST", "/api/password", { oldPassword: oldPw.value, newPassword: newPw.value });
          state.auth.token = r.token; persist();
          msg.hidden = false; msg.className = "msg ok"; msg.textContent = "Dein Passwort wurde geändert.";
          oldPw.value = ""; newPw.value = "";
        } catch (err) { msg.hidden = false; msg.className = "msg err"; msg.textContent = err.message; }
      };
      page.append(h("div", { class: "panel" },
        h("h2", { text: `Angemeldet als ${state.auth.nick}` }),
        h("p", {}, `Klasse: ${state.auth.className || "–"} · Speicherstatus: `, h("span", { id: "kontoSync" })),
        h("div", { class: "row" },
          h("button", { class: "btn", type: "button", onclick: () => doSync() }, "Jetzt speichern"),
          h("button", { class: "btn danger", type: "button", onclick: logout }, "Abmelden"))));
      page.append(h("section", { class: "section" }, h("h2", { text: "Passwort ändern" }), msg, pwForm));
      main.append(page);
      renderSyncLabel();
      return;
    }
    const sw = h("div", { class: "switcher", role: "tablist" });
    const bL = h("button", { type: "button", role: "tab", "aria-selected": kontoMode === "login" ? "true" : "false" }, "Anmelden");
    const bR = h("button", { type: "button", role: "tab", "aria-selected": kontoMode === "register" ? "true" : "false" }, "Konto anlegen");
    bL.onclick = () => { kontoMode = "login"; render(); };
    bR.onclick = () => { kontoMode = "register"; render(); };
    sw.append(bL, bR);
    page.append(sw);
    const msg = h("div", { class: "msg err", hidden: true, role: "alert" });
    const nick = h("input", { type: "text", autocomplete: "username", autocapitalize: "none", spellcheck: "false", required: true, maxlength: "20" });
    const pw = h("input", { type: "password", autocomplete: kontoMode === "login" ? "current-password" : "new-password", required: true });
    const form = h("form", { class: "form" });
    form.append(msg, h("label", {}, "Nickname", nick, kontoMode === "register" ? h("span", { class: "note", text: "3–20 Zeichen (Buchstaben, Ziffern, _ . -). Nimm bitte nicht deinen vollen echten Namen." }) : null));
    let pw2, cls;
    if (kontoMode === "register") {
      cls = h("input", { type: "text", list: "classlist", required: true, maxlength: "20", autocomplete: "off", placeholder: "z. B. BGY 11a" });
      const dl = h("datalist", { id: "classlist" });
      api("GET", "/api/classes").then((r) => (r.classes || []).forEach((c) => dl.append(h("option", { value: c })))).catch(() => {});
      pw2 = h("input", { type: "password", autocomplete: "new-password", required: true });
      form.append(h("label", {}, "Klasse", cls, dl, h("span", { class: "note", text: "Wähle deine Klasse aus der Liste oder schreibe sie genau so, wie deine Lehrkraft sie angegeben hat." })),
        h("label", {}, "Passwort", pw, h("span", { class: "note", text: "mindestens 6 Zeichen" })),
        h("label", {}, "Passwort wiederholen", pw2));
    } else {
      form.append(h("label", {}, "Passwort", pw));
    }
    const submit = h("button", { class: "btn primary", type: "submit" }, kontoMode === "login" ? "Anmelden" : "Konto anlegen");
    form.append(h("div", {}, submit));
    if (Object.keys(P().ex).length) form.append(h("p", { class: "note muted", text: "Hinweis: Was du auf diesem Gerät schon gelöst hast, wird mit deinem Konto zusammengeführt." }));
    form.onsubmit = async (e) => {
      e.preventDefault();
      msg.hidden = true;
      if (kontoMode === "register" && pw.value !== pw2.value) { msg.hidden = false; msg.textContent = "Die beiden Passwörter stimmen nicht überein."; return; }
      submit.disabled = true;
      try {
        const payload = { nick: nick.value.trim(), password: pw.value, progress: P() };
        if (kontoMode === "register") payload.className = cls.value.trim();
        const r = await api("POST", kontoMode === "login" ? "/api/login" : "/api/register", payload);
        state.auth = { token: r.token, nick: r.user.nick, className: r.user.className };
        state.progress = mergeProgress(P(), r.user.progress);
        persist(); applyTheme();
        syncStatus = "saved";
        toast(kontoMode === "login" ? `Willkommen zurück, ${r.user.nick}!` : `Konto angelegt – viel Erfolg, ${r.user.nick}!`, "gold");
        location.hash = "#/";
        render();
      } catch (err) {
        msg.hidden = false; msg.textContent = err.message;
      } finally { submit.disabled = false; }
    };
    page.append(form);
    main.append(page);
  }
  async function logout() {
    const ok = await confirmDlg({ icon: "👋", title: "Abmelden?", text: "Dein Fortschritt bleibt in deinem Konto gespeichert. Auf diesem Gerät wird er nach dem Abmelden nicht mehr angezeigt.", okLabel: "Abmelden", cancelLabel: "Angemeldet bleiben" });
    if (!ok) return;
    clearTimeout(syncTimer);
    try { await api("PUT", "/api/progress", { progress: P() }); } catch (e) { /* ignore */ }
    try { await api("POST", "/api/logout"); } catch (e) { /* ignore */ }
    state = { progress: emptyProgress(), auth: null };
    persist(); applyTheme(); syncStatus = "local";
    toast("Du bist abgemeldet.");
    location.hash = "#/";
    render();
  }

  /* ---------- Start ---------- */
  applyTheme();
  render();
  refreshFromServer();
})();
