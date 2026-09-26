// The Grammar Line – Server-API (Netlify Functions v2 + Netlify Blobs)
// Einzige benötigte Environment Variable: TEACHER_CODE (Zugangscode für Lehrkräfte)
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const STORE_USERS = "grammarline-users";
const STORE_SESSIONS = "grammarline-sessions";
const STORE_META = "grammarline-meta";

const STUDENT_SESSION_DAYS = 60;
const TEACHER_SESSION_HOURS = 12;
const MAX_BODY = 300 * 1024;

const NICK_RE = /^[A-Za-z0-9ÄÖÜäöüß_.\-]{3,20}$/;
const CLASS_RE = /^[A-Za-z0-9ÄÖÜäöüß .\-]{1,20}$/;

const stores = {};
function store(name) {
  if (!stores[name]) stores[name] = getStore({ name, consistency: "strong" });
  return stores[name];
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
const fail = (message, status = 400) => json({ error: message }, status);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getEnv(name) {
  try {
    if (globalThis.Netlify && globalThis.Netlify.env) {
      const v = globalThis.Netlify.env.get(name);
      if (v) return v;
    }
  } catch (e) { /* ignore */ }
  return process.env[name];
}

const userKey = (nick) => "u/" + encodeURIComponent(String(nick).toLowerCase());
const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");
const cleanClass = (c) => String(c || "").replace(/\s+/g, " ").trim();

function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { salt, hash };
}
function safeEqualHex(a, b) {
  const ba = Buffer.from(String(a), "hex");
  const bb = Buffer.from(String(b), "hex");
  if (ba.length !== bb.length || ba.length === 0) return false;
  return crypto.timingSafeEqual(ba, bb);
}
function safeEqualText(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb) && String(a).length === String(b).length;
}
function randomPassword() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  const bytes = crypto.randomBytes(10);
  for (let i = 0; i < 10; i++) out += chars[bytes[i] % chars.length];
  return out.slice(0, 5) + "-" + out.slice(5);
}

/* ---------- Fortschritt zusammenführen (mehrere Geräte) ---------- */
function mergeProgress(a, b) {
  a = a && typeof a === "object" ? a : {};
  b = b && typeof b === "object" ? b : {};
  const out = { ex: {}, bestStreak: 0, streak: 0, settings: {}, updated: 0 };
  const exA = a.ex || {}, exB = b.ex || {};
  const ids = new Set([...Object.keys(exA), ...Object.keys(exB)]);
  for (const id of ids) {
    const x = exA[id] || {}, y = exB[id] || {};
    const xp = Math.max(Number(x.xp) || 0, Number(y.xp) || 0);
    const newer = (Number(x.t) || 0) >= (Number(y.t) || 0) ? x : y;
    const rec = {
      done: !!(x.done || y.done),
      xp,
      sol: xp > 0 ? false : !!(x.sol || y.sol),
      att: Math.max(Number(x.att) || 0, Number(y.att) || 0),
      t: Math.max(Number(x.t) || 0, Number(y.t) || 0)
    };
    if (typeof newer.ans === "string") rec.ans = newer.ans.slice(0, 3000);
    else if (typeof x.ans === "string") rec.ans = x.ans.slice(0, 3000);
    else if (typeof y.ans === "string") rec.ans = y.ans.slice(0, 3000);
    if (x.hint || y.hint) rec.hint = true;
    out.ex[String(id).slice(0, 40)] = rec;
  }
  const newerTop = (Number(a.updated) || 0) >= (Number(b.updated) || 0) ? a : b;
  out.bestStreak = Math.max(Number(a.bestStreak) || 0, Number(b.bestStreak) || 0);
  out.streak = Number(newerTop.streak) || 0;
  const sa = a.settings || {}, sb = b.settings || {};
  const s = (Number(sa.t) || 0) >= (Number(sb.t) || 0) ? sa : sb;
  out.settings = {
    avatar: String(s.avatar || "fox").slice(0, 20),
    pet: String(s.pet || "none").slice(0, 20),
    theme: String(s.theme || "auto").slice(0, 20),
    t: Number(s.t) || 0
  };
  out.updated = Math.max(Number(a.updated) || 0, Number(b.updated) || 0);
  return out;
}

// Nach einem Zurücksetzen durch die Lehrkraft werden ältere Einträge von Geräten verworfen
function dropBefore(progress, resetAt) {
  if (!progress || typeof progress !== "object" || !resetAt) return progress;
  const ex = {};
  Object.entries(progress.ex || {}).forEach(([id, r]) => {
    if (r && Number(r.t) > resetAt) ex[id] = r;
  });
  return { ...progress, ex, bestStreak: Number(progress.updated) > resetAt ? progress.bestStreak : 0, streak: 0 };
}

/* ---------- Klassenliste ---------- */
async function getClasses() {
  const list = await store(STORE_META).get("classes", { type: "json" });
  return Array.isArray(list) ? list : [];
}
async function addClass(name) {
  name = cleanClass(name);
  if (!name) return;
  const list = await getClasses();
  if (!list.some((c) => c.toLowerCase() === name.toLowerCase())) {
    list.push(name);
    list.sort((x, y) => x.localeCompare(y, "de"));
    await store(STORE_META).setJSON("classes", list);
  }
}
async function removeClass(name) {
  const list = (await getClasses()).filter((c) => c.toLowerCase() !== cleanClass(name).toLowerCase());
  await store(STORE_META).setJSON("classes", list);
}

/* ---------- Sitzungen ---------- */
async function createSession(data, ms) {
  const token = crypto.randomBytes(32).toString("hex");
  await store(STORE_SESSIONS).setJSON(sha256(token), { ...data, exp: Date.now() + ms });
  return token;
}
async function readSession(req) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+([a-f0-9]{64})$/i);
  if (!m) return null;
  const key = sha256(m[1]);
  const s = await store(STORE_SESSIONS).get(key, { type: "json" });
  if (!s) return null;
  if (!s.exp || s.exp < Date.now()) {
    await store(STORE_SESSIONS).delete(key).catch(() => {});
    return null;
  }
  s._key = key;
  return s;
}
async function requireStudent(req) {
  const s = await readSession(req);
  if (!s || s.role !== "student") return null;
  const user = await store(STORE_USERS).get(userKey(s.nick), { type: "json" });
  if (!user || (user.v || 0) !== (s.v || 0)) return null;
  return { session: s, user };
}
async function requireTeacher(req) {
  const s = await readSession(req);
  if (!s || s.role !== "teacher") return null;
  return s;
}

function publicUser(u) {
  return { nick: u.nick, className: u.className, progress: u.progress || {}, created: u.created, lastActive: u.lastActive };
}

async function readBody(req) {
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_BODY) throw Object.assign(new Error("too large"), { status: 413 });
  const text = await req.text();
  if (text.length > MAX_BODY) throw Object.assign(new Error("too large"), { status: 413 });
  if (!text) return {};
  try { return JSON.parse(text); } catch (e) { return {}; }
}

/* ---------- Handler ---------- */
export default async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/?/, "").replace(/\/+$/, "");
  const method = req.method.toUpperCase();

  try {
    /* Öffentliche Klassenliste für die Registrierung */
    if (route === "classes" && method === "GET") {
      return json({ classes: await getClasses() });
    }

    /* Registrierung */
    if (route === "register" && method === "POST") {
      const body = await readBody(req);
      const nick = String(body.nick || "").trim();
      const password = String(body.password || "");
      const className = cleanClass(body.className);
      if (!NICK_RE.test(nick)) return fail("Der Nickname muss 3–20 Zeichen lang sein (Buchstaben, Ziffern, _ . -).");
      if (password.length < 6 || password.length > 100) return fail("Das Passwort muss mindestens 6 Zeichen lang sein.");
      if (!CLASS_RE.test(className)) return fail("Bitte gib deine Klasse an (max. 20 Zeichen).");
      const users = store(STORE_USERS);
      const key = userKey(nick);
      if (await users.get(key)) return fail("Dieser Nickname ist schon vergeben. Wähle bitte einen anderen.", 409);
      const { salt, hash } = hashPassword(password);
      const now = Date.now();
      const user = {
        nick, className, salt, hash, v: 0, created: now, lastActive: now,
        progress: mergeProgress(body.progress, {}), failed: 0, lockUntil: 0
      };
      await users.setJSON(key, user);
      await addClass(className);
      const token = await createSession({ role: "student", nick, v: 0 }, STUDENT_SESSION_DAYS * 864e5);
      return json({ token, user: publicUser(user) });
    }

    /* Anmeldung Schüler */
    if (route === "login" && method === "POST") {
      const body = await readBody(req);
      const nick = String(body.nick || "").trim();
      const password = String(body.password || "");
      const users = store(STORE_USERS);
      const user = NICK_RE.test(nick) ? await users.get(userKey(nick), { type: "json" }) : null;
      if (!user) { await sleep(400); return fail("Nickname oder Passwort ist falsch.", 401); }
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return fail("Zu viele Fehlversuche. Bitte warte ein paar Minuten oder frag deine Lehrkraft.", 429);
      }
      const check = hashPassword(password, user.salt);
      if (!safeEqualHex(check.hash, user.hash)) {
        user.failed = (user.failed || 0) + 1;
        if (user.failed >= 8) { user.lockUntil = Date.now() + 5 * 60 * 1000; user.failed = 0; }
        await users.setJSON(userKey(nick), user);
        await sleep(400);
        return fail("Nickname oder Passwort ist falsch.", 401);
      }
      user.failed = 0; user.lockUntil = 0;
      user.progress = mergeProgress(user.progress, dropBefore(body.progress, user.resetAt));
      user.lastActive = Date.now();
      await users.setJSON(userKey(nick), user);
      const token = await createSession({ role: "student", nick: user.nick, v: user.v || 0 }, STUDENT_SESSION_DAYS * 864e5);
      return json({ token, user: publicUser(user) });
    }

    /* Eigene Daten */
    if (route === "me" && method === "GET") {
      const auth = await requireStudent(req);
      if (!auth) return fail("Bitte melde dich erneut an.", 401);
      return json({ user: publicUser(auth.user) });
    }

    /* Fortschritt speichern */
    if (route === "progress" && (method === "PUT" || method === "POST")) {
      const auth = await requireStudent(req);
      if (!auth) return fail("Bitte melde dich erneut an.", 401);
      const body = await readBody(req);
      const user = auth.user;
      user.progress = mergeProgress(user.progress, dropBefore(body.progress, user.resetAt));
      user.lastActive = Date.now();
      await store(STORE_USERS).setJSON(userKey(user.nick), user);
      return json({ progress: user.progress });
    }

    /* Passwort ändern (Schüler) */
    if (route === "password" && method === "POST") {
      const auth = await requireStudent(req);
      if (!auth) return fail("Bitte melde dich erneut an.", 401);
      const body = await readBody(req);
      const user = auth.user;
      const check = hashPassword(String(body.oldPassword || ""), user.salt);
      if (!safeEqualHex(check.hash, user.hash)) return fail("Das bisherige Passwort stimmt nicht.", 403);
      const pw = String(body.newPassword || "");
      if (pw.length < 6 || pw.length > 100) return fail("Das neue Passwort muss mindestens 6 Zeichen lang sein.");
      const { salt, hash } = hashPassword(pw);
      user.salt = salt; user.hash = hash; user.v = (user.v || 0) + 1;
      await store(STORE_USERS).setJSON(userKey(user.nick), user);
      const token = await createSession({ role: "student", nick: user.nick, v: user.v }, STUDENT_SESSION_DAYS * 864e5);
      return json({ ok: true, token });
    }

    /* Abmelden */
    if (route === "logout" && method === "POST") {
      const s = await readSession(req);
      if (s) await store(STORE_SESSIONS).delete(s._key).catch(() => {});
      return json({ ok: true });
    }

    /* ---------------- Lehrerbereich ---------------- */
    if (route === "teacher/login" && method === "POST") {
      const code = getEnv("TEACHER_CODE");
      if (!code) return fail("Der Lehrerzugang ist noch nicht eingerichtet (Environment Variable TEACHER_CODE fehlt).", 503);
      const meta = store(STORE_META);
      const lock = (await meta.get("teacher-lock", { type: "json" })) || { failed: 0, until: 0 };
      if (lock.until > Date.now()) return fail("Zu viele Fehlversuche. Bitte versuche es in einigen Minuten erneut.", 429);
      const body = await readBody(req);
      if (!safeEqualText(String(body.code || ""), code)) {
        lock.failed = (lock.failed || 0) + 1;
        if (lock.failed >= 10) { lock.until = Date.now() + 10 * 60 * 1000; lock.failed = 0; }
        await meta.setJSON("teacher-lock", lock);
        await sleep(600);
        return fail("Der Lehrer-Code ist falsch.", 401);
      }
      if (lock.failed) await meta.setJSON("teacher-lock", { failed: 0, until: 0 });
      const className = cleanClass(body.className);
      if (className && !CLASS_RE.test(className)) return fail("Ungültiger Klassenname (max. 20 Zeichen).");
      if (className) await addClass(className);
      const token = await createSession({ role: "teacher", className }, TEACHER_SESSION_HOURS * 3600e3);
      return json({ token, className, classes: await getClasses() });
    }

    if (route.startsWith("teacher/")) {
      const t = await requireTeacher(req);
      if (!t) return fail("Bitte melde dich im Lehrerbereich erneut an.", 401);
      const users = store(STORE_USERS);

      if (route === "teacher/classes" && method === "GET") {
        return json({ classes: await getClasses() });
      }
      if (route === "teacher/classes" && method === "POST") {
        const body = await readBody(req);
        const name = cleanClass(body.className);
        if (!CLASS_RE.test(name)) return fail("Ungültiger Klassenname (max. 20 Zeichen).");
        if (body.remove) await removeClass(name); else await addClass(name);
        return json({ classes: await getClasses() });
      }

      if (route === "teacher/users" && method === "GET") {
        const filter = cleanClass(url.searchParams.get("class") || "").toLowerCase();
        const { blobs } = await users.list({ prefix: "u/" });
        const all = await Promise.all(blobs.map((b) => users.get(b.key, { type: "json" }).catch(() => null)));
        const list = all
          .filter(Boolean)
          .filter((u) => !filter || String(u.className || "").toLowerCase() === filter)
          .map(publicUser)
          .sort((a, b) => a.nick.localeCompare(b.nick, "de"));
        return json({ users: list, classes: await getClasses() });
      }

      if (method === "POST" && ["teacher/reset-progress", "teacher/reset-password", "teacher/delete", "teacher/move"].includes(route)) {
        const body = await readBody(req);
        const nick = String(body.nick || "").trim();
        const key = userKey(nick);
        const user = NICK_RE.test(nick) ? await users.get(key, { type: "json" }) : null;
        if (!user) return fail("Dieses Konto gibt es nicht (mehr).", 404);

        if (route === "teacher/reset-progress") {
          user.progress = mergeProgress({}, {});
          user.resetAt = Date.now();
          user.progress.updated = user.resetAt;
          user.v = (user.v || 0) + 1; // bestehende Sitzungen abmelden, damit alte Geräte nichts zurückschreiben
          await users.setJSON(key, user);
          return json({ ok: true });
        }
        if (route === "teacher/reset-password") {
          let pw = String(body.newPassword || "").trim();
          if (!pw) pw = randomPassword();
          if (pw.length < 6 || pw.length > 100) return fail("Das neue Passwort muss mindestens 6 Zeichen lang sein.");
          const { salt, hash } = hashPassword(pw);
          user.salt = salt; user.hash = hash; user.v = (user.v || 0) + 1; user.failed = 0; user.lockUntil = 0;
          await users.setJSON(key, user);
          return json({ ok: true, password: pw });
        }
        if (route === "teacher/delete") {
          await users.delete(key);
          return json({ ok: true });
        }
        if (route === "teacher/move") {
          const className = cleanClass(body.className);
          if (!CLASS_RE.test(className)) return fail("Ungültiger Klassenname (max. 20 Zeichen).");
          user.className = className;
          await users.setJSON(key, user);
          await addClass(className);
          return json({ ok: true });
        }
      }
    }

    return fail("Unbekannte Anfrage.", 404);
  } catch (err) {
    if (err && err.status === 413) return fail("Die Anfrage ist zu groß.", 413);
    console.error(err);
    return fail("Serverfehler. Bitte versuche es später erneut.", 500);
  }
};

export const config = { path: "/api/*" };
