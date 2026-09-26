(function () {
  "use strict";
  const { ex, modules } = window.COURSE_PARTS;

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m9",
    title: "Relative clauses",
    subtitle: "who, which, that, whose, where, when",
    scene: {
      who: "Lena",
      text: `Lena writes a “Meet the team” post for the intranet: “Priya is the colleague <i>who</i> designed our new logo. Tom, <i>whose</i> brother also works here, keeps our servers running. The canteen is the place <i>where</i> everyone meets at one.”`
    },
    theory: `
<h3>Relativpronomen</h3>
<table class="gram"><thead><tr><th>Pronomen</th><th>bezieht sich auf</th><th>Beispiel</th></tr></thead><tbody>
<tr><td><b>who</b></td><td>Personen</td><td><i>the colleague <u>who</u> designed the logo</i></td></tr>
<tr><td><b>which</b></td><td>Dinge, Tiere</td><td><i>the scanner <u>which</u> keeps breaking down</i></td></tr>
<tr><td><b>that</b></td><td>Personen und Dinge (nur notwendige Relativsätze)</td><td><i>the app <u>that</u> we use</i></td></tr>
<tr><td><b>whose</b></td><td>Besitz (dessen/deren)</td><td><i>the trainee <u>whose</u> laptop was stolen</i></td></tr>
<tr><td><b>where</b></td><td>Orte</td><td><i>the warehouse <u>where</u> Lena works</i></td></tr>
<tr><td><b>when</b></td><td>Zeiten</td><td><i>the day <u>when</u> most orders come in</i></td></tr>
</tbody></table>

<h3>Notwendig oder zusätzlich?</h3>
<p><b>Defining relative clause</b> (notwendig): Er sagt, <i>wer oder was genau</i> gemeint ist. Keine Kommas.</p>
${ex("The trainee <u>who speaks Spanish</u> will help the customer.", "Welcher Azubi? Der, der Spanisch spricht.")}
<p><b>Non-defining relative clause</b> (zusätzlich): Er liefert nur eine Zusatzinformation. <b>Kommas</b>, kein <i>that</i>.</p>
${ex("Mr Okafor<u>, who started as a driver,</u> is now the manager.")}

<h3>Contact clauses – Relativpronomen weglassen</h3>
<p>Im notwendigen Relativsatz darfst du das Pronomen weglassen, wenn es <b>Objekt</b> ist (also danach ein neues Subjekt folgt).</p>
${ex("The report (<s>that</s>) <u>you</u> wrote is excellent.", "Objekt → weglassbar")}
${ex("The man <u>who</u> called yesterday is a customer.", "Subjekt → nicht weglassbar")}
<div class="warn"><b>who's ≠ whose:</b> <i>who's</i> = who is / who has. Für Besitz immer <b>whose</b>.</div>`,
    exercises: [
      {
        id: "m9e1", type: "choice", xp: 10, title: "Das richtige Pronomen",
        prompt: "Wähle das passende Relativpronomen.",
        text: "Priya is the colleague [[who*|which|whose]] designed the new logo. This is the scanner [[who|which*|where]] keeps breaking down. Tom, [[who's|who|whose*]] brother works in IT, helped me. The warehouse [[where*|which|when]] Lena works is huge. Monday is the day [[where|which|when*]] most orders come in. Brightside, [[that|which*|what]] was founded in 2008, has 250 employees."
      },
      {
        id: "m9e2", type: "tf", xp: 15, title: "Darf das Pronomen weg?",
        prompt: "Darf das Relativpronomen in Klammern weggelassen werden?",
        labels: ["ja", "nein"],
        items: [
          ["The report (that) you wrote is excellent.", true, "Objekt: Nach „that“ folgt das Subjekt „you“."],
          ["The man (who) called yesterday is a customer.", false, "„who“ ist hier Subjekt."],
          ["The app (which) we use is quite new.", true],
          ["My manager, (who) is from Lagos, speaks three languages.", false, "Non-defining clause – das Pronomen muss bleiben."],
          ["The people (that) I met at the fair were very friendly.", true]
        ]
      },
      {
        id: "m9e3", type: "transform", xp: 15, title: "Sätze verbinden",
        prompt: "Verbinde die Sätze mit einem Relativsatz.",
        items: [
          { q: "Lena met a customer. The customer had ordered 500 boxes.", a: ["Lena met a customer who had ordered 500 boxes.", "Lena met a customer that had ordered 500 boxes."] },
          { q: "This is the office. I work in it.", a: ["This is the office where I work.", "This is the office I work in.", "This is the office which I work in.", "This is the office that I work in.", "This is the office in which I work."] },
          { q: "Mr Okafor is very experienced. He started as a driver. (non-defining)", a: ["Mr Okafor, who started as a driver, is very experienced."] },
          { q: "That's the trainee. His laptop was stolen.", a: ["That's the trainee whose laptop was stolen.", "That is the trainee whose laptop was stolen."] }
        ]
      },
      {
        id: "m9e4", type: "categorize", xp: 15, title: "Notwendig oder Zusatzinfo?",
        prompt: "Handelt es sich um einen defining (notwendigen) oder non-defining (zusätzlichen) Relativsatz?",
        categories: ["defining", "non-defining"],
        items: [
          ["The parcel that arrived today is damaged.", 0],
          ["Students who hand in late lose points.", 0],
          ["Is this the laptop you bought?", 0],
          ["London, which is the capital, is very expensive.", 1],
          ["Our CEO, whose name is Ada Brown, gave a speech.", 1],
          ["Tom, who is 19, is an IT apprentice.", 1]
        ]
      },
      {
        id: "m9e5", type: "order", xp: 15, title: "Contact clauses bauen",
        prompt: "Bringe die Wörter in eine korrekte Reihenfolge.",
        items: [
          { words: "the email you sent me was very helpful", a: ["The email you sent me was very helpful"] },
          { words: "is this the jacket you were looking for", a: ["Is this the jacket you were looking for"] }
        ]
      },
      {
        id: "m9e6", type: "free", xp: 20, title: "Deine Schule vorstellen",
        prompt: "Stelle drei Personen, Orte oder Dinge aus deiner Schule oder deinem Betrieb vor (4–5 Sätze). Verwende who, which, whose und where – mindestens einmal einen non-defining relative clause mit Kommas.",
        model: `<p><i>Mr Braun is the teacher who organises our trips abroad. The library, which was renovated last year, is my favourite place to study. The cafeteria is the place where we meet in the breaks. Jana is the student whose idea won the school start-up competition.</i></p>`,
        criteria: ["who für Personen, which für Dinge, where für Orte, whose für Besitz.", "Ein non-defining relative clause mit zwei Kommas und ohne that.", "Kein Fehler wie „who's“ statt „whose“."]
      },
      {
        id: "m9e7", type: "transform", xp: 25, bonus: true, title: "Bonus: Formelle Präpositionen",
        prompt: "Schreibe die Sätze formeller: Präposition + whom / which am Anfang des Relativsatzes.",
        items: [
          { q: "The company I applied to has invited me for an interview.", a: ["The company to which I applied has invited me for an interview."] },
          { q: "The person you spoke to is our CEO.", a: ["The person to whom you spoke is our CEO."] },
          { q: "The project we are working on is confidential.", a: ["The project on which we are working is confidential."] }
        ]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m10",
    title: "Gerund and infinitive",
    subtitle: "-ing oder to?",
    scene: {
      who: "Lena",
      text: `Lena is preparing for a job interview back home. Priya helps: “Do you <i>enjoy working</i> in a team? Have you <i>decided to apply</i> to a bank? And <i>avoid talking</i> too fast!”`
    },
    theory: `
<h3>Gerund (-ing)</h3>
<p>Das <b>gerund</b> ist die -ing-Form, die wie ein Nomen benutzt wird.</p>
<ul class="clean">
<li>nach bestimmten Verben: <i>enjoy, avoid, finish, mind, suggest, keep, consider, risk, admit, deny, can't stand, give up</i><br>${ex("Lena <u>enjoys working</u> in a team.")}</li>
<li>nach Präpositionen: <i>interested in, good at, instead of, before, after, without, thank you for, look forward to</i><br>${ex("I'm looking forward to <u>hearing</u> from you.", "Achtung: „to“ ist hier Präposition!")}</li>
<li>als Subjekt: ${ex("<u>Working</u> night shifts is tiring.")}</li>
</ul>

<h3>Infinitiv mit to</h3>
<ul class="clean">
<li>nach bestimmten Verben: <i>want, would like, decide, hope, plan, agree, refuse, offer, promise, manage, afford, expect, learn</i><br>${ex("She <u>decided to apply</u> to a bank.")}</li>
<li>nach vielen Adjektiven: ${ex("It's <u>easy to use</u>.")}</li>
<li>um einen Zweck auszudrücken: ${ex("I came to Manchester <u>to improve</u> my English. (nicht: <s>for improving</s>)")}</li>
</ul>
<div class="rule"><b>make / let + Infinitiv ohne to:</b> <i>My boss <u>let me leave</u> early. – The trainer <u>made us repeat</u> the rules.</i></div>

<h3>Bedeutungsunterschied</h3>
<table class="gram"><thead><tr><th>Verb</th><th>+ to-Infinitiv</th><th>+ -ing</th></tr></thead><tbody>
<tr><td>stop</td><td><i>stopped to buy a coffee</i> – hielt an, um zu …</td><td><i>stopped drinking coffee</i> – hörte auf mit …</td></tr>
<tr><td>remember</td><td><i>remember to lock the door</i> – daran denken (Zukunft)</td><td><i>remember locking the door</i> – sich erinnern (Vergangenheit)</td></tr>
<tr><td>forget</td><td><i>forgot to call</i> – vergaß, zu …</td><td><i>never forget seeing …</i> – nie vergessen, dass …</td></tr>
<tr><td>try</td><td><i>try to open it</i> – sich bemühen</td><td><i>try turning it off</i> – ausprobieren</td></tr>
</tbody></table>
<div class="tip"><b>used to do</b> = früher (Station 2) · <b>be / get used to doing</b> = an etwas gewöhnt sein / sich gewöhnen.</div>`,
    exercises: [
      {
        id: "m10e1", type: "categorize", xp: 10, title: "Verben sortieren",
        prompt: "Welche Verben stehen mit -ing, welche mit to-Infinitiv?",
        categories: ["+ -ing", "+ to-Infinitiv"],
        items: [["enjoy", 0], ["avoid", 0], ["finish", 0], ["suggest", 0], ["mind", 0], ["keep", 0], ["decide", 1], ["hope", 1], ["refuse", 1], ["manage", 1], ["afford", 1], ["promise", 1]]
      },
      {
        id: "m10e2", type: "gap", xp: 15, title: "Lenas Bewerbung",
        prompt: "Setze das Verb als gerund oder to-Infinitiv ein.",
        text: "Lena is looking forward to {0} (start) her apprenticeship. She has decided {1} (apply) to a bank. She is good at {2} (talk) to customers, and she enjoys {3} (work) in a team. She can't afford {4} (make) mistakes in the interview, so she keeps {5} (practise) her answers.",
        gaps: [["starting"], ["to apply"], ["talking"], ["working"], ["to make"], ["practising", "practicing"]]
      },
      {
        id: "m10e3", type: "mc", xp: 15, title: "stop, remember, try",
        prompt: "Wähle die Form, die zur Bedeutung passt.",
        items: [
          { q: "On the way to work, Tom stopped ___ a coffee.", o: ["buying", "to buy"], a: 1, e: "Er hielt an, um Kaffee zu kaufen (Zweck)." },
          { q: "Please remember ___ the door when you leave.", o: ["to lock", "locking"], a: 0, e: "Daran denken, etwas in Zukunft zu tun." },
          { q: "I'll never forget ___ Manchester for the first time.", o: ["to see", "seeing"], a: 1, e: "Erinnerung an etwas, das passiert ist." },
          { q: "Priya stopped ___ energy drinks – they were bad for her sleep.", o: ["drinking", "to drink"], a: 0, e: "Sie hörte damit auf." },
          { q: "The printer isn't working. Have you tried ___ it off and on again?", o: ["to turn", "turning"], a: 1, e: "Etwas ausprobieren, um zu sehen, ob es hilft." }
        ]
      },
      {
        id: "m10e4", type: "choice", xp: 15, title: "Präposition, make und let",
        prompt: "Wähle die richtige Form.",
        text: "Thank you for [[helping*|to help|help]] me. My boss let me [[leave*|to leave|leaving]] early on Friday. The trainer made us [[repeat*|to repeat|repeating]] the safety rules. I came to Manchester [[for improving|to improve*|improving]] my English. [[Work|Worked|Working*]] night shifts is really tiring."
      },
      {
        id: "m10e5", type: "transform", xp: 15, title: "Typische Fehler",
        prompt: "Korrigiere die Sätze.",
        items: [
          { q: "I'm used to get up early.", a: ["I'm used to getting up early.", "I am used to getting up early."] },
          { q: "She suggested to meet at ten.", a: ["She suggested meeting at ten.", "She suggested that we meet at ten.", "She suggested that we should meet at ten.", "She suggested we meet at ten."] },
          { q: "We decided taking the train.", a: ["We decided to take the train."] },
          { q: "Do you mind to wait a moment?", a: ["Do you mind waiting a moment?", "Do you mind waiting for a moment?"] }
        ]
      },
      {
        id: "m10e6", type: "free", xp: 20, title: "Tell me about yourself",
        prompt: "Beantworte die typische Vorstellungsgesprächsfrage „Tell me about yourself.“ in 4–6 Sätzen. Verwende mindestens drei gerunds und drei to-Infinitive.",
        model: `<p><i>I'm in my final years at a vocational upper school, and I enjoy working with numbers. I'm interested in learning how companies make decisions. Last summer I decided to do an internship at a tax office, and I managed to organise their paper archive. I'm good at explaining things to others, so I often help classmates. In the future I hope to become a bank clerk, and I would like to start my apprenticeship next year.</i></p>`,
        criteria: ["Mindestens drei gerunds (z. B. enjoy working, interested in learning, good at explaining).", "Mindestens drei to-Infinitive (z. B. decided to do, hope to become, would like to start).", "Die Antwort passt inhaltlich zu einem Vorstellungsgespräch."]
      },
      {
        id: "m10e7", type: "mc", xp: 25, bonus: true, title: "Bonus: used to oder be used to?",
        prompt: "Wähle die richtige Form.",
        items: [
          { q: "She ___ in a bakery, but now she's a student.", o: ["used to work", "is used to working", "is used to work"], a: 0 },
          { q: "After three weeks, Lena ___ the traffic on the left.", o: ["used to", "has got used to", "use to"], a: 1 },
          { q: "Night-shift workers ___ at strange times.", o: ["are used to sleeping", "used to sleeping", "are used to sleep"], a: 0 }
        ]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m11",
    title: "Adjectives and adverbs",
    subtitle: "Formen, Stellung und Steigerung",
    scene: {
      who: "Mr Okafor",
      text: `Brightside needs new packing machines. Lena compares three offers. Mr Okafor: “Offer C is <i>faster</i> and <i>cheaper</i> than A. Read the small print <i>carefully</i>, though!”`
    },
    theory: `
<h3>Adjektiv oder Adverb?</h3>
<p>Das <b>Adjektiv</b> beschreibt ein Nomen – oder steht nach <i>be, seem, look, feel, sound, taste, smell, become, get</i>. Das <b>Adverb</b> beschreibt ein Verb, ein Adjektiv oder einen ganzen Satz.</p>
${ex("Lena is a <u>careful</u> driver. – Lena drives <u>carefully</u>.")}
${ex("The software looks <u>good</u>. – The software works <u>well</u>.")}
<div class="rule"><b>Bildung:</b> meist Adjektiv + <b>-ly</b> (quick → quickly) · -y → -ily (easy → easily) · -le → -ly (gentle → gently) · -ic → -ically (automatic → automatically)<br><b>Unregelmäßig:</b> good → <b>well</b> · fast → fast · hard → hard · late → late</div>
<div class="warn"><b>Falsche Freunde:</b> <i>hardly</i> = kaum · <i>lately</i> = in letzter Zeit</div>

<h3>Steigerung</h3>
<table class="gram"><thead><tr><th></th><th>Komparativ</th><th>Superlativ</th></tr></thead><tbody>
<tr><td>einsilbig: cheap</td><td>cheaper</td><td>the cheapest</td></tr>
<tr><td>zweisilbig auf -y: easy</td><td>easier</td><td>the easiest</td></tr>
<tr><td>mehrsilbig: expensive</td><td>more expensive</td><td>the most expensive</td></tr>
<tr><td>good / bad / far</td><td>better / worse / further</td><td>the best / the worst / the furthest</td></tr>
</tbody></table>
<p><b>Vergleiche:</b> <i>as cheap <u>as</u></i> (genauso) · <i>not as fast as</i> (nicht so … wie) · <i>cheaper <u>than</u></i> (nicht: <s>as</s>) · <i>The more you practise, the better you get.</i></p>`,
    exercises: [
      {
        id: "m11e1", type: "choice", xp: 10, title: "Adjektiv oder Adverb?",
        prompt: "Wähle die passende Form.",
        text: "Tom speaks Spanish very [[good|well*]]. The new software looks [[good*|well]]. Please drive [[careful|carefully*]] – the roads are icy. The meeting was [[extreme|extremely*]] long. She works [[hard*|hardly]] every day. The soup tastes [[delicious*|deliciously]]."
      },
      {
        id: "m11e2", type: "gap", xp: 15, title: "Drei Angebote vergleichen",
        prompt: "Vergleiche die Angebote. Setze die Adjektive in der richtigen Form ein (Grundform, Komparativ oder Superlativ).",
        table: { head: ["", "Price", "Delivery time"], rows: [["Offer A", "€2,400", "5 days"], ["Offer B", "€2,100", "8 days"], ["Offer C", "€2,100", "3 days"]] },
        text: "Offer B is {0} (cheap) than offer A. Offer C is just as {1} (cheap) as offer B. Offer C is the {2} (fast) of all three. Offer A is {3} (expensive) than offer C. If you need the machine quickly, offer B is the {4} (bad) choice. Overall, offer C is the {5} (good) option.",
        gaps: [["cheaper"], ["cheap"], ["fastest"], ["more expensive"], ["worst"], ["best"]]
      },
      {
        id: "m11e3", type: "transform", xp: 10, title: "Adverbien bilden",
        prompt: "Bilde das Adverb.",
        items: [
          { q: "careful", a: ["carefully"] },
          { q: "easy", a: ["easily"] },
          { q: "automatic", a: ["automatically"] },
          { q: "good", a: ["well"] },
          { q: "gentle", a: ["gently"] },
          { q: "fast", a: ["fast"] }
        ]
      },
      {
        id: "m11e4", type: "tf", xp: 15, title: "Richtig oder falsch?",
        prompt: "Ist der Satz grammatisch korrekt und sinnvoll?",
        labels: ["korrekt", "fehlerhaft"],
        items: [
          ["The more you practise, the better you get.", true],
          ["She is more older than me.", false, "older ist schon Komparativ: She is older than me."],
          ["This task is not as difficult as the last one.", true],
          ["London is more big than Manchester.", false, "bigger than"],
          ["“He hardly works” means that he works a lot.", false, "hardly = kaum. Er arbeitet also kaum."]
        ]
      },
      {
        id: "m11e5", type: "transform", xp: 15, title: "Anders vergleichen",
        prompt: "Formuliere den Vergleich wie angegeben um.",
        items: [
          { q: "The train is faster than the bus. (The bus … not as … as)", a: ["The bus is not as fast as the train.", "The bus isn't as fast as the train.", "The bus is not so fast as the train."] },
          { q: "No other product is as popular as the X1. (The X1 … superlative)", a: ["The X1 is the most popular product.", "The X1 is the most popular product of all."] },
          { q: "If you practise more, your English becomes better. (The more …, the better …)", a: ["The more you practise, the better your English becomes.", "The more you practice, the better your English becomes.", "The more you practise, the better your English gets.", "The more you practice, the better your English gets."] }
        ]
      },
      {
        id: "m11e6", type: "free", xp: 20, title: "Zwei Dinge vergleichen",
        prompt: "Vergleiche zwei Smartphones, zwei Ausbildungsberufe oder zwei Städte in 4–5 Sätzen. Verwende einen Komparativ, einen Superlativ, as … as und mindestens zwei Adverbien.",
        model: `<p><i>I compared two apprenticeships: bank clerk and industrial clerk. The bank job is more popular in my class, but the industrial clerk job is just as interesting. Industrial clerks often work more independently, and they learn quickly how a company really works. For me, the most important point is the team, and I got on really well with the team at the factory.</i></p>`,
        criteria: ["Ein Komparativ mit than oder ein Vergleich mit as … as.", "Ein Superlativ mit the.", "Mindestens zwei Adverbien (z. B. quickly, well, independently).", "Adjektive nach Verben wie be/look/seem – keine Adverbien."]
      },
      {
        id: "m11e7", type: "mc", xp: 25, bonus: true, title: "Bonus: Knifflige Paare",
        prompt: "Wähle das richtige Wort.",
        items: [
          { q: "There were ___ complaints this month than last month.", o: ["less", "fewer"], a: 1, e: "Zählbares Nomen im Plural → fewer." },
          { q: "Have you seen Tom ___? He seems stressed.", o: ["late", "lately"], a: 1, e: "lately = in letzter Zeit." },
          { q: "For ___ information, please contact our office.", o: ["further", "farther"], a: 0, e: "further = weitere (auch im übertragenen Sinn)." },
          { q: "This is the ___ version of the app – it came out yesterday.", o: ["last", "latest"], a: 1, e: "latest = neueste; last = letzte (in einer Reihe, danach kommt keine mehr)." }
        ]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  modules.push({
    id: "m12",
    title: "Modal verbs",
    subtitle: "Können, müssen, dürfen, sollen",
    scene: {
      who: "Tom",
      text: `Safety training in the warehouse. The trainer says: “You <i>must</i> wear safety shoes. You <i>mustn't</i> use your phone near the forklifts. You <i>don't have to</i> wear a suit – jeans are fine.” Tom whispers: “You <i>should</i> listen, she checks later!”`
    },
    theory: `
<h3>Die wichtigsten Modalverben</h3>
<table class="gram"><thead><tr><th>Modalverb</th><th>Bedeutung</th><th>Beispiel</th></tr></thead><tbody>
<tr><td>can / could</td><td>Fähigkeit, Erlaubnis, höfliche Bitte</td><td><i>Can I use your stapler? – Could you help me?</i></td></tr>
<tr><td>may / might</td><td>Möglichkeit (vielleicht); may auch höfliche Erlaubnis</td><td><i>It might rain later.</i></td></tr>
<tr><td>must</td><td>Pflicht (oft vom Sprecher), logische Schlussfolgerung</td><td><i>You must wear safety shoes. – She must be tired.</i></td></tr>
<tr><td>have to</td><td>Pflicht von außen (Regeln, Umstände)</td><td><i>I have to work on Saturdays.</i></td></tr>
<tr><td>should / ought to</td><td>Rat, Empfehlung</td><td><i>You should take a break.</i></td></tr>
</tbody></table>
<div class="warn"><b>Wichtigster Unterschied:</b> <i>mustn't</i> = darf nicht (Verbot) · <i>don't have to / needn't</i> = muss nicht (keine Pflicht)<br><i>You <b>mustn't</b> smoke here.</i> – <i>You <b>don't have to</b> wear a suit.</i></div>

<h3>Ersatzformen für andere Zeiten</h3>
<table class="gram"><thead><tr><th>Modalverb</th><th>Vergangenheit</th><th>Zukunft / Perfekt</th></tr></thead><tbody>
<tr><td>can</td><td>could / was able to</td><td>will be able to / have been able to</td></tr>
<tr><td>must</td><td>had to</td><td>will have to / have had to</td></tr>
<tr><td>may (Erlaubnis)</td><td>was allowed to</td><td>will be allowed to</td></tr>
</tbody></table>

<h3>Für Profis: Vermutungen über die Vergangenheit</h3>
${ex("The parcel hasn't arrived. The driver <u>might have taken</u> the wrong road.", "vielleicht")}
${ex("She replied an hour ago, so she <u>must have read</u> the email.", "ganz sicher")}
${ex("You <u>should have told</u> me!", "Vorwurf: hättest du mal …")}`,
    exercises: [
      {
        id: "m12e1", type: "choice", xp: 10, title: "mustn't oder don't have to?",
        prompt: "Verbot oder keine Pflicht? Wähle die passende Form.",
        text: "You [[mustn't*|don't have to]] smoke in the warehouse – it's dangerous. Trainees [[mustn't|don't have to*]] wear a suit; jeans are fine. You [[mustn't|don't have to*]] print the email – I've already read it on screen. Visitors [[mustn't*|don't have to]] enter the loading area without a helmet."
      },
      {
        id: "m12e2", type: "match", xp: 10, title: "Was bedeutet das?",
        prompt: "Ordne jedem Satz seine Bedeutung zu.",
        pairs: [
          ["You should take a break.", "Rat"],
          ["You must wear safety shoes.", "Pflicht"],
          ["You mustn't use your phone near the forklifts.", "Verbot"],
          ["You don't have to come in on Saturday.", "keine Pflicht"],
          ["It might rain later.", "Möglichkeit"],
          ["Can I use your stapler?", "um Erlaubnis bitten"],
          ["She must be tired – she has worked twelve hours.", "logische Schlussfolgerung"]
        ]
      },
      {
        id: "m12e3", type: "gap", xp: 15, title: "Ersatzformen",
        prompt: "Setze die passende Ersatzform ein.",
        hint: "Modalverben haben keine eigenen Formen für Vergangenheit, Zukunft oder Perfekt – nutze had to, will be able to, was allowed to usw.",
        text: "Yesterday Lena {0} (must) stay late. Next year Tom {1} (can) drive the forklift on his own. When I was ten, I {2} (can) swim one kilometre. Last week the trainees {3} (may – Erlaubnis) visit the head office. Since I started this job, I {4} (must) work every second Saturday.",
        gaps: [["had to"], ["will be able to", "'ll be able to"], ["could", "was able to"], ["were allowed to"], ["have had to", "'ve had to"]]
      },
      {
        id: "m12e4", type: "transform", xp: 15, title: "Höflich und hilfreich",
        prompt: "Formuliere die Sätze wie angegeben.",
        items: [
          { q: "„Give me the file.“ – höflicher mit Could …?", a: ["Could you give me the file?", "Could you give me the file, please?", "Could you please give me the file?"] },
          { q: "„Open the window.“ – höflicher mit Would you mind …?", a: ["Would you mind opening the window?"] },
          { q: "Lena is always tired. Gib ihr einen Rat mit should (go to bed earlier).", a: ["Lena should go to bed earlier.", "She should go to bed earlier.", "You should go to bed earlier."] }
        ]
      },
      {
        id: "m12e5", type: "mc", xp: 15, title: "Vermutungen",
        prompt: "Wie sicher ist die Vermutung? Wähle das passende Modalverb.",
        items: [
          { q: "They ___ be in the office – all the lights are off.", o: ["must", "can't", "should"], a: 1, e: "Ziemlich sicher nicht → can't." },
          { q: "Tom has been coding for ten hours. He ___ be exhausted.", o: ["must", "can't", "mustn't"], a: 0, e: "Logische Schlussfolgerung → must." },
          { q: "I'm not sure where Priya is. She ___ be in the canteen.", o: ["must", "can't", "might"], a: 2, e: "Unsicher → might." }
        ]
      },
      {
        id: "m12e6", type: "free", xp: 20, title: "Regeln für Neue",
        prompt: "Schreibe fünf Regeln oder Tipps für neue Schülerinnen und Schüler an deiner Schule oder für neue Auszubildende in deinem Betrieb. Verwende must, mustn't, don't have to, should und can.",
        model: `<p><i>You must be on time for every lesson. You mustn't use your phone during exams. You don't have to bring your own laptop – the school has enough. You should join a club in your first term; it's a great way to meet people. You can ask the student council if you have any problems.</i></p>`,
        criteria: ["must für eine Pflicht, mustn't für ein Verbot.", "don't have to für „muss nicht“ – nicht mit mustn't verwechselt.", "should für einen Rat, can für eine Möglichkeit oder Erlaubnis.", "Nach Modalverben steht die Grundform ohne to (außer have to)."]
      },
      {
        id: "m12e7", type: "mc", xp: 25, bonus: true, title: "Bonus: Modalverben + have + 3. Form",
        prompt: "Wähle die richtige Form.",
        items: [
          { q: "The parcel hasn't arrived. The driver ___ the wrong address.", o: ["might have taken", "might took", "might have took"], a: 0 },
          { q: "You ___ me! I would have helped you.", o: ["should told", "should have told", "must have told"], a: 1 },
          { q: "Lena ___ the email – she replied to it an hour ago.", o: ["can't have read", "must have read", "should have read"], a: 1 }
        ]
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  const finalChallenge = {
    id: "final",
    title: "Final stop",
    subtitle: "Die gemischte Abschluss-Challenge",
    isFinal: true,
    scene: {
      who: "Mr Okafor",
      text: `Lena's last day. Mr Okafor hands her a reference letter: “You <i>have learned</i> so much here. If you <i>come</i> back one day, we<i>'ll</i> be happy to see you!” Time to show everything you know.`
    },
    theory: `<p>In dieser Station mischen sich alle Themen der Strecke. Lies jede Aufgabe genau: Welche Signalwörter gibt es? Welche Zeit ist gemeint? Wer tut etwas? Wenn du unsicher bist, springe zurück zur passenden Station und lies die Erklärung noch einmal nach.</p>
<div class="tip"><b>Tipp:</b> Bearbeite die Challenge erst, wenn du die meisten Stationen erledigt hast. Für das Abschluss-Abzeichen müssen alle drei Aufgaben gelöst sein.</div>`,
    exercises: [
      {
        id: "fe1", type: "mc", xp: 30, title: "Quer durch die Grammatik",
        prompt: "Wähle jeweils die richtige Lösung.",
        items: [
          { q: "Tom ___ in the IT department since 2024.", o: ["works", "has been working", "is working"], a: 1 },
          { q: "When Lena got to the platform, the train ___.", o: ["had already left", "has already left", "already leaves"], a: 0 },
          { q: "If I ___ you, I would accept the offer.", o: ["would be", "am", "were"], a: 2 },
          { q: "The new warehouse ___ by the mayor next spring.", o: ["will open", "will be opened", "is opening"], a: 1 },
          { q: "She asked me where ___.", o: ["did I live", "I lived", "do I live"], a: 1 },
          { q: "That's the customer ___ order got lost.", o: ["who's", "whose", "which"], a: 1 },
          { q: "I'm really looking forward to ___ you.", o: ["meet", "meeting", "have met"], a: 1 },
          { q: "You ___ come to the office tomorrow – you can work from home.", o: ["mustn't", "don't have to", "can't"], a: 1 },
          { q: "She speaks English very ___.", o: ["good", "well", "goodly"], a: 1 },
          { q: "Look at the traffic! We ___ be late.", o: ["are going to", "will to", "are"], a: 0 }
        ]
      },
      {
        id: "fe2", type: "transform", xp: 25, title: "Fehler finden und verbessern",
        prompt: "Jeder Satz enthält einen typischen Fehler. Schreibe ihn korrekt.",
        items: [
          { q: "I live in Manchester since three weeks.", a: ["I have lived in Manchester for three weeks.", "I've lived in Manchester for three weeks.", "I have been living in Manchester for three weeks.", "I've been living in Manchester for three weeks."] },
          { q: "If it will rain tomorrow, we will stay inside.", a: ["If it rains tomorrow, we will stay inside.", "If it rains tomorrow, we'll stay inside.", "We will stay inside if it rains tomorrow.", "We'll stay inside if it rains tomorrow."] },
          { q: "The parcels was delivered yesterday.", a: ["The parcels were delivered yesterday."] },
          { q: "He explained me the problem.", a: ["He explained the problem to me."] },
          { q: "She is more better at maths than me.", a: ["She is better at maths than me.", "She's better at maths than me.", "She is better at maths than I am.", "She's better at maths than I am."] }
        ]
      },
      {
        id: "fe3", type: "free", xp: 20, title: "Dein Rückblick",
        prompt: "Stell dir vor, du bist Lena. Schreibe eine kurze Dankes-E-Mail (6–8 Sätze) an Mr Okafor zum Ende des Praktikums. Verwende mindestens fünf verschiedene Grammatikthemen aus dieser Strecke (z. B. present perfect, simple past, if-Satz, Passiv, Relativsatz, gerund, Modalverb).",
        model: `<p><i>Dear Mr Okafor,<br>thank you very much for the last two weeks. I have learned a lot about logistics, and I have really enjoyed working with your team. On my first day I was quite nervous, but everyone helped me a lot. I will never forget the trade fair in Birmingham, which was the highlight of my placement. I was also impressed by how the parcels are scanned and packed so quickly. If I get the chance, I would love to come back for an apprenticeship. You should tell Tom that his coffee is the best in Manchester!<br>Best wishes,<br>Lena</i></p>`,
        criteria: ["Mindestens fünf verschiedene Grammatikthemen sind erkennbar.", "Zeitformen passen zu den Signalwörtern.", "Anrede, Dank und Grußformel passen zu einer E-Mail.", "Die Sätze sind verständlich und logisch verbunden."]
      }
    ]
  };

  /* ---------------------------------------------------------------- */
  const game = {
    levels: [
      { min: 0, title: "Visitor" },
      { min: 50, title: "Trainee" },
      { min: 120, title: "Apprentice" },
      { min: 220, title: "Assistant" },
      { min: 340, title: "Team Player" },
      { min: 480, title: "Specialist" },
      { min: 640, title: "Team Lead" },
      { min: 820, title: "Manager" },
      { min: 1020, title: "Director" },
      { min: 1240, title: "Grammar CEO" }
    ],
    avatars: [
      { id: "fox", icon: "🦊", name: "Fox", level: 1 },
      { id: "panda", icon: "🐼", name: "Panda", level: 1 },
      { id: "owl", icon: "🦉", name: "Owl", level: 2 },
      { id: "tiger", icon: "🐯", name: "Tiger", level: 3 },
      { id: "octopus", icon: "🐙", name: "Octopus", level: 4 },
      { id: "robot", icon: "🤖", name: "Robot", level: 5 },
      { id: "alien", icon: "👽", name: "Alien", level: 6 },
      { id: "unicorn", icon: "🦄", name: "Unicorn", level: 7 },
      { id: "dragon", icon: "🐲", name: "Dragon", level: 8 },
      { id: "crown", icon: "👑", name: "Royal", level: 10 }
    ],
    pets: [
      { id: "none", icon: "", name: "Kein Begleiter", level: 1 },
      { id: "chick", icon: "🐣", name: "Pip", level: 2, line: "Tschiep! Gut gemacht!" },
      { id: "dog", icon: "🐶", name: "Biscuit", level: 3, line: "Wuff! Weiter so!" },
      { id: "cat", icon: "🐱", name: "Earl Grey", level: 4, line: "Purr … sehr elegant gelöst." },
      { id: "turtle", icon: "🐢", name: "Shelly", level: 6, line: "Langsam, aber sicher – stark!" },
      { id: "parrot", icon: "🦜", name: "Polly", level: 8, line: "Polly says: brilliant!" },
      { id: "dragonpet", icon: "🐉", name: "Ember", level: 10, line: "Feurig gut!" }
    ],
    themes: [
      { id: "auto", name: "Automatisch", note: "hell oder dunkel wie dein Gerät", level: 1 },
      { id: "day", name: "Daylight", note: "hell", level: 1 },
      { id: "night", name: "Night Bus", note: "dunkel", level: 1 },
      { id: "seaside", name: "Seaside", note: "Blackpool-Blau", level: 3 },
      { id: "highlands", name: "Highlands", note: "Heide und Moos", level: 5 },
      { id: "neon", name: "Piccadilly Neon", note: "leuchtend", level: 7 },
      { id: "royal", name: "Royal", note: "Samt und Gold", level: 9 }
    ]
  };

  window.COURSE = {
    title: "The Grammar Line",
    modules: modules,
    finalChallenge: finalChallenge,
    game: game
  };
})();
