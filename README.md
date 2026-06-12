# Cosmo — Ruimteleren 🛸

Een educatief UFO-ruimtespel om te leren **rekenen**, **lezen** en **logisch nadenken**.
Het kind bestuurt een UFO door de ruimte, vliegt door gekleurde **beams** en lost korte mini-games op.
Elk juist antwoord = 1 ster. 100 sterren in een stelsel opent een **zwart gat** naar een nieuw stelsel.
Sterren ontgrendelen **UFO-upgrades** (kleur, spoor, vleugels, turbo, gouden UFO).

Gebaseerd op het analysedocument (fase 0/1 — POC/MVP). Mobile-first, **touch**, volledig Nederlands (Vlaams).

## Wat zit erin
- 🛸 Bestuurbare UFO (sleep-joystick), rondzwevende rotsen, zacht terugkaatsen (geen straf)
- 🟡 Beams voor **Rekenen** en **Logica** (10 vragen, procedureel gegenereerd) — **Lezen** = "komt binnenkort"
- ⭐ Sterren, zwart gat → 2e stelsel, UFO-upgrade-staffel (20/50/75/150/200) met aftel-chipje + feestmoment
- 🎯 **Arcade-tussenspel** (Alien-jacht): ontgrendelt **elke 50 sterren** (50, 100, 150, …). Na een spel verschijnt *"Extra Spel! Zoek het in de ruimte…"*; het portaal duikt op in de ruimte, je tikt aliens/ballonnen aan om te schieten (1 ster per stuk, rotsblokken als afleiding), en na één keer spelen is het weer weg tot de volgende 50. Subtiel aftel-chipje toont de voortgang.
- 🎚️ Moeilijkheidsgraad per **leerjaar (LJ1–LJ6)** én **semester** (begin/einde schooljaar) — kiesbaar bij de start en in het upgrade-paneel. Echt leerplan voor LJ1–LJ2 (zie [LEERPLAN.md](LEERPLAN.md))
- 💾 **Voortgang wordt opgeslagen** (localStorage) en hervat na sluiten
- 📲 **PWA**: toe te voegen aan beginscherm, werkt **offline**, voelt als een app
- 🔒 Kindveilig: geen advertenties, geen externe links, geen trackers, geen aankopen

## Lokaal draaien
Een statische site — je hebt enkel een lokale webserver nodig (service worker werkt niet via `file://`).

```bash
cd ufo-games
npm run dev          # start op http://localhost:3000
```

Of met Python (zonder npm):
```bash
python3 -m http.server 3000
```

Open daarna **http://localhost:3000** in de browser. Op desktop kun je ook met de pijltjestoetsen/WASD vliegen.

## Live zetten op Vercel
Het is een statische site, dus deploy is heel eenvoudig.

**Optie A — via de Vercel-website (aanrader, geen CLI nodig)**
1. Push deze map naar een GitHub-repo (zie hieronder).
2. Ga naar [vercel.com](https://vercel.com) → **Add New… → Project** → importeer de repo.
3. Framework Preset: **Other** · Build Command: *(leeg laten)* · Output Directory: **`.`** (root).
4. **Deploy**. Je krijgt een `https://…vercel.app`-link.

**Optie B — via de Vercel CLI**
```bash
npm i -g vercel
vercel            # eenmalig inloggen + project koppelen (preview-deploy)
vercel --prod     # live productie-deploy
```

### Naar GitHub pushen (voor optie A)
```bash
cd ufo-games
git init
git add -A
git commit -m "Cosmo — ruimteleren POC"
# maak een lege repo op github.com, dan:
git remote add origin https://github.com/<jouw-naam>/ufo-games.git
git push -u origin main
```

## Structuur
```
index.html              # de volledige game (canvas + mini-games + opslag)
manifest.webmanifest    # PWA-manifest (naam, iconen, fullscreen)
sw.js                   # service worker (offline cache)
icons/                  # app-iconen (192/512/180)
vercel.json             # Vercel-config (statische hosting)
package.json            # dev-server script
```

## Volgende stappen (uit het analysedocument)
- **Lezen-minigame** bouwen (AI-bootstrap + curatie van korte teksten + vragen)
- Geluid/muziek (aan/uit-knop)
- Meerdere profielen + ouder-dashboard
- Curriculumafstemming op de Vlaamse eindtermen per leerjaar
- Adaptieve moeilijkheidsgraad
