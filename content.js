/* The Grammar Line – Kursinhalte
   Erklärungen auf Deutsch, Beispiele und Aufgaben auf Englisch (britischer Standard).
   Aufgabentypen: mc, tf, gap, choice, categorize, match, order, transform, free */
(function () {
  "use strict";

  // Beispielsatz mit Übersetzung
  const ex = (en, de) =>
    `<p class="example"><span lang="en">${en}</span>${de ? `<span class="de">${de}</span>` : ""}</p>`;

  // Einfache Zeitstrahl-Grafik (SVG). spans: Zeiträume, dots: Zeitpunkte, now: Position von "jetzt"
  const tl = (cfg) => {
    const W = 400, y = 62, x = (p) => 20 + p * 360;
    let s = `<figure class="timeline"><svg viewBox="0 0 ${W} 110" role="img" aria-label="${cfg.aria || "Zeitstrahl"}">`;
    s += `<line x1="14" y1="${y}" x2="386" y2="${y}" class="tl-axis"/><path d="M386 ${y} l-9 -5 v10 z" class="tl-arrow"/>`;
    if (cfg.now !== undefined) {
      s += `<line x1="${x(cfg.now)}" y1="${y - 12}" x2="${x(cfg.now)}" y2="${y + 18}" class="tl-now"/><text x="${x(cfg.now)}" y="${y + 36}" class="tl-label tl-strong">jetzt</text>`;
    }
    (cfg.spans || []).forEach((sp) => {
      const cls = sp.wave ? "tl-span tl-wave" : "tl-span";
      s += `<rect x="${x(sp.a)}" y="${y - 9}" width="${x(sp.b) - x(sp.a)}" height="18" rx="9" class="${cls}"/>`;
      s += `<text x="${(x(sp.a) + x(sp.b)) / 2}" y="${y - 18}" class="tl-label">${sp.label}</text>`;
    });
    (cfg.dots || []).forEach((d) => {
      s += `<circle cx="${x(d.at)}" cy="${y}" r="8" class="tl-dot"/>`;
      s += `<text x="${x(d.at)}" y="${d.below ? y + 36 : y - 18}" class="tl-label">${d.label}</text>`;
    });
    s += `</svg>${cfg.caption ? `<figcaption>${cfg.caption}</figcaption>` : ""}</figure>`;
    return s;
  };

  const modules = [];

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m1",
    title: "Present tenses",
    subtitle: "Simple present und present progressive",
    scene: {
      who: "Lena",
      text: `Monday morning in Manchester. Lena, a student from Germany, starts her work placement at <b>Brightside Logistics</b>. Her manager, Mr Okafor, says: “We <i>ship</i> parcels to twenty countries. At the moment we <i>are testing</i> a new tracking app.” Why two different forms? Let's find out.`
    },
    theory: `
<h3>Simple present – Gewohnheiten, Fakten, Fahrpläne</h3>
<p>Du nutzt das <b>simple present</b> für alles, was regelmäßig passiert oder allgemein gilt.</p>
${ex("Lena <u>takes</u> the tram to work every day.", "Gewohnheit")}
${ex("Brightside <u>ships</u> parcels to twenty countries.", "Fakt über die Firma")}
<div class="rule"><b>Bildung:</b> Grundform des Verbs; bei <i>he / she / it</i> kommt ein <b>-s</b> dazu (<i>works, goes, watches, tries</i>).<br><b>Verneinung und Frage</b> mit <i>do / does</i>: <i>She <u>doesn't</u> work on Fridays. – <u>Does</u> she work on Fridays?</i></div>
<p><b>Signalwörter:</b> always, usually, often, sometimes, never, every day, on Mondays, twice a week</p>

<h3>Present progressive – gerade jetzt, vorübergehend, Trends</h3>
${ex("Mr Okafor <u>is talking</u> to a customer right now.", "Handlung läuft gerade")}
${ex("Lena <u>is staying</u> with a host family this month.", "vorübergehende Situation")}
${ex("More and more people <u>are shopping</u> online.", "aktuelle Entwicklung")}
<div class="rule"><b>Bildung:</b> <i>am / is / are</i> + Verb mit <b>-ing</b>: <i>I'm working, she's writing, they're sitting</i>.</div>
<p><b>Signalwörter:</b> now, right now, at the moment, currently, today, this week, Look! Listen!</p>
${tl({ aria: "Zeitstrahl: simple present als wiederkehrende Punkte, present progressive als laufende Handlung um jetzt", now: 0.62, dots: [{ at: 0.12, label: "Mo" }, { at: 0.3, label: "Di" }, { at: 0.48, label: "Mi" }], spans: [{ a: 0.54, b: 0.72, label: "läuft gerade", wave: true }], caption: "Wiederkehrende Punkte = simple present · laufende Handlung um „jetzt“ = present progressive" })}

<h3>Stative verbs – Zustandsverben</h3>
<p>Verben, die einen <b>Zustand</b> ausdrücken (Denken, Fühlen, Besitz, Sinneswahrnehmung), stehen normalerweise <b>nicht</b> in der -ing-Form: <i>know, understand, believe, like, love, hate, want, need, prefer, own, belong, seem, cost, mean</i>.</p>
${ex("I <u>understand</u> the problem. (nicht: <s>I'm understanding</s>)")}
<div class="tip"><b>Achtung, Bedeutungswechsel:</b> Manche Verben sind mal Zustand, mal Handlung.
<br><i>I <u>think</u> the app is great.</i> (Meinung) – <i>I'<u>m thinking</u> about a new job.</i> (überlegen)
<br><i>He <u>has</u> two cars.</i> (besitzen) – <i>He'<u>s having</u> lunch.</i> (Handlung: essen)</div>
<div class="warn"><b>Typischer Fehler:</b> <s>She don't like coffee.</s> → <i>She <b>doesn't</b> like coffee.</i></div>`,
    exercises: [
      {
        id: "m1e1", type: "mc", xp: 10, title: "Welche Form passt?",
        prompt: "Wähle jeweils die richtige Form.",
        items: [
          { q: "Lena usually ___ the tram to work.", o: ["takes", "is taking", "take"], a: 0, e: "„usually“ zeigt eine Gewohnheit → simple present, 3. Person mit -s." },
          { q: "The phone ___. Can you answer it, please?", o: ["rings", "is ringing", "ring"], a: 1, e: "Das Telefon klingelt genau jetzt → present progressive." },
          { q: "Brightside ___ parcels to twenty countries.", o: ["is shipping", "ship", "ships"], a: 2, e: "Allgemeine Tatsache über die Firma → simple present." },
          { q: "Sorry, I don't ___ what you mean.", o: ["understanding", "understand", "understands"], a: 1, e: "„understand“ ist ein Zustandsverb; nach „don't“ steht die Grundform." }
        ]
      },
      {
        id: "m1e2", type: "categorize", xp: 10, title: "Signalwörter sortieren",
        prompt: "Welche Signalwörter passen typischerweise zu welcher Zeitform? Tippe ein Kärtchen an und dann die passende Spalte – oder ziehe es mit der Maus.",
        categories: ["Simple present", "Present progressive"],
        items: [["always", 0], ["every Monday", 0], ["usually", 0], ["never", 0], ["twice a week", 0], ["right now", 1], ["at the moment", 1], ["currently", 1], ["Listen!", 1], ["these days", 1]]
      },
      {
        id: "m1e3", type: "gap", xp: 15, title: "Lenas erster Tag",
        prompt: "Setze die Verben in der richtigen Zeitform ein (simple present oder present progressive).",
        hint: "Achte auf Signalwörter wie „every morning“ oder „right now“ – und denk an Zustandsverben.",
        text: "Hi, I'm Lena. At home in Germany I {0} (go) to a vocational upper school, but this month I {1} (do) a work placement in Manchester. Every morning my manager, Mr Okafor, {2} (check) the new orders first. Right now he {3} (talk) to a customer on the phone, so I {4} (wait) at his desk. The customer {5} (not / understand) the new delivery rules.",
        gaps: [["go"], ["am doing", "'m doing"], ["checks"], ["is talking", "'s talking"], ["am waiting", "'m waiting"], ["does not understand", "doesn't understand"]]
      },
      {
        id: "m1e4", type: "transform", xp: 15, title: "Fragen und Verneinungen",
        prompt: "Forme die Sätze wie angegeben um.",
        items: [
          { q: "Priya works in marketing. → Frage mit „Where“", a: ["Where does Priya work?"] },
          { q: "Tom is fixing the server. → Frage mit „What“", a: ["What is Tom fixing?", "What's Tom fixing?"] },
          { q: "The trainees need help. → Verneinung", a: ["The trainees do not need help.", "The trainees don't need help."] },
          { q: "Lena is enjoying her placement. → Ja/Nein-Frage", a: ["Is Lena enjoying her placement?"] }
        ]
      },
      {
        id: "m1e5", type: "choice", xp: 15, title: "Zustand oder Handlung?",
        prompt: "Wähle die passende Form. Achte darauf, ob ein Zustand oder eine Handlung gemeint ist.",
        text: "I [[think*|am thinking]] the new tracking app is great. We [[think|are thinking*]] about a new logo for the company. Mr Okafor [[has*|is having]] two company cars. He can't talk now – he [[has|is having*]] a meeting. This parcel [[weighs*|is weighing]] twelve kilos. Look, Tom [[weighs|is weighing*]] the parcels on the scale."
      },
      {
        id: "m1e6", type: "free", xp: 20, title: "Erkläre und wende an",
        prompt: "Erkläre (auf Deutsch oder Englisch), warum der Satz „I am knowing the answer.“ falsch ist. Schreibe danach zwei eigene Sätze über deinen normalen Schul- oder Arbeitsalltag und einen Satz darüber, was du gerade tust.",
        model: `<p><b>Erklärung:</b> „know“ ist ein Zustandsverb (stative verb). Es beschreibt keinen Vorgang, sondern einen Zustand im Kopf. Deshalb steht es normalerweise nicht in der -ing-Form. Richtig: <i>I know the answer.</i></p><p><b>Beispielsätze:</b><br><i>I usually get up at half past six on school days.</i><br><i>We have English three times a week.</i><br><i>At the moment I am practising English grammar.</i></p>`,
        criteria: ["Ich habe erklärt, dass „know“ ein Zustandsverb ist.", "Zwei Sätze im simple present mit -s bei he/she/it, falls nötig.", "Ein Satz im present progressive (am/is/are + -ing)."]
      },
      {
        id: "m1e7", type: "transform", xp: 25, bonus: true, title: "Bonus: Fehlerjagd",
        prompt: "In jedem Satz steckt ein Fehler. Schreibe den Satz korrekt auf.",
        items: [
          { q: "She don't work on Fridays.", a: ["She doesn't work on Fridays.", "She does not work on Fridays."] },
          { q: "Are you believing him?", a: ["Do you believe him?"] },
          { q: "Tom is usually coming late.", a: ["Tom usually comes late.", "Tom usually comes in late."] },
          { q: "Look! It rains.", a: ["Look! It's raining.", "Look! It is raining."] }
        ]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m2",
    title: "Past tenses",
    subtitle: "Simple past, past progressive und used to",
    scene: {
      who: "Tom",
      text: `Tuesday. A driver calls in a panic: “I <i>was driving</i> on the motorway when my GPS <i>stopped</i> working!” Tom, the IT apprentice, grins: “In the old days drivers <i>used to</i> have paper maps.”`
    },
    theory: `
<h3>Simple past – abgeschlossen in der Vergangenheit</h3>
<p>Das <b>simple past</b> beschreibt Handlungen, die zu einem bestimmten, abgeschlossenen Zeitpunkt passiert sind – auch mehrere Handlungen nacheinander.</p>
${ex("The driver <u>called</u> the office an hour ago.", "abgeschlossen, Zeitpunkt genannt")}
${ex("Lena <u>opened</u> the system, <u>found</u> the error and <u>fixed</u> it.", "Handlungskette")}
<div class="rule"><b>Bildung:</b> regelmäßig mit <b>-ed</b> (<i>worked, stopped, tried</i>), unregelmäßige Verben musst du lernen (<i>go – went, buy – bought, send – sent</i>).<br><b>Verneinung und Frage</b> mit <i>did</i> + Grundform: <i>He <u>didn't call</u>. – <u>Did</u> he <u>call</u>?</i></div>
<p><b>Signalwörter:</b> yesterday, last week, in 2020, two days ago, when (als)</p>

<h3>Past progressive – lief gerade in der Vergangenheit</h3>
${ex("At ten o'clock Tom <u>was updating</u> the software.", "lief zu diesem Zeitpunkt")}
${ex("While Lena <u>was checking</u> the list, the phone <u>rang</u>.", "laufende Handlung wird unterbrochen")}
<div class="rule"><b>Bildung:</b> <i>was / were</i> + Verb mit <b>-ing</b>.</div>
${tl({ aria: "Zeitstrahl: eine laufende Handlung in der Vergangenheit wird von einem Ereignis unterbrochen", now: 0.9, spans: [{ a: 0.12, b: 0.62, label: "was checking the list", wave: true }], dots: [{ at: 0.4, label: "the phone rang", below: true }], caption: "Die längere Handlung (past progressive) wird von einem kurzen Ereignis (simple past) unterbrochen." })}
<div class="tip"><b>when oder while?</b> <i>while</i> steht meist vor der längeren, laufenden Handlung (past progressive), <i>when</i> oft vor dem kurzen Ereignis (simple past).</div>

<h3>used to – früher war das so</h3>
${ex("Mr Okafor <u>used to drive</u> a van. Now he works in the office.", "früher regelmäßig, heute nicht mehr")}
<div class="rule">Frage und Verneinung: <i>Did you <u>use</u> to…? – I didn't <u>use</u> to…</i> (ohne -d nach <i>did</i>).</div>`,
    exercises: [
      {
        id: "m2e1", type: "match", xp: 10, title: "Unregelmäßige Verben",
        prompt: "Ordne jeder Grundform die richtige simple-past-Form zu.",
        pairs: [["buy", "bought"], ["catch", "caught"], ["choose", "chose"], ["send", "sent"], ["teach", "taught"], ["lead", "led"], ["pay", "paid"], ["fall", "fell"]]
      },
      {
        id: "m2e2", type: "gap", xp: 15, title: "Der verlorene Lkw",
        prompt: "Setze die Verben im simple past oder past progressive ein.",
        hint: "Welche Handlung lief gerade (past progressive), welche passierte kurz und abgeschlossen (simple past)?",
        text: "Yesterday a lorry driver {0} (call) the office. He {1} (drive) on the motorway when his GPS {2} (stop) working. While he {3} (look) for the address on his phone, Lena {4} (find) the problem in the system: someone {5} (type) the wrong postcode.",
        gaps: [["called"], ["was driving"], ["stopped"], ["was looking"], ["found"], ["typed", "had typed"]],
        note: "Bei Lücke 6 ist auch „had typed“ (past perfect) richtig, weil der Tippfehler vorher passiert ist – dazu mehr in Station 4."
      },
      {
        id: "m2e3", type: "choice", xp: 15, title: "Kurz oder lang?",
        prompt: "Wähle die passende Zeitform.",
        text: "When the fire alarm [[rang*|was ringing]], everyone [[left*|was leaving]] the building immediately. I [[had|was having*]] lunch when Priya [[called*|was calling]] me. At ten o'clock yesterday morning, Tom [[updated|was updating*]] the software. First he [[checked*|was checking]] the invoices, then he [[sent*|was sending]] them to the customers."
      },
      {
        id: "m2e4", type: "transform", xp: 15, title: "Früher war alles anders",
        prompt: "Schreibe die Sätze mit „used to“ um.",
        items: [
          { q: "In the past, Brightside had only one warehouse.", a: ["Brightside used to have only one warehouse.", "Brightside only used to have one warehouse.", "Brightside used to have one warehouse only."] },
          { q: "Mr Okafor drove a van every day, but he doesn't any more.", a: ["Mr Okafor used to drive a van every day.", "Mr Okafor used to drive a van."] },
          { q: "Did you play football as a child? (Frage mit used to)", a: ["Did you use to play football as a child?", "Did you use to play football when you were a child?"] }
        ]
      },
      {
        id: "m2e5", type: "tf", xp: 10, title: "Richtig oder falsch?",
        prompt: "Ist der Satz grammatisch korrekt?",
        labels: ["korrekt", "fehlerhaft"],
        items: [
          ["We were waiting at the bus stop when the bus came.", true],
          ["Did she went home early?", false, "Nach „did“ steht die Grundform: Did she go home early?"],
          ["I was knowing the answer.", false, "„know“ ist ein Zustandsverb: I knew the answer."],
          ["They used to live in Leeds.", true],
          ["He didn't called me back.", false, "Nach „didn't“ steht die Grundform: He didn't call me back."],
          ["When did you arrive?", true]
        ]
      },
      {
        id: "m2e6", type: "free", xp: 20, title: "Ein kurzer Vorfallbericht",
        prompt: "Schreibe einen kurzen Bericht (4–6 Sätze) über etwas, das bei einer Veranstaltung, in der Schule oder bei der Arbeit schiefgelaufen ist. Verwende mindestens zweimal das simple past, zweimal das past progressive und einmal „when“ oder „while“.",
        model: `<p><i>Last Friday our class was organising a charity cake sale in the school hall. While we were setting up the tables, the lights suddenly went out. Some students were still carrying cakes, so one tray fell on the floor. Our teacher called the caretaker, and he fixed the problem in ten minutes. In the end we sold almost all the cakes and raised 180 euros.</i></p>`,
        criteria: ["Mindestens zwei Verben im simple past (z. B. went, called, fixed).", "Mindestens zwei Verben im past progressive (was/were + -ing).", "„when“ oder „while“ verbindet eine laufende Handlung mit einem Ereignis.", "Der Bericht ist verständlich und in einer sinnvollen Reihenfolge."]
      },
      {
        id: "m2e7", type: "order", xp: 25, bonus: true, title: "Bonus: Satzbau",
        prompt: "Bringe die Wörter in eine korrekte Reihenfolge. Tippe die Wörter nacheinander an.",
        items: [
          { words: "while Lena was checking the list the phone rang", a: ["While Lena was checking the list the phone rang", "The phone rang while Lena was checking the list"] },
          { words: "did you use to walk to school", a: ["Did you use to walk to school"] },
          { words: "what were you doing at eight o'clock", a: ["What were you doing at eight o'clock"] }
        ]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m3",
    title: "Present perfect",
    subtitle: "Present perfect (progressive) oder simple past?",
    scene: {
      who: "Mr Okafor",
      text: `Wednesday. Mr Okafor asks for a quick update. Lena answers: “I <i>have entered</i> 40 orders so far, but I <i>haven't finished</i> the list yet. I <i>have been working</i> on it since nine. Oh, and I <i>sent</i> the invoices yesterday.”`
    },
    theory: `
<h3>Present perfect simple – Vergangenheit mit Bezug zur Gegenwart</h3>
<p>Das <b>present perfect</b> verbindet Vergangenheit und Gegenwart. Der genaue Zeitpunkt ist unwichtig oder nicht abgeschlossen.</p>
${ex("I <u>have lost</u> my badge. (Ich habe ihn jetzt nicht.)", "Ergebnis ist jetzt wichtig")}
${ex("<u>Have</u> you ever <u>been</u> to Scotland?", "Erfahrung bis jetzt")}
${ex("We <u>have sold</u> 300 units this week.", "Zeitraum ist noch nicht vorbei")}
<div class="rule"><b>Bildung:</b> <i>have / has</i> + 3. Form (past participle): <i>worked, gone, seen, written</i>.</div>
<p><b>Signalwörter:</b> already, yet, just, ever, never, so far, recently, since, for, this week</p>

<h3>Simple past oder present perfect?</h3>
<table class="gram"><thead><tr><th>Simple past</th><th>Present perfect</th></tr></thead><tbody>
<tr><td>abgeschlossener Zeitpunkt wird genannt oder ist klar</td><td>kein genauer Zeitpunkt; Bezug zu jetzt</td></tr>
<tr><td><i>I <u>sent</u> the invoices <b>yesterday</b>.</i></td><td><i>I <u>have</u> already <u>sent</u> the invoices.</i></td></tr>
<tr><td>yesterday, last week, ago, in 2019, when…?</td><td>already, yet, ever, never, since, for, so far</td></tr>
</tbody></table>
<div class="warn"><b>Typischer Fehler:</b> <s>Have you finished the report yesterday?</s> → <i><b>Did</b> you <b>finish</b> the report yesterday?</i></div>

<h3>Present perfect progressive – wie lange schon?</h3>
<p>Mit <b>have / has been + -ing</b> betonst du die <b>Dauer</b> einer Handlung, die bis jetzt andauert oder gerade erst aufgehört hat.</p>
${ex("Lena <u>has been working</u> on the list since nine o'clock.", "dauert bis jetzt an")}
${tl({ aria: "Zeitstrahl: Handlung beginnt in der Vergangenheit und dauert bis jetzt", now: 0.72, spans: [{ a: 0.2, b: 0.72, label: "has been working", wave: true }], dots: [{ at: 0.2, label: "since 9 a.m.", below: true }], caption: "Die Handlung beginnt in der Vergangenheit und reicht bis „jetzt“." })}
<div class="tip"><b>since oder for?</b> <b>since</b> + Zeitpunkt (<i>since Monday, since 2023</i>) · <b>for</b> + Zeitraum (<i>for three weeks, for ages</i>).</div>
<div class="warn"><b>Deutsch „seit“:</b> <i>Ich arbeite seit drei Wochen hier.</i> → <i>I <b>have been working</b> here <b>for</b> three weeks.</i> (nicht: <s>I work here since three weeks.</s>)</div>`,
    exercises: [
      {
        id: "m3e1", type: "categorize", xp: 10, title: "since oder for?",
        prompt: "Sortiere die Zeitangaben: Passt „since“ oder „for“?",
        categories: ["since", "for"],
        items: [["Monday", 0], ["2023", 0], ["last summer", 0], ["I was a child", 0], ["9 o'clock", 0], ["three weeks", 1], ["ages", 1], ["two hours", 1], ["a long time", 1], ["ten minutes", 1]]
      },
      {
        id: "m3e2", type: "choice", xp: 15, title: "Zeitpunkt oder Bezug zu jetzt?",
        prompt: "Wähle zwischen present perfect und simple past.",
        hint: "Wird ein abgeschlossener Zeitpunkt genannt? Dann simple past.",
        text: "Lena [[has sent*|sent]] 40 emails so far this week. She [[has sent|sent*]] the last one ten minutes ago. Priya [[has lived*|lived]] in Manchester since 2019. Brightside [[has opened|opened*]] its first warehouse in 2008. [[Have you seen*|Did you see]] my keys? I can't find them anywhere."
      },
      {
        id: "m3e3", type: "gap", xp: 15, title: "Kurzes Gespräch in der Pause",
        prompt: "Setze die Verben im present perfect simple oder present perfect progressive ein.",
        text: "Lena: “I {0} (wait) for the delivery for two hours!” Tom: “Really? And how long {1} (you / work) on that order?” Lena: “Since this morning. And I {2} (not / finish) it yet.” Tom: “You look tired. {3} (you / eat) anything today?”",
        gaps: [["have been waiting", "'ve been waiting"], ["have you been working"], ["have not finished", "haven't finished"], ["Have you eaten", "Have you had"]]
      },
      {
        id: "m3e4", type: "transform", xp: 15, title: "Deutsch „seit“ auf Englisch",
        prompt: "Übersetze ins Englische.",
        items: [
          { q: "Ich arbeite seit Montag hier.", a: ["I have been working here since Monday.", "I've been working here since Monday.", "I have worked here since Monday.", "I've worked here since Monday."] },
          { q: "Wir kennen uns seit zwei Jahren.", a: ["We have known each other for two years.", "We've known each other for two years."] },
          { q: "Wie lange lernst du schon Englisch?", a: ["How long have you been learning English?", "How long have you learned English?", "How long have you learnt English?", "How long have you been studying English?"] }
        ]
      },
      {
        id: "m3e5", type: "mc", xp: 10, title: "Warum diese Form?",
        prompt: "Warum steht hier jeweils diese Zeitform?",
        items: [
          { q: "“I've lost my badge.”", o: ["Das Ergebnis ist jetzt wichtig: Der Ausweis fehlt.", "Der Zeitpunkt des Verlierens ist genau bekannt.", "Die Handlung ist eine Gewohnheit."], a: 0 },
          { q: "“We opened the new warehouse in 2021.”", o: ["Die Handlung dauert bis jetzt an.", "Ein abgeschlossener Zeitpunkt in der Vergangenheit wird genannt.", "Es geht um eine Erfahrung ohne Zeitangabe."], a: 1 },
          { q: "“Tom has been coding all day.”", o: ["Es wird die Dauer einer Tätigkeit bis jetzt betont.", "Die Handlung ist lange vorbei.", "Es geht um einen Plan für die Zukunft."], a: 0 }
        ]
      },
      {
        id: "m3e6", type: "free", xp: 20, title: "Status-Update an die Chefin",
        prompt: "Schreibe eine kurze Status-E-Mail (4–6 Sätze) an deine Chefin oder deinen Lehrer: Was hast du diese Woche schon erledigt, was noch nicht, und was hast du gestern gemacht?",
        model: `<p><i>Dear Ms Walker,<br>here is a short update on my project. So far I have interviewed five customers and I have already written the first part of the report. I haven't created the charts yet, but I have been collecting the data since Monday. Yesterday I met Tom and we discussed the layout. I will send you the full report on Friday.<br>Best regards,<br>Lena</i></p>`,
        criteria: ["Present perfect mit already / so far / yet für den Stand der Dinge.", "Eine Verneinung mit „haven't … yet“.", "Simple past für „yesterday“.", "Anrede und Grußformel passen zu einer E-Mail."]
      },
      {
        id: "m3e7", type: "transform", xp: 25, bonus: true, title: "Bonus: Fehler korrigieren",
        prompt: "Korrigiere die Sätze.",
        items: [
          { q: "I work here since two years.", a: ["I have been working here for two years.", "I've been working here for two years.", "I have worked here for two years.", "I've worked here for two years."] },
          { q: "Have you finished the report yesterday?", a: ["Did you finish the report yesterday?"] },
          { q: "She has went home.", a: ["She has gone home.", "She's gone home."] },
          { q: "How long do you know Tom?", a: ["How long have you known Tom?"] }
        ]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m4",
    title: "Past perfect",
    subtitle: "Was davor passiert war",
    scene: {
      who: "Lena",
      text: `Thursday. Lena runs to the loading bay with the missing labels – but it's too late. The lorry <i>had</i> already <i>left</i>. Nobody <i>had told</i> her that it was leaving early.`
    },
    theory: `
<h3>Past perfect – die Vorvergangenheit</h3>
<p>Wenn du in der Vergangenheit erzählst und zeigen willst, dass etwas <b>noch früher</b> passiert ist, nutzt du das <b>past perfect</b>.</p>
${ex("When Lena arrived, the lorry <u>had</u> already <u>left</u>.", "erst fuhr der Lkw ab, dann kam Lena")}
${tl({ aria: "Zeitstrahl: der Lkw fährt ab, danach kommt Lena an, beides vor jetzt", now: 0.9, dots: [{ at: 0.25, label: "lorry had left" }, { at: 0.6, label: "Lena arrived" }], caption: "Früheres Ereignis = past perfect · späteres Ereignis = simple past" })}
<div class="rule"><b>Bildung:</b> <i>had</i> + 3. Form (für alle Personen gleich): <i>I had finished, she had gone, they hadn't called</i>.</div>
<p><b>Typische Verbindungen:</b> after, before, by the time, when, already, because</p>
${ex("<u>After</u> she <u>had checked</u> the labels, she printed them.")}
${ex("<u>By the time</u> the manager called, the customer <u>had cancelled</u> the order.")}
<div class="tip"><b>Nicht übertreiben:</b> Erzählst du Handlungen einfach der Reihe nach, reicht das simple past: <i>First she read the email, then she deleted it.</i></div>

<h3>Past perfect progressive – wie lange schon (damals)?</h3>
<p><i>had been</i> + -ing betont die Dauer bis zu einem Punkt in der Vergangenheit.</p>
${ex("The driver was exhausted because he <u>had been driving</u> for nine hours.")}`,
    exercises: [
      {
        id: "m4e1", type: "mc", xp: 10, title: "Was war zuerst?",
        prompt: "Welche Handlung ist zuerst passiert?",
        items: [
          { q: "When Lena arrived, the meeting had started.", o: ["Lena arrived.", "The meeting started."], a: 1 },
          { q: "Tom had saved the file before the computer crashed.", o: ["Tom saved the file.", "The computer crashed."], a: 0 },
          { q: "The customer called because the parcel hadn't arrived.", o: ["The customer called.", "The parcel did not arrive (on time)."], a: 1 }
        ]
      },
      {
        id: "m4e2", type: "gap", xp: 15, title: "Zu spät",
        prompt: "Setze die Verben im simple past, past perfect oder past perfect progressive ein.",
        hint: "Frage dich bei jeder Lücke: Passierte das vor einem anderen Ereignis in der Vergangenheit?",
        text: "By the time the lorry {0} (arrive), the customer {1} (already / cancel) the order. Mr Okafor was annoyed because nobody {2} (tell) him about it. Later we found out that the driver {3} (drive) for nine hours without a break.",
        gaps: [["arrived"], ["had already cancelled", "had already canceled", "'d already cancelled", "'d already canceled"], ["had told", "'d told"], ["had been driving", "'d been driving"]]
      },
      {
        id: "m4e3", type: "transform", xp: 15, title: "Sätze verbinden",
        prompt: "Verbinde die beiden Sätze mit dem Wort in Klammern. Verwende das past perfect für die frühere Handlung.",
        items: [
          { q: "Lena finished the inventory. Then she went home. (after)", a: ["After Lena had finished the inventory, she went home.", "Lena went home after she had finished the inventory.", "After she had finished the inventory, Lena went home.", "Lena went home after she'd finished the inventory.", "After Lena'd finished the inventory, she went home.", "Lena went home after having finished the inventory."] },
          { q: "The customers complained. Then the company changed the packaging. (because)", a: ["The company changed the packaging because the customers had complained.", "Because the customers had complained, the company changed the packaging."] },
          { q: "Tom saved the file. Then the computer crashed. (before)", a: ["Tom had saved the file before the computer crashed.", "Before the computer crashed, Tom had saved the file.", "Tom had saved the file before the computer had crashed."] }
        ]
      },
      {
        id: "m4e4", type: "choice", xp: 15, title: "Past perfect nötig?",
        prompt: "Wähle die passende Form.",
        text: "When I got to the station, the train [[left|had left*]], so I took a taxi. First she read the email, then she [[deleted*|had deleted]] it. Priya was nervous because she [[never gave|had never given*]] a presentation before. When the boss came in, everybody [[stood up*|had stood up]] and said hello."
      },
      {
        id: "m4e5", type: "order", xp: 15, title: "Satzbau",
        prompt: "Bringe die Wörter in eine korrekte Reihenfolge.",
        items: [
          { words: "the lorry had already left when Lena arrived", a: ["The lorry had already left when Lena arrived", "When Lena arrived the lorry had already left"] },
          { words: "had you ever worked in a warehouse before", a: ["Had you ever worked in a warehouse before"] }
        ]
      },
      {
        id: "m4e6", type: "free", xp: 20, title: "Zu spät gekommen",
        prompt: "Beschreibe in 4–5 Sätzen eine Situation, in der du irgendwo zu spät angekommen bist. Was war schon passiert, als du ankamst?",
        model: `<p><i>Last winter I wanted to go to a concert with my friends. When I finally got to the venue, the band had already started. I had missed the bus because I had forgotten my ticket at home and had to go back. By the time I found my friends, they had already bought drinks for everyone. Luckily, the band played my favourite song at the end.</i></p>`,
        criteria: ["Mindestens zwei Verben im past perfect (had + 3. Form).", "Das spätere Ereignis steht im simple past.", "Verbindungswörter wie when, by the time, because oder after."]
      },
      {
        id: "m4e7", type: "gap", xp: 25, bonus: true, title: "Bonus: Past perfect progressive",
        prompt: "Setze die Verben im past perfect progressive ein.",
        text: "She was exhausted because she {0} (work) all night. Their eyes were red – they {1} (stare) at screens for hours. How long {2} (you / wait) when the bus finally came?",
        gaps: [["had been working", "'d been working"], ["had been staring", "'d been staring"], ["had you been waiting"]]
      }
    ]
  });

  window.COURSE_PARTS = { ex, tl, modules };
})();
