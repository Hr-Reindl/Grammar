/* The Grammar Line – Lehrerbereich */
(function () {
  "use strict";
  const C = window.COURSE, G = C.game;
  const UNITS = C.modules.concat([C.finalChallenge]);
  const ALL = UNITS.flatMap((u) => u.exercises);
  const TKEY = "grammarline.teacher";
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function h(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === "class") n.className = v; else if (k === "html") n.innerHTML = v; else if (k === "text") n.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    });
    kids.flat().forEach((k) => { if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(k)); });
    return n;
  }

  let T = null;
  try { T = JSON.parse(sessionStorage.getItem(TKEY) || "null"); } catch (e) { T = null; }
  let users = [], classes = [], selected = null, filter = (T && T.className) || "";
  const saveT = () => { try { if (T) sessionStorage.setItem(TKEY, JSON.stringify(T)); else sessionStorage.removeItem(TKEY); } catch (e) { /* */ } };

  async function api(method, path, body) {
    const headers = { "content-type": "application/json" };
    if (T && T.token) headers.authorization = "Bearer " + T.token;
    let res;
    try { res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store" }); }
    catch (e) { const err = new Error("Der Server ist nicht erreichbar."); err.status = 0; throw err; }
    let data = {};
    try { data = await res.json(); } catch (e) { /* */ }
    if (!res.ok) {
      const err = new Error(data.error || "Fehler " + res.status); err.status = res.status;
      if (res.status === 401 && T) { T = null; saveT(); setTimeout(render, 0); }
      throw err;
    }
    return data;
  }
  function toast(text) { const t = h("div", { class: "toast", text }); $("#toasts").append(t); setTimeout(() => t.remove(), 4500); }
  function confirmDlg(o) {
    return new Promise((resolve) => {
      const d = $("#dlg");
      if (typeof d.showModal !== "function") { resolve(window.confirm(o.text)); return; }
      d.innerHTML = "";
      const close = (v) => d.close(v);
      d.append(h("div", { class: "dlg-body" }, h("h3", { id: "dlg-title", text: o.title }), h("p", { text: o.text }),
        h("div", { class: "dlg-actions" },
          h("button", { class: "btn " + (o.danger ? "danger" : "ghost"), type: "button", onclick: () => close("ok") }, o.okLabel || "OK"),
          h("button", { class: "btn primary", type: "button", onclick: () => close("cancel") }, "Abbrechen"))));
      d.addEventListener("close", function f() { d.removeEventListener("close", f); resolve(d.returnValue === "ok"); });
      d.showModal();
    });
  }

  /* ---------- Auswertung ---------- */
  function stats(p) {
    p = p || {}; const ex = p.ex || {};
    const xp = ALL.reduce((s, e) => s + ((ex[e.id] && +ex[e.id].xp) || 0), 0);
    let lv = 0; G.levels.forEach((l, k) => { if (xp >= l.min) lv = k; });
    const units = UNITS.map((u) => {
      const main = u.exercises.filter((e) => !e.bonus), bonus = u.exercises.filter((e) => e.bonus);
      const done = main.filter((e) => ex[e.id] && ex[e.id].done).length;
      return { u, done, total: main.length, bonus: bonus.filter((e) => ex[e.id] && ex[e.id].done).length, bonusTotal: bonus.length,
        sol: u.exercises.filter((e) => ex[e.id] && ex[e.id].sol).length };
    });
    const stations = units.filter((x) => !x.u.isFinal && x.done === x.total).length;
    const tasks = ALL.filter((e) => ex[e.id] && ex[e.id].done).length;
    const finalDone = units[units.length - 1].done === units[units.length - 1].total;
    return { xp, level: lv + 1, levelTitle: G.levels[lv].title, units, stations, tasks, finalDone };
  }
  const fmtDate = (t) => t ? new Date(t).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "–";

  /* ---------- Ansichten ---------- */
  function render() {
    const main = $("#main"); main.innerHTML = "";
    if (!T) return viewLogin(main);
    viewDashboard(main);
  }

  function viewLogin(main) {
    const page = h("div", { class: "read" });
    page.append(h("div", { class: "page-head" }, h("h1", {}, "Lehrerbereich"),
      h("p", { text: "Melde dich mit dem Lehrer-Code an und wähle die Klasse, deren Lernstand du sehen möchtest. Eine neue Klasse legst du an, indem du ihren Namen einträgst – Schülerinnen und Schüler können sie dann bei der Registrierung auswählen." })));
    const msg = h("div", { class: "msg err", hidden: true, role: "alert" });
    const code = h("input", { type: "password", autocomplete: "current-password", required: true });
    const sel = h("select", {}, h("option", { value: "" }, "Alle Klassen"));
    const neu = h("input", { type: "text", maxlength: "20", placeholder: "z. B. BGY 11a", autocomplete: "off" });
    api("GET", "/api/classes").then((r) => (r.classes || []).forEach((c) => sel.append(h("option", { value: c }, c)))).catch(() => {});
    const submit = h("button", { class: "btn primary", type: "submit" }, "Anmelden");
    const form = h("form", { class: "form" }, msg,
      h("label", {}, "Lehrer-Code", code),
      h("label", {}, "Klasse auswählen", sel),
      h("label", {}, "… oder neue Klasse anlegen", neu, h("span", { class: "note", text: "optional, max. 20 Zeichen" })),
      h("div", {}, submit));
    form.onsubmit = async (e) => {
      e.preventDefault(); msg.hidden = true; submit.disabled = true;
      try {
        const className = neu.value.trim() || sel.value;
        const r = await api("POST", "/api/teacher/login", { code: code.value, className });
        T = { token: r.token, className: r.className || "" }; filter = T.className; saveT();
        render();
      } catch (err) { msg.hidden = false; msg.textContent = err.message; }
      finally { submit.disabled = false; }
    };
    page.append(form);
    main.append(page);
  }

  async function load() {
    const q = filter ? "?class=" + encodeURIComponent(filter) : "";
    const r = await api("GET", "/api/teacher/users" + q);
    users = r.users || []; classes = r.classes || [];
  }

  async function viewDashboard(main) {
    main.append(h("p", { class: "muted", text: "Lade Lernstände …" }));
    try { await load(); } catch (e) { main.innerHTML = ""; main.append(h("div", { class: "msg err", text: e.message })); return; }
    main.innerHTML = "";
    const head = h("div", { class: "page-head" }, h("h1", {}, "Lernstände"));
    const sel = h("select", { "aria-label": "Klasse" }, h("option", { value: "" }, "Alle Klassen"), classes.map((c) => h("option", { value: c, selected: c.toLowerCase() === filter.toLowerCase() }, c)));
    sel.onchange = () => { filter = sel.value; T.className = filter; saveT(); selected = null; render(); };
    const newCls = h("input", { type: "text", maxlength: "20", placeholder: "neue Klasse", "aria-label": "Neue Klasse", style: "border:2px solid var(--border);border-radius:6px;padding:8px 10px;min-height:44px;background:var(--surface)" });
    const addCls = h("button", { class: "btn small", type: "button" }, "Klasse anlegen");
    addCls.onclick = async () => {
      const n = newCls.value.trim(); if (!n) return;
      try { await api("POST", "/api/teacher/classes", { className: n }); filter = n; T.className = n; saveT(); toast(`Klasse „${n}“ angelegt.`); render(); } catch (e) { toast(e.message); }
    };
    const delCls = filter ? h("button", { class: "btn small ghost", type: "button" }, "Klasse aus Liste entfernen") : null;
    if (delCls) delCls.onclick = async () => {
      if (!(await confirmDlg({ title: "Klasse aus der Auswahlliste entfernen?", text: `„${filter}“ wird bei der Registrierung nicht mehr vorgeschlagen. Konten und Fortschritte bleiben erhalten.`, okLabel: "Entfernen", danger: true }))) return;
      try { await api("POST", "/api/teacher/classes", { className: filter, remove: true }); filter = ""; T.className = ""; saveT(); render(); } catch (e) { toast(e.message); }
    };
    head.append(h("div", { class: "row", style: "margin-top:8px" },
      h("label", { class: "row", style: "font-weight:700;gap:8px" }, "Klasse:", sel),
      h("button", { class: "btn small", type: "button", onclick: render }, "Aktualisieren"),
      h("button", { class: "btn small", type: "button", onclick: exportCsv }, "CSV exportieren"),
      h("button", { class: "btn small ghost", type: "button", onclick: async () => { try { await api("POST", "/api/logout"); } catch (e) { /* */ } T = null; saveT(); render(); } }, "Abmelden")),
      h("div", { class: "row", style: "margin-top:10px" }, newCls, addCls, delCls));
    main.append(head);

    const S = users.map((u) => stats(u.progress));
    const avg = (f) => S.length ? Math.round(S.reduce((s, x) => s + f(x), 0) / S.length) : 0;
    main.append(h("div", { class: "stats", style: "margin-bottom:20px" },
      h("div", { class: "stat" }, h("b", { text: String(users.length) }), "Konten"),
      h("div", { class: "stat" }, h("b", { text: String(avg((x) => x.xp)) }), "Ø XP"),
      h("div", { class: "stat" }, h("b", { text: `${avg((x) => x.stations)}/${C.modules.length}` }), "Ø Stationen"),
      h("div", { class: "stat" }, h("b", { text: String(S.filter((x) => x.finalDone).length) }), "Finale geschafft")));

    if (!users.length) {
      main.append(h("div", { class: "panel" }, h("p", { style: "margin:0", text: filter ? `In der Klasse „${filter}“ gibt es noch keine Konten. Sobald sich Schülerinnen und Schüler mit dieser Klasse registrieren, erscheinen sie hier.` : "Es gibt noch keine Schülerkonten." })));
      return;
    }
    const tbl = h("table", { class: "users" });
    tbl.append(h("thead", {}, h("tr", {}, ["Nickname", "Klasse", "Level / XP", "Stationen", "Aufgaben", "Finale", "Zuletzt aktiv", ""].map((t) => h("th", { scope: "col", text: t })))));
    const tb = h("tbody");
    users.forEach((u, i) => {
      const s = S[i];
      const tr = h("tr", { class: selected === u.nick ? "sel" : "" },
        h("td", {}, h("b", { text: u.nick })), h("td", { text: u.className || "–" }),
        h("td", { text: `${s.level} (${s.levelTitle}) · ${s.xp} XP` }),
        h("td", {}, h("div", { class: "bar line minibar", title: `${s.stations}/${C.modules.length}` }, h("span", { style: `width:${Math.round(s.stations / C.modules.length * 100)}%` })), `${s.stations}/${C.modules.length}`),
        h("td", { text: `${s.tasks}/${ALL.length}` }), h("td", { text: s.finalDone ? "✓" : "–" }),
        h("td", { text: fmtDate(u.lastActive) }),
        h("td", {}, h("button", { class: "btn small", type: "button", onclick: () => { selected = selected === u.nick ? null : u.nick; render(); } }, selected === u.nick ? "Schließen" : "Details")));
      tb.append(tr);
    });
    tbl.append(tb);
    main.append(h("div", { class: "tbl-wrap" }, tbl));
    const su = users.find((u) => u.nick === selected);
    if (su) main.append(detail(su, stats(su.progress)));
  }

  function detail(u, s) {
    const box = h("section", { class: "section panel", id: "detail" });
    box.append(h("h2", { text: `${u.nick} – Details` }),
      h("p", { class: "muted", text: `Klasse ${u.className || "–"} · angelegt ${fmtDate(u.created)} · zuletzt aktiv ${fmtDate(u.lastActive)}` }));
    const grid = h("div", { class: "detail-grid" });
    s.units.forEach((x, i) => grid.append(h("div", { class: "panel" },
      h("b", { text: x.u.isFinal ? "Final stop" : `${i + 1}. ${x.u.title}` }),
      h("div", { class: "bar", style: "margin:6px 0" }, h("span", { style: `width:${Math.round(x.done / x.total * 100)}%` })),
      h("div", { class: "muted", style: "font-size:.88rem", text: `${x.done}/${x.total} Aufgaben` + (x.bonusTotal ? ` · Bonus ${x.bonus}/${x.bonusTotal}` : "") + (x.sol ? ` · ${x.sol}× Lösung angesehen` : "") }))));
    box.append(grid);

    const msg = h("div", { class: "msg", hidden: true });
    const moveInp = h("input", { type: "text", list: "tclasses", value: u.className || "", maxlength: "20", "aria-label": "Neue Klasse", style: "border:2px solid var(--border);border-radius:6px;padding:8px 10px;min-height:44px;background:var(--surface)" });
    const dl = h("datalist", { id: "tclasses" }, classes.map((c) => h("option", { value: c })));
    const pwInp = h("input", { type: "text", placeholder: "leer = automatisch erzeugen", "aria-label": "Neues Passwort", autocomplete: "off", style: "border:2px solid var(--border);border-radius:6px;padding:8px 10px;min-height:44px;background:var(--surface)" });
    const act = async (path, body, okText) => {
      try {
        const r = await api("POST", path, Object.assign({ nick: u.nick }, body || {}));
        msg.hidden = false; msg.className = "msg ok";
        msg.textContent = typeof okText === "function" ? okText(r) : okText;
        return r;
      } catch (e) { msg.hidden = false; msg.className = "msg err"; msg.textContent = e.message; return null; }
    };
    box.append(h("h3", { style: "margin-top:20px", text: "Verwalten" }), msg,
      h("div", { class: "row", style: "margin:10px 0" }, moveInp, dl,
        h("button", { class: "btn small", type: "button", onclick: async () => { if (await act("/api/teacher/move", { className: moveInp.value.trim() }, "Klasse geändert.")) { await refreshKeep(); } } }, "Klasse ändern")),
      h("div", { class: "row", style: "margin:10px 0" }, pwInp,
        h("button", { class: "btn small", type: "button", onclick: async () => {
          if (!(await confirmDlg({ title: "Passwort zurücksetzen?", text: `Das Passwort von „${u.nick}“ wird ersetzt. Die Person wird auf allen Geräten abgemeldet.`, okLabel: "Zurücksetzen" }))) return;
          await act("/api/teacher/reset-password", { newPassword: pwInp.value.trim() }, (r) => `Neues Passwort für ${u.nick}: ${r.password} – bitte persönlich weitergeben. Es kann danach unter „Konto“ geändert werden.`);
          pwInp.value = "";
        } }, "Passwort zurücksetzen")),
      h("div", { class: "row", style: "margin:10px 0" },
        h("button", { class: "btn small danger", type: "button", onclick: async () => {
          if (!(await confirmDlg({ title: "Fortschritt zurücksetzen?", text: `Alle gelösten Aufgaben, XP und Abzeichen von „${u.nick}“ werden gelöscht. Das Konto bleibt bestehen.`, okLabel: "Fortschritt löschen", danger: true }))) return;
          if (await act("/api/teacher/reset-progress", null, "Fortschritt zurückgesetzt.")) await refreshKeep();
        } }, "Fortschritt zurücksetzen"),
        h("button", { class: "btn small danger", type: "button", onclick: async () => {
          if (!(await confirmDlg({ title: "Konto löschen?", text: `Das Konto „${u.nick}“ und der gesamte Fortschritt werden endgültig gelöscht.`, okLabel: "Endgültig löschen", danger: true }))) return;
          if (await act("/api/teacher/delete", null, "Konto gelöscht.")) { selected = null; toast(`Konto „${u.nick}“ gelöscht.`); render(); }
        } }, "Konto löschen")));
    return box;
  }
  async function refreshKeep() { const y = window.scrollY; render(); setTimeout(() => window.scrollTo(0, y), 400); }

  function exportCsv() {
    const head = ["Nickname", "Klasse", "XP", "Level", "Stationen", "Aufgaben", "Finale", "Zuletzt aktiv"].concat(UNITS.map((u) => u.title));
    const rows = users.map((u) => {
      const s = stats(u.progress);
      return [u.nick, u.className, s.xp, s.level, s.stations, s.tasks, s.finalDone ? "ja" : "nein", fmtDate(u.lastActive)].concat(s.units.map((x) => `${x.done}/${x.total}`));
    });
    const csv = [head].concat(rows).map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const a = h("a", { href: URL.createObjectURL(blob), download: `grammar-line-${(filter || "alle").replace(/\s+/g, "_")}.csv` });
    document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  render();
})();
