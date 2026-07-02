# 💗Anniversary Game

A pixel adventure game along the West Side Highway.
Collect 3 hearts.

---

## 🗂 Project Structure

```
will-game/
├── index.html                  ← game page 
├── game.js                     ← game engine (collision, movement, draw)
├── assets/
│   ├── sprites/
│   │   ├── spritesheet.js      ← sprite definitions + paths
│   │   ├── will.png            ← Will's sprite sheet 
│   │   ├── andrea.png          ← Andrea's sprite sheet 
│   │   └── heart.png           ← heart collectible 
│   └── maps/
│       ├── westside.json       ← map data, collision, heart positions, messages
│       └── westside.png        ← tileset PNG 
```

---

## 🔧 Customising Further

### Change canvas size
In `game.js`, edit:
```js
const CANVAS_W = 680;
const CANVAS_H = 420;
```
And update `meta.cols` / `meta.rows` in the JSON to match (`cols = W/20`, `rows = H/20`).

### Change movement speed
```js
const MOVE_DELAY = 130;  // ms between steps — lower = faster
```

### Add more hearts
Add entries to the `hearts` array in `westside.json` and add more `<span id="h4">🤍</span>` to the HUD in `index.html`.

### Add sound
Drop an `.mp3` in `assets/sounds/` and add to `game.js`:
```js
const bgMusic = new Audio('assets/sounds/theme.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;
// play on start button click
```

---

Made with 💗 by Andrea
