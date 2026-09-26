# The Grammar Line – Englische Grammatik wiederholen

Interaktiver Lernkurs für Englisch (berufliches Gymnasium, Jahrgangsstufe 11): 12 Grammatik-Stationen plus Abschluss-Challenge, 87 Aufgaben, XP, Level, Abzeichen und freischaltbare Avatare, Begleiter und Hintergründe. Nutzung ohne Anmeldung möglich; mit Konto wird der Fortschritt geräteübergreifend gespeichert. Lehrkräfte sehen die Lernstände im Lehrerbereich (`/teacher.html`).

Technik: statische Webseite (HTML/CSS/JavaScript, kein Build-Schritt) + eine Netlify Function + Netlify Blobs als Speicher. Kein Supabase, keine Datenbank-Einrichtung nötig.

---

## 1. Diese Dateien gehören ins GitHub-Repository

Den **gesamten Inhalt** des entpackten Ordners hochladen – und zwar so, dass `netlify.toml` und `package.json` direkt im Hauptverzeichnis des Repositorys liegen (nicht in einem Unterordner):

```
README.md
netlify.toml            ← Netlify-Einstellungen
package.json            ← lädt @netlify/blobs für die Serverfunktion
.gitignore
netlify/functions/api.mjs   ← Server: Konten, Fortschritt, Lehrerbereich
public/                 ← die eigentliche Webseite
  index.html            ← Kurs für Schülerinnen und Schüler
  teacher.html          ← Lehrerbereich
  favicon.svg
  css/style.css
  js/content.js, content2.js, content3.js   ← Kursinhalte und Aufgaben
  js/check.js           ← Antwortprüfung
  js/app.js, js/teacher.js
```

Nicht hochladen: einen Ordner `node_modules` (falls vorhanden) oder `.netlify`.

Tipp: Auf github.com ein neues Repository anlegen → „uploading an existing file“ → alle Dateien und Ordner per Drag-and-Drop hineinziehen → „Commit changes“. Achtung: Die versteckte Datei `.gitignore` ist optional; wenn sie nicht mit hochgeladen wird, ist das kein Problem.

## 2. GitHub-Repository mit Netlify verbinden

1. Bei [app.netlify.com](https://app.netlify.com) anmelden.
2. **Add new project → Import an existing project → GitHub** wählen und den Zugriff erlauben.
3. Das Repository auswählen.
4. Die Build-Einstellungen prüfen (siehe Punkt 3) und auf **Deploy** klicken.

## 3. Build- und Publish-Einstellungen

Die Einstellungen stehen bereits in `netlify.toml` und werden automatisch übernommen. Falls Netlify danach fragt:

| Feld | Wert |
|---|---|
| Base directory | *(leer lassen)* |
| Build command | *(leer lassen – oder `echo 'Kein Build nötig'`)* |
| Publish directory | `public` |
| Functions directory | `netlify/functions` |

Netlify installiert beim Deploy automatisch die Abhängigkeit `@netlify/blobs` aus `package.json`. Netlify Blobs muss nicht extra aktiviert werden.

## 4. Environment Variables

Es gibt genau **eine** Variable:

| Name | Inhalt |
|---|---|
| `TEACHER_CODE` | euer geheimer Zugangscode für den Lehrerbereich (frei wählbar) |

Weitere Schlüssel oder Variablen sind nicht nötig.

## 5. Lehrerzugang einrichten

1. In Netlify: **Project configuration → Environment variables → Add a variable**.
2. Key: `TEACHER_CODE`, Value: einen eigenen, schwer zu erratenden Code eintragen (Empfehlung: mindestens 12 Zeichen, z. B. mehrere Wörter mit Ziffern). Der Code steht nur in Netlify – nie im Repository oder im Quelltext der Webseite.
3. Danach **Deploys → Trigger deploy → Deploy project** ausführen, damit die Variable aktiv wird.
4. Lehrerbereich aufrufen: `https://<eure-seite>.netlify.app/teacher.html` (auch über den Link „Bereich für Lehrkräfte“ unten auf der Startseite).
5. Code eingeben und eine Klasse auswählen oder neu anlegen (z. B. `BGY 11a`). Neu angelegte Klassen werden den Schülerinnen und Schülern bei der Registrierung vorgeschlagen.

Im Lehrerbereich könnt ihr Lernstände je Klasse und je Station ansehen, als CSV exportieren, Klassen ändern, Passwörter zurücksetzen (eigenes oder automatisch erzeugtes Passwort), Fortschritte zurücksetzen und Konten löschen. Nach 10 falschen Code-Eingaben wird der Lehrer-Login für 10 Minuten gesperrt.

**So melden sich Schülerinnen und Schüler an:** Startseite → „Konto“ → „Konto anlegen“ → Nickname (kein voller Klarname), Klasse und Passwort. Ohne Konto funktioniert alles ebenfalls; der Fortschritt bleibt dann nur im jeweiligen Browser.

## 6. Spätere Änderungen und erneutes Deployment

- Jede Änderung, die ihr im GitHub-Repository speichert (Commit), löst automatisch ein neues Deployment aus. Nach 1–2 Minuten ist die neue Version online.
- **Gespeicherte Konten und Fortschritte bleiben bei neuen Deployments erhalten** (sie liegen in Netlify Blobs, nicht im Repository).
- Inhalte und Aufgaben stehen in `public/js/content.js`, `content2.js` und `content3.js`. Die Kennungen der Aufgaben (`id: "m1e3"` usw.) bitte **nicht ändern oder doppelt vergeben** – daran hängt der gespeicherte Fortschritt. Neue Aufgaben brauchen neue, eindeutige IDs.
- Wer den Lehrer-Code ändert, passt nur die Environment Variable an und löst danach ein neues Deployment aus. Bereits angemeldete Lehrkräfte bleiben bis zu 12 Stunden angemeldet.
- Wird das Projekt in Netlify gelöscht oder ein neues Netlify-Projekt angelegt, beginnt der Speicher leer.
- Aufbewahrung von Daten: Gespeichert werden Nickname, Klasse, ein verschlüsseltes Passwort (scrypt-Hash) und der Lernfortschritt inklusive eigener Freitext-Antworten. Konten lassen sich im Lehrerbereich löschen. Prüft bitte die Vorgaben eurer Schule zum Datenschutz, bevor ihr den Kurs mit Klassen nutzt.

## Hinweise zum Kurs

- Standard ist britisches Englisch; gängige amerikanische Schreibweisen und Kurzformen (z. B. `don't` / `do not`) werden bei der automatischen Prüfung akzeptiert.
- Längere Freitextaufgaben werden nicht automatisch bewertet: Die Lernenden vergleichen ihre Antwort mit einer Musterlösung und einer Checkliste und markieren sie selbst als erledigt.
- Wer eine Lösung ansieht, bevor die Aufgabe gelöst ist, kann sie trotzdem abschließen, erhält dafür aber keine XP.
