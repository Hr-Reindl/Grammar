(function () {
  "use strict";
  const { ex, tl, modules } = window.COURSE_PARTS;

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m5",
    title: "Future",
    subtitle: "will, going to, present progressive, simple present",
    scene: {
      who: "Priya",
      text: `Friday. Priya from marketing plans the trade fair: “We<i>'re meeting</i> the organisers on Monday. The fair <i>opens</i> at nine. I<i>'m going to</i> print new brochures.” Lena: “I<i>'ll</i> help you!”`
    },
    theory: `
<h3>Vier Wege, über die Zukunft zu sprechen</h3>
<table class="gram"><thead><tr><th>Form</th><th>Verwendung</th><th>Beispiel</th></tr></thead><tbody>
<tr><td><b>will</b> + Grundform</td><td>spontane Entscheidung, Angebot, Versprechen, Vermutung/Meinung</td><td><i>The printer is empty? I<u>'ll get</u> some paper.</i><br><i>I think robots <u>will do</u> many jobs.</i></td></tr>
<tr><td><b>going to</b> + Grundform</td><td>Plan, Absicht (schon vorher entschieden); Vorhersage mit sichtbarem Anzeichen</td><td><i>I<u>'m going to apply</u> for an apprenticeship.</i><br><i>Look at those clouds – it<u>'s going to rain</u>.</i></td></tr>
<tr><td><b>present progressive</b></td><td>feste Verabredung mit Zeit/Ort</td><td><i>We<u>'re meeting</u> the client at 3 p.m. tomorrow.</i></td></tr>
<tr><td><b>simple present</b></td><td>Fahrpläne, Programme, Öffnungszeiten</td><td><i>The train <u>leaves</u> at 7:15.</i></td></tr>
</tbody></table>

<h3>Keine Zukunftsform in Zeitsätzen</h3>
<p>Nach <b>when, as soon as, before, after, until, if</b> steht das <b>simple present</b>, obwohl die Zukunft gemeint ist.</p>
${ex("I'll call you <u>as soon as</u> the parcel <u>arrives</u>. (nicht: <s>will arrive</s>)")}

<h3>Für Profis: future progressive und future perfect</h3>
${ex("This time tomorrow I <u>will be sitting</u> on the plane.", "wird zu einem Zeitpunkt in der Zukunft gerade ablaufen")}
${ex("By Friday we <u>will have sold</u> 500 tickets.", "wird bis zu einem Zeitpunkt abgeschlossen sein")}
${tl({ aria: "Zeitstrahl: jetzt, dann ein Zeitraum in der Zukunft und ein Stichtag", now: 0.15, spans: [{ a: 0.4, b: 0.6, label: "will be sitting", wave: true }], dots: [{ at: 0.82, label: "will have sold" }, { at: 0.82, label: "Friday", below: true }] })}`,
    exercises: [
      {
        id: "m5e1", type: "match", xp: 10, title: "Welche Funktion?",
        prompt: "Ordne jedem Satz die passende Verwendung zu.",
        pairs: [
          ["I'll carry the boxes for you.", "Angebot / spontane Entscheidung"],
          ["Look at those clouds. It's going to rain.", "Vorhersage mit sichtbarem Anzeichen"],
          ["We're meeting the client at 3 p.m. tomorrow.", "feste Verabredung"],
          ["The train leaves at 7:15.", "Fahrplan"],
          ["I'm going to apply for an apprenticeship.", "Plan / Absicht"],
          ["I think robots will do many warehouse jobs one day.", "Meinung / Vermutung"]
        ]
      },
      {
        id: "m5e2", type: "choice", xp: 15, title: "Die passende Zukunft",
        prompt: "Wähle die Form, die am besten passt.",
        text: "A: The printer is out of paper. B: Don't worry, I [['ll get*|'m going to get]] some. Mr Okafor has booked his flight – he [[will fly|is flying*]] to Hamburg on Monday. The airport bus [[leaves*|is going to leave]] at 6:40 – it says so on the timetable. Be careful! That stack of boxes [[will|is going to*]] fall over! I'll call you as soon as I [[arrive*|will arrive]]."
      },
      {
        id: "m5e3", type: "gap", xp: 15, title: "E-Mail zur Messe",
        prompt: "Setze die Verben in einer passenden Zukunftsform ein. Die Hinweise im Text helfen dir.",
        hint: "„it's all arranged“ = feste Verabredung, „that's my plan“ = Absicht, nach „If“ kein will.",
        text: "Dear Priya, next week we {0} (present) our products at the logistics fair in Birmingham – it's all arranged. The fair {1} (open) at 9 a.m. on Tuesday. I {2} (bring) the brochures – that's my plan. If the stand {3} (not / be) ready on Monday evening, we {4} (call) the organisers. Don't worry, it {5} (be) a great event!",
        gaps: [["are presenting", "'re presenting", "are going to present", "'re going to present"], ["opens"], ["am going to bring", "'m going to bring"], ["is not", "isn't"], ["will call", "'ll call"], ["will be", "'ll be", "is going to be", "'s going to be"]]
      },
      {
        id: "m5e4", type: "transform", xp: 15, title: "Zeitsätze korrigieren",
        prompt: "Korrigiere die Sätze.",
        items: [
          { q: "When the parcel will arrive, I'll let you know.", a: ["When the parcel arrives, I'll let you know.", "When the parcel arrives, I will let you know.", "I'll let you know when the parcel arrives.", "I will let you know when the parcel arrives."] },
          { q: "We can't start before everyone will be here.", a: ["We can't start before everyone is here.", "We cannot start before everyone is here.", "We can't start until everyone is here.", "We cannot start until everyone is here."] },
          { q: "As soon as Tom will finish the update, he'll restart the server.", a: ["As soon as Tom finishes the update, he'll restart the server.", "As soon as Tom finishes the update, he will restart the server.", "As soon as Tom has finished the update, he'll restart the server.", "As soon as Tom has finished the update, he will restart the server.", "Tom will restart the server as soon as he finishes the update.", "Tom'll restart the server as soon as he finishes the update.", "Tom will restart the server as soon as he has finished the update."] }
        ]
      },
      {
        id: "m5e5", type: "mc", xp: 15, title: "Situationen",
        prompt: "Welche Antwort passt am besten zur Situation?",
        items: [
          { q: "Your friend says: “I'm so thirsty.” You answer spontaneously:", o: ["I'll get you some water.", "I'm getting you some water tomorrow.", "I get you some water."], a: 0 },
          { q: "You have already decided to study economics. You say:", o: ["I study economics next year.", "I'm going to study economics.", "I'll study economics, I've just decided."], a: 1 },
          { q: "Your dentist appointment is fixed for Thursday at 4 p.m.:", o: ["I'm seeing the dentist on Thursday.", "I see the dentist on Thursday, I think.", "I'll be see the dentist on Thursday."], a: 0 }
        ]
      },
      {
        id: "m5e6", type: "free", xp: 20, title: "Deine Pläne",
        prompt: "Schreibe 4–5 Sätze über deine Pläne nach dem Abitur. Verwende going to, will und mindestens einmal das present progressive für einen festen Termin.",
        model: `<p><i>After my A-levels I'm going to do an apprenticeship as a bank clerk. I have already applied, and I'm having an interview at a local bank next Wednesday. I think it will be hard work, but I'm sure I will learn a lot. Before I start, I'm going to travel to Ireland with two friends. Maybe I will study business later.</i></p>`,
        criteria: ["going to für Pläne, die schon feststehen.", "will für Vermutungen oder Meinungen (I think … will).", "present progressive für einen festen Termin.", "Keine Zukunftsform nach when / before / as soon as."]
      },
      {
        id: "m5e7", type: "gap", xp: 25, bonus: true, title: "Bonus: future progressive und future perfect",
        prompt: "Setze die Verben im future progressive (will be + -ing) oder future perfect (will have + 3. Form) ein.",
        text: "This time tomorrow I {0} (sit) on the plane to Dublin. By Friday we {1} (sell) 500 tickets. Please don't call at eight – we {2} (have) dinner then. By the end of the year Tom {3} (finish) his apprenticeship.",
        gaps: [["will be sitting", "'ll be sitting"], ["will have sold", "'ll have sold"], ["will be having", "'ll be having"], ["will have finished", "'ll have finished"]]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m6",
    title: "Conditionals",
    subtitle: "if-Sätze Typ 0 bis 3",
    scene: {
      who: "Mr Okafor",
      text: `Monday of week two. A big customer complains. Mr Okafor sighs: “If the parcel <i>had arrived</i> on time, we <i>wouldn't have lost</i> the order. If this <i>happens</i> again, we<i>'ll lose</i> the customer.”`
    },
    theory: `
<h3>Die vier Grundtypen</h3>
<table class="gram"><thead><tr><th>Typ</th><th>if-Satz</th><th>Hauptsatz</th><th>Bedeutung</th></tr></thead><tbody>
<tr><td>0</td><td>simple present</td><td>simple present</td><td>immer gültig, Fakten</td></tr>
<tr><td>1</td><td>simple present</td><td>will + Grundform</td><td>real möglich</td></tr>
<tr><td>2</td><td>simple past</td><td>would + Grundform</td><td>unwahrscheinlich / nur gedacht (jetzt)</td></tr>
<tr><td>3</td><td>past perfect</td><td>would have + 3. Form</td><td>nicht mehr möglich (Vergangenheit)</td></tr>
</tbody></table>
${ex("If you heat ice, it melts.", "Typ 0")}
${ex("If the delivery <u>is</u> late again, we <u>will lose</u> the customer.", "Typ 1")}
${ex("If I <u>were</u> the manager, I <u>would give</u> trainees more responsibility.", "Typ 2 – bin ich aber nicht")}
${ex("If Lena <u>had checked</u> the address, the parcel <u>wouldn't have gone</u> to Leeds.", "Typ 3 – ist aber passiert")}
<div class="warn"><b>Merksatz:</b> Im if-Satz steht kein <i>will</i> und kein <i>would</i>. <s>If I would have time…</s> → <i>If I <b>had</b> time…</i></div>
<div class="tip"><b>Komma:</b> Steht der if-Satz vorne, setzt du ein Komma. Steht er hinten, meist nicht.<br><b>If I were you…</b> ist die typische Form für Ratschläge (<i>If I was you</i> hörst du in der Umgangssprache auch).<br><b>unless</b> = if … not: <i>Unless you hurry, you'll miss the train.</i></div>

<h3>Für Profis: mixed conditionals</h3>
${ex("If I <u>had studied</u> IT, I <u>would be</u> a programmer now.", "Vergangenheit → Folge jetzt")}`,
    exercises: [
      {
        id: "m6e1", type: "categorize", xp: 10, title: "Welcher Typ?",
        prompt: "Ordne die Sätze dem richtigen Typ zu.",
        categories: ["Typ 1", "Typ 2", "Typ 3"],
        items: [
          ["If it rains, we'll stay inside.", 0],
          ["If you need help, I'll show you.", 0],
          ["If I had more money, I would buy a car.", 1],
          ["If she were here, she would know.", 1],
          ["If we had left earlier, we would have caught the train.", 2],
          ["If Tom hadn't forgotten the password, he could have logged in.", 2]
        ]
      },
      {
        id: "m6e2", type: "gap", xp: 15, title: "Typ 1 und 2",
        prompt: "Setze die Verben passend ein (Typ 1 oder Typ 2).",
        text: "If the delivery {0} (be) late again, we {1} (lose) the customer. If I {2} (be) the manager, I {3} (give) the trainees more responsibility. If Tom {4} (not / work) so hard, he wouldn't be so tired all the time.",
        gaps: [["is"], ["will lose", "'ll lose"], ["were", "was"], ["would give", "'d give"], ["did not work", "didn't work"]]
      },
      {
        id: "m6e3", type: "gap", xp: 15, title: "Typ 3: Hätte, hätte …",
        prompt: "Setze die Verben im conditional Typ 3 ein.",
        text: "If Lena {0} (check) the address, the parcel {1} (not / go) to the wrong city. We {2} (win) the contract if our offer {3} (be) cheaper.",
        gaps: [["had checked", "'d checked"], ["would not have gone", "wouldn't have gone"], ["would have won", "'d have won"], ["had been", "'d been"]]
      },
      {
        id: "m6e4", type: "transform", xp: 15, title: "Mit if umformulieren",
        prompt: "Drücke dasselbe mit einem if-Satz (oder mit unless) aus.",
        hint: "Überlege: Geht es um jetzt (Typ 2) oder um die Vergangenheit (Typ 3)?",
        items: [
          { q: "I don't have enough time, so I can't help you. (Typ 2)", a: ["If I had enough time, I could help you.", "If I had enough time, I would help you.", "I could help you if I had enough time.", "I would help you if I had enough time.", "If I had enough time, I would be able to help you."] },
          { q: "Lena missed the bus because she got up late. (Typ 3)", a: ["If Lena hadn't got up late, she wouldn't have missed the bus.", "If Lena had not got up late, she would not have missed the bus.", "Lena wouldn't have missed the bus if she hadn't got up late.", "Lena would not have missed the bus if she had not got up late.", "If Lena had got up earlier, she wouldn't have missed the bus.", "If Lena had got up earlier, she would not have missed the bus.", "Lena wouldn't have missed the bus if she had got up earlier."] },
          { q: "If you don't hurry, you'll miss the train. (unless)", a: ["Unless you hurry, you'll miss the train.", "Unless you hurry, you will miss the train.", "You'll miss the train unless you hurry.", "You will miss the train unless you hurry."] }
        ]
      },
      {
        id: "m6e5", type: "tf", xp: 10, title: "Richtig oder falsch?",
        prompt: "Ist der Satz grammatisch korrekt?",
        labels: ["korrekt", "fehlerhaft"],
        items: [
          ["If I would have time, I would help you.", false, "Kein would im if-Satz: If I had time, I would help you."],
          ["If I were you, I'd ask for a pay rise.", true],
          ["If you heat water to 100 °C, it boils.", true],
          ["If you will call me, I answer.", false, "Richtig: If you call me, I'll answer."],
          ["If we had left earlier, we would have caught the train.", true]
        ]
      },
      {
        id: "m6e6", type: "free", xp: 20, title: "Schulleitung für einen Tag",
        prompt: "Was würdest du tun, wenn du einen Tag lang Schulleiterin oder Schulleiter wärst? Schreibe 3–4 Sätze im conditional Typ 2 und einen Satz im Typ 3 über etwas, das du in der Vergangenheit anders gemacht hättest.",
        model: `<p><i>If I were head teacher for a day, I would start lessons at nine o'clock. I would also buy new laptops for every classroom. If students had a problem, they could talk to me in the canteen. The school would be much greener if we planted more trees. Looking back, if I had practised more vocabulary last year, I would have got a better mark in my English exam.</i></p>`,
        criteria: ["Typ 2: if + simple past, Hauptsatz mit would / could + Grundform.", "Typ 3: if + past perfect, Hauptsatz mit would have + 3. Form.", "Kein will oder would im if-Satz."]
      },
      {
        id: "m6e7", type: "mc", xp: 25, bonus: true, title: "Bonus: mixed conditionals",
        prompt: "Wähle die richtige Form.",
        items: [
          { q: "If I had studied IT, I ___ a programmer now.", o: ["would be", "would have been", "will be"], a: 0, e: "Vergangenheit (had studied) mit Folge in der Gegenwart (now) → would be." },
          { q: "If she weren't so shy, she ___ the presentation yesterday.", o: ["would give", "would have given", "gave"], a: 1, e: "Dauerhafte Eigenschaft (jetzt) mit Folge in der Vergangenheit (yesterday) → would have given." },
          { q: "If Tom hadn't missed the train, he ___ here with us now.", o: ["would have been", "will be", "would be"], a: 2 }
        ]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m7",
    title: "Passive voice",
    subtitle: "Wenn die Handlung wichtiger ist als die Person",
    scene: {
      who: "Tom",
      text: `Tom shows Lena the warehouse: “Every parcel <i>is scanned</i> twice. The robots <i>were bought</i> last year, and right now a new conveyor belt <i>is being installed</i>.”`
    },
    theory: `
<h3>Wann das Passiv?</h3>
<p>Im <b>Passiv</b> steht die Handlung oder das Ergebnis im Mittelpunkt – nicht, <i>wer</i> etwas tut. Das ist typisch für Prozessbeschreibungen, Berichte und Nachrichten.</p>
${ex("<b>Active:</b> The robot scans the parcel.")}
${ex("<b>Passive:</b> The parcel <u>is scanned</u> (by the robot).")}
<div class="rule"><b>Bildung:</b> Form von <b>be</b> + 3. Form (past participle). Nur <i>be</i> zeigt die Zeitform an.</div>
<table class="gram"><thead><tr><th>Zeitform</th><th>Passiv</th></tr></thead><tbody>
<tr><td>simple present</td><td>The parcels <u>are packed</u>.</td></tr>
<tr><td>present progressive</td><td>The parcels <u>are being packed</u>.</td></tr>
<tr><td>simple past</td><td>The parcels <u>were packed</u>.</td></tr>
<tr><td>present perfect</td><td>The parcels <u>have been packed</u>.</td></tr>
<tr><td>past perfect</td><td>The parcels <u>had been packed</u>.</td></tr>
<tr><td>will-future</td><td>The parcels <u>will be packed</u>.</td></tr>
<tr><td>modal verb</td><td>The parcels <u>must be packed</u>.</td></tr>
</tbody></table>
<div class="tip"><b>by-agent:</b> Den Handelnden nennst du mit <i>by</i> nur, wenn er wichtig oder neu ist: <i>The app was developed <u>by two trainees</u>.</i> Bei <i>someone, people, they</i> lässt du ihn weg.</div>
<h3>Für Profis: Passiv mit zwei Objekten</h3>
${ex("They gave Lena a welcome pack. → <u>Lena was given</u> a welcome pack.", "Die Person wird meist zum Subjekt.")}`,
    exercises: [
      {
        id: "m7e1", type: "categorize", xp: 10, title: "Aktiv oder Passiv?",
        prompt: "Sortiere die Sätze.",
        categories: ["Active", "Passive"],
        items: [
          ["Tom scans the parcels.", 0],
          ["The customer has cancelled the order.", 0],
          ["Lena was typing the invoices.", 0],
          ["The parcels are scanned twice.", 1],
          ["The order has been cancelled.", 1],
          ["The goods were being loaded.", 1],
          ["The new app will be launched next month.", 1]
        ]
      },
      {
        id: "m7e2", type: "gap", xp: 15, title: "Wie ein Paket reist",
        prompt: "Beschreibe den Prozess im Passiv (simple present).",
        text: "First, the orders {0} (receive) online. Then the goods {1} (pick) from the shelves and {2} (pack) into boxes. Every box {3} (weigh), and a shipping label {4} (print). Finally, the parcels {5} (load) onto the lorries.",
        gaps: [["are received"], ["are picked"], ["are packed", "packed"], ["is weighed"], ["is printed"], ["are loaded"]]
      },
      {
        id: "m7e3", type: "transform", xp: 15, title: "Vom Aktiv ins Passiv",
        prompt: "Setze die Sätze ins Passiv. Behalte die Zeitform bei. Lass den Handelnden weg, wenn er unwichtig ist (somebody, they, we, you).",
        items: [
          { q: "Brightside employs 250 people.", a: ["250 people are employed by Brightside.", "Two hundred and fifty people are employed by Brightside."] },
          { q: "Somebody stole two laptops last night.", a: ["Two laptops were stolen last night.", "Last night two laptops were stolen."] },
          { q: "They are repairing the conveyor belt at the moment.", a: ["The conveyor belt is being repaired at the moment.", "At the moment the conveyor belt is being repaired."] },
          { q: "The IT team has updated the software.", a: ["The software has been updated by the IT team.", "The software has been updated."] },
          { q: "You must sign the contract.", a: ["The contract must be signed.", "The contract must be signed by you."] }
        ]
      },
      {
        id: "m7e4", type: "choice", xp: 15, title: "Zeitform im Passiv",
        prompt: "Wähle die richtige Passivform.",
        text: "The new warehouse [[built|was built*|has built]] in 2021. Right now, your parcel [[is delivered|delivers|is being delivered*]]. Hundreds of emails [[are sent*|send|are sending]] every day. Sorry, the meeting [[has cancelled|has been cancelled*|is cancelling]]. The results [[will be published*|will publish|will been published]] next week."
      },
      {
        id: "m7e5", type: "mc", xp: 15, title: "by oder nicht?",
        prompt: "Welcher Satz klingt in der Situation am natürlichsten?",
        items: [
          { q: "Nachricht: In der Nacht wurde eingebrochen, Täter unbekannt.", o: ["The office was broken into by someone last night.", "The office was broken into last night.", "Someone was broken into the office last night."], a: 1, e: "Der Täter ist unbekannt – „by someone“ bringt keine Information." },
          { q: "Die App wurde von zwei Auszubildenden entwickelt – das ist das Besondere.", o: ["The app was developed by two trainees.", "The app was developed.", "Two trainees were developed the app."], a: 0, e: "Hier ist die handelnde Person die wichtige neue Information." },
          { q: "Prozessbeschreibung für Kunden:", o: ["The workers check your order and the workers pack it.", "Your order is checked and packed.", "Your order checks and packs."], a: 1 }
        ]
      },
      {
        id: "m7e6", type: "free", xp: 20, title: "Einen Ablauf beschreiben",
        prompt: "Beschreibe einen Ablauf aus deiner Schule oder deinem Betrieb (z. B. wie eine Klassenarbeit organisiert wird oder wie ein Online-Einkauf abläuft) in 4–5 Sätzen im Passiv.",
        model: `<p><i>First, the date of the exam is announced about two weeks in advance. The tasks are written by the teacher and are checked by a colleague. On the day of the exam, the papers are handed out at the beginning of the lesson. Afterwards the tests are marked, and the results are discussed in class.</i></p>`,
        criteria: ["Mindestens vier Passivsätze (be + 3. Form).", "by nur dort, wo die Person wichtig ist.", "Verbindungswörter wie first, then, afterwards, finally."]
      },
      {
        id: "m7e7", type: "transform", xp: 25, bonus: true, title: "Bonus: Passiv mit zwei Objekten",
        prompt: "Setze ins Passiv. Mache die Person zum Subjekt und lass den Handelnden weg.",
        items: [
          { q: "They gave Lena a welcome pack.", a: ["Lena was given a welcome pack."] },
          { q: "Someone has offered Tom a job.", a: ["Tom has been offered a job.", "Tom's been offered a job."] },
          { q: "The manager showed the trainees the warehouse.", a: ["The trainees were shown the warehouse.", "The trainees were shown the warehouse by the manager."] }
        ]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m8",
    title: "Reported speech",
    subtitle: "Wiedergeben, was andere gesagt haben",
    scene: {
      who: "Priya",
      text: `Lena missed the staff meeting. Priya fills her in: “Mr Okafor said that they <i>were hiring</i> new staff. He asked us <i>if we had</i> any ideas for the trade fair, and he told us <i>not to be</i> late on Monday.”`
    },
    theory: `
<h3>Zeitverschiebung (backshift)</h3>
<p>Steht das einleitende Verb in der Vergangenheit (<i>said, told, asked</i>), rückt die Zeitform in der indirekten Rede meist eine Stufe zurück.</p>
<table class="gram"><thead><tr><th>Direkte Rede</th><th>Indirekte Rede</th></tr></thead><tbody>
<tr><td>simple present: <i>“I <u>work</u> …”</i></td><td>simple past: <i>he said he <u>worked</u> …</i></td></tr>
<tr><td>present progressive: <i>“We <u>are hiring</u>.”</i></td><td>past progressive: <i>they <u>were hiring</u></i></td></tr>
<tr><td>present perfect / simple past: <i>“I <u>have finished</u>.” / “I <u>finished</u>.”</i></td><td>past perfect: <i>she <u>had finished</u></i></td></tr>
<tr><td>will / can / may</td><td>would / could / might</td></tr>
<tr><td>must</td><td>had to (oder must)</td></tr>
</tbody></table>
<div class="tip"><b>Kein backshift nötig</b>, wenn das einleitende Verb im Präsens steht (<i>She says she is tired.</i>) oder wenn die Aussage immer noch gilt (<i>He said the company employs 250 people.</i>). Auch das simple past bleibt in der gesprochenen Sprache oft unverändert.</div>

<h3>Orts- und Zeitangaben anpassen</h3>
<p>today → that day · tomorrow → the next day · yesterday → the day before · next week → the following week · here → there · now → then · ago → before · this → that</p>

<h3>Fragen und Aufforderungen</h3>
${ex("“Where <u>do you live</u>?” → He asked me where <u>I lived</u>.", "Aussagesatz-Stellung, kein do/did, kein Fragezeichen")}
${ex("“<u>Have you</u> finished?” → She asked if / whether <u>I had</u> finished.", "Ja/Nein-Fragen mit if oder whether")}
${ex("“Please close the door.” → He asked me <u>to close</u> the door.")}
${ex("“Don't be late!” → She told us <u>not to be</u> late.")}
<div class="warn"><b>say oder tell?</b> <i>tell</i> braucht eine Person: <i>He <b>told me</b> that …</i> – <i>He <b>said</b> (to me) that …</i></div>`,
    exercises: [
      {
        id: "m8e1", type: "match", xp: 10, title: "Zeit- und Ortsangaben",
        prompt: "Welche Angabe steht in der indirekten Rede?",
        pairs: [["today", "that day"], ["tomorrow", "the next day"], ["yesterday", "the day before"], ["next week", "the following week"], ["here", "there"], ["now", "then"], ["two days ago", "two days before"], ["this", "that"]]
      },
      {
        id: "m8e2", type: "gap", xp: 15, title: "Was wurde gesagt?",
        prompt: "Vervollständige die indirekte Rede mit backshift.",
        text: "“I work in the finance team,” said Sam.\n→ Sam said that he {0} in the finance team.\n“We are hiring new staff,” said Mr Okafor.\n→ Mr Okafor said that they {1} new staff.\n“I have finished the report,” Priya said.\n→ Priya said that she {2} the report.\n“The shipment will arrive late,” said Tom.\n→ Tom said that the shipment {3} late.\n“I can't come to the meeting,” said Lena.\n→ Lena said that she {4} to the meeting.",
        gaps: [["worked"], ["were hiring"], ["had finished", "'d finished"], ["would arrive", "'d arrive"], ["could not come", "couldn't come"]]
      },
      {
        id: "m8e3", type: "transform", xp: 15, title: "Fragen wiedergeben",
        prompt: "Gib die Fragen in indirekter Rede wieder.",
        hint: "Aussagesatz-Stellung: Subjekt vor Verb – und kein do/did.",
        items: [
          { q: "“Where do you live?” Tom asked Lena.", a: ["Tom asked Lena where she lived.", "Tom asked Lena where she lives."] },
          { q: "“Have you ever been to London?” Priya asked me.", a: ["Priya asked me if I had ever been to London.", "Priya asked me whether I had ever been to London.", "Priya asked me if I'd ever been to London.", "Priya asked me whether I'd ever been to London."] },
          { q: "“When will the lorry arrive?” the customer asked.", a: ["The customer asked when the lorry would arrive."] }
        ]
      },
      {
        id: "m8e4", type: "transform", xp: 15, title: "Aufforderungen wiedergeben",
        prompt: "Gib die Aufforderungen mit asked / told + to-Infinitiv wieder.",
        items: [
          { q: "“Please close the door,” Mr Okafor said to Lena. (asked)", a: ["Mr Okafor asked Lena to close the door."] },
          { q: "“Don't touch the machine!” the supervisor said to us. (told)", a: ["The supervisor told us not to touch the machine."] },
          { q: "“Send me the file by Friday,” Priya said to Tom. (told)", a: ["Priya told Tom to send her the file by Friday.", "Priya told Tom to send the file to her by Friday."] }
        ]
      },
      {
        id: "m8e5", type: "mc", xp: 10, title: "Welcher Satz ist korrekt?",
        prompt: "Wähle die korrekte indirekte Rede.",
        items: [
          { q: "“Where do you work?”", o: ["She asked me where did I work.", "She asked me where I worked.", "She asked me where do I work."], a: 1 },
          { q: "“Are you ready?”", o: ["He asked if we were ready.", "He asked were we ready.", "He said us if we were ready."], a: 0 },
          { q: "“I'm tired.”", o: ["She told that she was tired.", "She said me that she was tired.", "She told me that she was tired."], a: 2 }
        ]
      },
      {
        id: "m8e6", type: "free", xp: 20, title: "Ein Gespräch zusammenfassen",
        prompt: "Gib das Gespräch in indirekter Rede wieder (4–6 Sätze).\n\nPriya: “I'm going to Leeds tomorrow. Can you look after my plants?”\nLena: “Sure. Do I need to water them every day?”\nPriya: “No, twice a week is enough. Don't give them too much water.”",
        model: `<p><i>Priya told Lena that she was going to Leeds the next day. She asked Lena if she could look after her plants. Lena agreed and asked whether she needed to water them every day. Priya said that twice a week was enough. She told Lena not to give them too much water.</i></p>`,
        criteria: ["Backshift: am going → was going, can → could, need → needed, is → was.", "tomorrow → the next day.", "Fragen mit if/whether und Aussagesatz-Stellung.", "Aufforderung mit told … not to …"]
      },
      {
        id: "m8e7", type: "mc", xp: 25, bonus: true, title: "Bonus: Reporting verbs",
        prompt: "Verben wie promise, suggest oder admit haben ihre eigene Struktur. Wähle die richtige Fortsetzung.",
        items: [
          { q: "“I'll send the files tonight,” Tom said. → Tom promised ___", o: ["sending the files that night.", "to send the files that night.", "send the files that night."], a: 1 },
          { q: "“Let's take a break,” said Priya. → Priya suggested ___", o: ["taking a break.", "to take a break.", "take a break."], a: 0 },
          { q: "“I broke the printer,” Tom said. → Tom admitted ___", o: ["to break the printer.", "break the printer.", "breaking the printer."], a: 2 }
        ]
      }
    ]
  });
})();
