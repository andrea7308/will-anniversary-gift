# 💗 Send It — Anniversary Game

A pixel adventure game along the West Side Highway.
Collect 3 hearts, then find your surprise at the top.

---

## 🗂 Project Structure

```
will-game/
├── index.html                  ← game page (don't need to edit this)
├── game.js                     ← game engine (collision, movement, draw)
├── assets/
│   ├── sprites/
│   │   ├── spritesheet.js      ← sprite definitions + paths
│   │   ├── will.png            ← Will's sprite sheet (you create this)
│   │   ├── andrea.png          ← Andrea's sprite sheet (you create this)
│   │   └── heart.png           ← heart collectible (optional)
│   └── maps/
│       ├── westside.json       ← map data, collision, heart positions, messages
│       └── westside.png        ← tileset PNG (you create this)
```

---

### Characters (will.png / andrea.png)

Use **[Piskel](https://www.piskelapp.com/)** — free, browser-based, no install needed.

1. Go to piskelapp.com → **Create Sprite**
2. Set canvas size to **20×104** (20px wide, 26px × 4 rows tall)
3. Draw 4 rows, each row = one direction:
   - Row 1 (y=0):  facing **down**
   - Row 2 (y=26): facing **left**
   - Row 3 (y=52): facing **right**
   - Row 4 (y=78): facing **up**
4. Each row can have 1–4 animation frames side by side
   - If no animation: just draw 1 frame, set `frameCount: 1` in spritesheet.js
5. **Export → PNG** → save as `assets/sprites/will.png` (or `andrea.png`)
6. In `spritesheet.js`, set `useFallback: false` for that sprite

**Tips:**
- Will: short fringe hair, blue athletic clothes, red stripe on sneakers
- Andrea: long curly dark hair, preppy pink top, white collar detail
- Keep it simple! 20px wide characters don't need much detail

---

## 🗺 How to Make the Tileset

Your tileset is a **horizontal strip PNG** — all tiles in one row.

1. In Piskel, set canvas to **220×20** (11 tiles × 20px each)
2. Draw each tile left to right in this order:

| Position | Tile ID | Name |
|---|---|---|
| x=0   | 0  | river (blue water) |
| x=20  | 1  | pier (wooden brown) |
| x=40  | 2  | path (sandy beige) |
| x=60  | 3  | road (dark gray) |
| x=80  | 4  | grass (green) |
| x=100 | 5  | grass dark (darker green) |
| x=120 | 6  | sidewalk (light gray/beige) |
| x=140 | 7  | building (blue-gray) |
| x=160 | 8  | tree top (dark green) |
| x=180 | 9  | tree trunk (brown) |
| x=200 | 10 | water shimmer (lighter blue) |

3. Export as PNG → save as `assets/maps/westside.png`
4. In `spritesheet.js`, set `tileset.useFallback: false`

---

## ✏️ How to Edit the Map

Open `assets/maps/westside.json` in any text editor.

### Move hearts
```json
"hearts": [
  { "id": 1, "col": 8, "row": 9, "title": "...", "message": "..." },
  ...
]
```
Change `col` and `row` to move where a heart appears on the map.

### Edit messages
Each heart has a `title` and `message`. Use `\n` for line breaks.
The `winMessage` at the bottom is what shows when Will reaches you.

### Edit the collision map
`layers.collision.data` is a 2D grid — `1` = blocked, `0` = walkable.
Row 0 is the top of the map. Edit to match your tileset.

### Move characters
- `objects.playerStart` = where Will spawns
- `objects.npc` = where Andrea waits

---

## 🚀 Deploy to GitHub Pages

1. **Create a GitHub account** at github.com if you don't have one

2. **Create a new repository**
   - Click the `+` → New repository
   - Name it `will-game` (or anything you like)
   - Set to **Public**
   - Click **Create repository**

3. **Upload your files**
   - In your new repo, click **Add file → Upload files**
   - Drag in the entire `will-game/` folder contents
   - Commit changes

4. **Enable GitHub Pages**
   - Go to your repo → **Settings** → **Pages** (left sidebar)
   - Under "Source", select **Deploy from a branch**
   - Branch: `main`, Folder: `/ (root)`
   - Click **Save*

5. **Your game is live!** 🎉
   - URL will be: `https://YOUR-USERNAME.github.io/will-game/`
   - Takes ~1–2 minutes to go live after saving

6. **Send Will the link** 💌

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
