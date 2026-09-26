/* Antwortprüfung für Freitext-Eingaben (Lücken, Umformungen, Satzbau).
   Akzeptiert Groß-/Kleinschreibung, Satzzeichen, typografische Apostrophe,
   Kurzformen (don't = do not, I'm = I am …) sowie einige britische/amerikanische Schreibweisen. */
(function (root) {
  "use strict";

  const SPELLING = {
    canceled: "cancelled", canceling: "cancelling", traveled: "travelled", traveling: "travelling",
    practiced: "practised", practicing: "practising", practice: "practise", gotten: "got",
    organized: "organised", organize: "organise", organizing: "organising", color: "colour",
    favorite: "favourite", center: "centre", learned: "learnt", dreamed: "dreamt", spelled: "spelt",
    "e-mail": "email", "e-mails": "emails", okay: "ok"
  };

  function base(input) {
    let s = String(input == null ? "" : input).toLowerCase();
    if (s.normalize) s = s.normalize("NFC");
    s = s.replace(/[\u2019\u2018\u0060\u00B4\u02BC]/g, "'");
    s = s.replace(/[\u201C\u201D\u201E\u00AB\u00BB"]/g, " ");
    s = s.replace(/[\u2013\u2014]/g, " ");
    s = s.replace(/[.!?;:,()\[\]…]/g, " ");
    s = s.replace(/\s+/g, " ").trim();
    s = s.replace(/\bwon't\b/g, "will not")
      .replace(/\bcan't\b/g, "cannot")
      .replace(/\bshan't\b/g, "shall not")
      .replace(/\bain't\b/g, "is not")
      .replace(/n't\b/g, " not")
      .replace(/\bcan not\b/g, "cannot")
      .replace(/'m\b/g, " am")
      .replace(/'re\b/g, " are")
      .replace(/'ve\b/g, " have")
      .replace(/'ll\b/g, " will");
    s = s.replace(/\s+'/g, " '");
    s = s.split(" ").map((w) => SPELLING[w] || w).join(" ");
    return s.replace(/\s+/g, " ").trim();
  }

  // 's und 'd sind mehrdeutig (is/has/Genitiv bzw. would/had) → alle Lesarten erzeugen
  function variants(input) {
    const b = base(input);
    const parts = b.split(/('s|'d)(?=\s|$)/);
    let out = [""];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      let opts;
      if (p === "'s") opts = [" is", " has", "'s"];
      else if (p === "'d") opts = [" would", " had", "'d"];
      else opts = [p];
      const next = [];
      out.forEach((o) => opts.forEach((x) => next.push(o + x)));
      out = next.slice(0, 243);
    }
    return Array.from(new Set(out.map((v) => v.replace(/\s+/g, " ").trim())));
  }

  function matches(input, answers) {
    if (!String(input || "").trim()) return false;
    const given = variants(input);
    return (answers || []).some((a) => {
      const exp = variants(a);
      return exp.some((e) => given.indexOf(e) !== -1);
    });
  }

  const api = { base, variants, matches };
  root.GrammarCheck = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
