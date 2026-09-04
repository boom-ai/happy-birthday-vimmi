# Happy Birthday, Vimmi ❤️

A ridiculous, beautiful, slightly chaotic interactive birthday website. No backend. Just open it.

## Run it
```bash
cd birthday
python3 -m http.server 8080
# open http://localhost:8080
```
Or just double-click `index.html` (some browsers block `file://` audio — the server method is better).

## Add your photos
Drop files into `birthday/assets/` with these exact names:
- `photo1.jpg` … `photo6.jpg` (hero collage + gallery use these by default)

Anything missing shows a pretty placeholder card telling you the filename — so nothing ever looks broken.

## Add music (legally yours only)
Drop mp3s into `birthday/assets/`, e.g. `song1.mp3`, then list them in `script.js` → `CONFIG.musicPlaylist`. Nothing is bundled. No autoplay before LET'S GO (browser rule).

## Customize everything
Open `script.js` → `CONFIG` at the very top:
- `girlfriendName`, `myName` — auto-updates everywhere (hero, headings, footer, letter)
- `heroPhotos` — opening collage
- `memories` — gallery `{image, date, caption}`
- `timeline` — story entries (first one is 10 January / Computer lab; rest are placeholders)
- `loveLetter` — the letter (`[MY NAME]` auto-replaces)
- `openWhen` — sad / missYou / angry / smile messages
- `musicPlaylist` — songs
- Fun text arrays: `NO_TAUNTS`, `COMPLIMENTS` (top of script, below CONFIG)

Colors/fonts: top of `style.css` → `:root`.

## Easter eggs (don't spoil them 🤫)
1. Click the `V ❤ V` logo 5 times
2. Type `iloveyou` anywhere
3. Tiny `❤️` in the finale section
4. Tiny `👑` in the finale section (SRK bonus scene)

## Mobile
Runaway NO works with touch (`touchstart`/`pointerdown`), stays inside its arena, never scrolls the page. Cake candles tap-to-extinguish; mic blow is optional.

## Sounds (optional)
Drop into `birthday/assets/sounds/`: `click.mp3`, `heart.mp3`, `celebration.mp3`. Everything works silently without them.
