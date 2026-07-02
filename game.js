/**
 * SEND IT 💗 — Game Engine
 * ─────────────────────────────────────────────────────────────────
 * Loads map from JSON, sprites from PNG (with canvas fallbacks),
 * handles movement, collision, heart collection, and win state.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

// ── Constants ────────────────────────────────────────────────────
const CANVAS_W   = 680;
const CANVAS_H   = 420;
const MOVE_DELAY = 130;  // ms between tile steps

// ── Canvas setup ─────────────────────────────────────────────────
const canvas = document.getElementById('game-canvas');
const ctx    = canvas.getContext('2d');
canvas.width  = CANVAS_W;
canvas.height = CANVAS_H;
ctx.imageSmoothingEnabled = false;

// ── Global state ─────────────────────────────────────────────────
let MAP_DATA   = null;   // parsed JSON
let images     = {};     // loaded Image objects keyed by name
let gameState  = 'loading'; // loading | start | playing | message | won

let player = { col: 2, row: 9, dir: 'down', animFrame: 0, animTimer: 0, steps: 0 };
let hearts = [];
let heartsCollected = 0;
let pendingMessage  = null;
let moveTimer       = 0;

const keys = { left: false, right: false, up: false, down: false };

// ── Mobile controls (exposed globally for inline handlers) ────────
window.mobileDown = dir => { keys[dir] = true; };
window.mobileUp   = dir => { keys[dir] = false; };

// ── Keyboard ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (gameState === 'message') { dismissMessage(); return; }
  if (gameState !== 'playing') return;
  const map = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down',
                a:'left', d:'right', w:'up', s:'down' };
  if (map[e.key]) { keys[map[e.key]] = true; e.preventDefault(); }
});

document.addEventListener('keyup', e => {
  const map = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down',
                a:'left', d:'right', w:'up', s:'down' };
  if (map[e.key]) keys[map[e.key]] = false;
});

canvas.addEventListener('click', () => {
  if (gameState === 'message') dismissMessage();
});

// ── Start button ──────────────────────────────────────────────────
document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  gameState = 'playing';
});

// ── Boot: load images then kick off game ─────────────────────────
loadImages().then(() => {
  initGame();
  requestAnimationFrame(loop);
});

// ── Map data embedded directly — no fetch needed ─────────────────
// Tile IDs: 0=water, 1=pier, 2=sidewalk, 3=path, 4=grass, 5=road, 6=building
// W=water, P=pier, S=sidewalk, T=path(trail), G=grass, R=road, B=building
MAP_DATA = {
  meta: { name: "West Side Highway", tileSize: 20, cols: 34, rows: 21 },
  layers: {
    ground: [
      // rows 0-6: river/water
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0],
      [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0],
      [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0],
      // row 7: pier
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      // rows 8-9: path (bike lane — main walkable area)
      [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
      // row 10: road
      [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
      // rows 11-13: grass
      [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
      // rows 14-15: sidewalk
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      // rows 16-20: buildings
      [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
      [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
      [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
      [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
      [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6]
    ],
    collision: { data: [
      // 0=walkable, 1=blocked
      // rows 0-6: water — blocked
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
      [1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
      [1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
      [1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
      // row 7: pier — walkable
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      // rows 8-9: path — walkable
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      // row 10: road — walkable (player can cross)
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      // rows 11-13: grass — walkable (trees can be added as blocked spots)
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      // rows 14-15: sidewalk — walkable
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      // rows 16-20: buildings — blocked
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]}
  },
  objects: {
    playerStart: { col: 2, row: 9 },
    npc: { col: 31, row: 14, sprite: "andrea" },
    hearts: [
      { id: 1, col: 8,  row: 9,  title: "💗 Heart 1",  message: "Every day you make me smile. 🌟", collected: false },
      { id: 2, col: 18, row: 12, title: "💗 Heart 2",  message: "You are my best friend. 🤗", collected: false },
      { id: 3, col: 28, row: 14, title: "💗 Heart 3",    message: "You did it. Marathon ready.\nNow find Andrea and unlock your surprise 💌", collected: false }
    ]
  },
  winMessage: {
    title: "💌 You made it, Will!",
    message: "Happy 1 Year Anniversary 🎉\n\nThis past year with you has been my favorite adventure \nHere's to every next chapter together.\n\nI love you so much.\n— Andrea 💗"
  }
};

// ── Load images then start ────────────────────────────────────────
function loadImages() {
  const toLoad = Object.entries(window.SPRITES).map(([key, def]) => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload  = () => { images[key] = img; resolve(); };
      img.onerror = () => { images[key] = null; resolve(); };
      img.src = def.src;
    });
  });
  return Promise.all(toLoad);
}

// ─────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────

function initGame() {
  if (!MAP_DATA) return;

  // Player start position from JSON
  const ps = MAP_DATA.objects.playerStart;
  player.col = ps.col;
  player.row = ps.row;

  // Heart state from JSON
  hearts = MAP_DATA.objects.hearts.map(h => ({ ...h, collected: false }));

  gameState = 'start';
}

// ─────────────────────────────────────────────────────────────────
// MAIN LOOP
// ─────────────────────────────────────────────────────────────────

let lastTs = 0;
function loop(ts) {
  const dt = Math.min(ts - lastTs, 100); // cap at 100ms to avoid big jumps
  lastTs = ts;

  if (gameState === 'playing') update(dt);
  draw();

  requestAnimationFrame(loop);
}

// ─────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────

function update(dt) {
  moveTimer += dt;

  // Animate player regardless of movement
  player.animTimer += dt;
  const spriteDef = window.SPRITES.will;
  if (player.animTimer >= spriteDef.animSpeed) {
    player.animTimer = 0;
    const moving = keys.left || keys.right || keys.up || keys.down;
    if (moving) player.animFrame = (player.animFrame + 1) % spriteDef.frameCount;
    else         player.animFrame = 0;
  }

  if (moveTimer < MOVE_DELAY) return;
  moveTimer = 0;

  let dc = 0, dr = 0, newDir = player.dir;
  if      (keys.left)  { dc = -1; newDir = 'left';  }
  else if (keys.right) { dc =  1; newDir = 'right'; }
  else if (keys.up)    { dr = -1; newDir = 'up';    }
  else if (keys.down)  { dr =  1; newDir = 'down';  }
  else return;

  player.dir = newDir;

  const nc = player.col + dc;
  const nr = player.row + dr;

  if (isWalkable(nc, nr)) {
    player.col = nc;
    player.row = nr;
    player.steps++;
    document.getElementById('steps-hud').textContent = `steps: ${player.steps}`;
  }

  checkHearts();
  checkWin();
}

// ─────────────────────────────────────────────────────────────────
// COLLISION
// ─────────────────────────────────────────────────────────────────

function isWalkable(col, row) {
  if (!MAP_DATA) return false;
  const cols = MAP_DATA.meta.cols;
  const rows = MAP_DATA.meta.rows;
  if (col < 0 || col >= cols || row < 0 || row >= rows) return false;

  const collision = MAP_DATA.layers.collision.data;
  return collision[row][col] === 0;
}

// ─────────────────────────────────────────────────────────────────
// HEART COLLECTION
// ─────────────────────────────────────────────────────────────────

function checkHearts() {
  hearts.forEach((h, i) => {
    if (!h.collected && player.col === h.col && player.row === h.row) {
      h.collected = true;
      heartsCollected++;
      document.getElementById(`h${i + 1}`).textContent = '💗';
      queueMessage({ title: h.title, body: h.message });
    }
  });
}

// ─────────────────────────────────────────────────────────────────
// WIN CONDITION
// ─────────────────────────────────────────────────────────────────

function checkWin() {
  if (heartsCollected < 3) return;
  if (gameState === 'message') return; // don't steal focus while a heart message is up
  const npc = MAP_DATA.objects.npc;
  if (player.col === npc.col && player.row === npc.row && gameState !== 'won') {
    gameState = 'won';
    const win = MAP_DATA.winMessage;
    queueMessage({ title: win.title, body: win.message, final: true });
  }
}

// ─────────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────────

function queueMessage(msg) {
  pendingMessage = msg;
  gameState = 'message';
  const box = document.getElementById('message-box');
  box.style.display = 'block';

  const lines = msg.body.split('\n').map(l => `<span>${l}</span>`).join('<br>');
  box.innerHTML = `
    <strong>${msg.title}</strong>
    ${lines}
    <span class="hint">${msg.final ? '✨ tap to keep exploring ✨' : 'tap to continue'}</span>
  `;
}

function dismissMessage() {
  document.getElementById('message-box').style.display = 'none';
  gameState = pendingMessage?.final ? 'won' : 'playing';
  pendingMessage = null;
}

// ─────────────────────────────────────────────────────────────────
// DRAW
// ─────────────────────────────────────────────────────────────────

function draw() {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (!MAP_DATA) {
    ctx.fillStyle = '#0f0c29';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#ff6b9d';
    ctx.font = '14px monospace';
    ctx.fillText('Loading...', CANVAS_W/2 - 40, CANVAS_H/2);
    return;
  }

  drawMap();
  drawHearts();
  drawNPC();
  drawPlayer();
  if (gameState === 'won') drawWinSparkles();
}

// ── Map ───────────────────────────────────────────────────────────

// Fallback colors per tile ID (0–6) when PNG hasn't loaded
const FALLBACK_COLORS = [
  '#4449ff',  // 0 water
  '#a38359',  // 1 pier
  '#969490',  // 2 sidewalk
  '#c8c8c8',  // 3 path
  '#127819',  // 4 grass
  '#4b4b43',  // 5 road
  '#8a9bb5',  // 6 building
];

function drawMap() {
  const { cols, rows, tileSize } = MAP_DATA.meta;
  const groundLayer = MAP_DATA.layers.ground;
  const tileset = window.SPRITES.tileset;
  const img = images.tileset;
  const usePNG = img && !tileset.useFallback;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileId = groundLayer[r][c];
      const x = c * tileSize;
      const y = r * tileSize;

      if (usePNG) {
        // Each tile has its own source rect [sx, sw] in the PNG strip
        const tile = tileset.tiles[tileId];
        if (tile) {
          ctx.drawImage(img, tile.sx, 0, tile.sw, tileset.tileH, x, y, tileSize, tileSize);
        }
      } else {
        ctx.fillStyle = FALLBACK_COLORS[tileId] ?? '#333';
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  }

  // Landmark labels on top of tiles
  if (MAP_DATA.objects.landmarks) {
    MAP_DATA.objects.landmarks.forEach(lm => {
      const x = lm.col * MAP_DATA.meta.tileSize;
      const y = lm.row * MAP_DATA.meta.tileSize;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(x - 2, y - 13, 92, 14);
      ctx.fillStyle = '#ffe';
      ctx.font = '9px monospace';
      ctx.fillText(lm.label, x, y - 2);
    });
  }
}

// ── Hearts ────────────────────────────────────────────────────────

function drawHearts() {
  const tileSize = MAP_DATA.meta.tileSize;
  const t = Date.now() / 400;

  hearts.forEach(h => {
    if (h.collected) return;
    const x = h.col * tileSize + tileSize / 2;
    const y = h.row * tileSize + tileSize / 2;
    const bob = Math.sin(t + h.id) * 3;

    const img = images.heart;
    const def = window.SPRITES.heart;

    if (img && !def.useFallback) {
      ctx.drawImage(img, 0, 0, def.frameW, def.frameH, x - 10, y - 10 + bob, 20, 20);
    } else {
      // Fallback: draw heart shape
      drawFallbackHeart(x, y + bob, '#ff4d7a', 0.8 + Math.sin(t + h.id) * 0.1);
    }
  });
}

function drawFallbackHeart(cx, cy, color, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.bezierCurveTo(5, -10, 12, -4, 0,  6);
  ctx.bezierCurveTo(-12, -4, -5, -10, 0, -5);
  ctx.fill();
  ctx.restore();
}

// ── NPC (Andrea) ──────────────────────────────────────────────────

function drawNPC() {
  const npc = MAP_DATA.objects.npc;
  const tileSize = MAP_DATA.meta.tileSize;
  const x = npc.col * tileSize;
  const y = npc.row * tileSize - 6;

  const img = images.andrea;
  const def = window.SPRITES.andrea;

  if (img && !def.useFallback) {
    const row = def.rows['down'];
    const frame = gameState === 'won' ? 1 : 0;  // frame 2 on win
    ctx.drawImage(img,
      frame * def.frameW, row * def.frameH, def.frameW, def.frameH,
      x, y, def.frameW, def.frameH
    );
  } else {
    drawFallbackAndrea(x, y);
  }

  // Arrow + message prompt when all hearts collected
  if (heartsCollected === 3 && gameState !== 'won') {
    const bob = Math.sin(Date.now() / 300) * 3;
    ctx.fillStyle = '#ff6b9d';
    ctx.font = '16px monospace';
    ctx.fillText('💌', x + 2, y - 10 + bob);
  }
}

// ── Player (Will) ─────────────────────────────────────────────────

function drawPlayer() {
  const tileSize = MAP_DATA.meta.tileSize;
  const x = player.col * tileSize;
  const y = player.row * tileSize - 6;

  const img = images.will;
  const def = window.SPRITES.will;

  if (img && !def.useFallback) {
    const row = def.rows[player.dir] ?? 0;
    const sx  = player.animFrame * def.frameW;
    ctx.drawImage(img,
      sx, row * def.frameH, def.frameW, def.frameH,
      x, y, def.frameW, def.frameH
    );
  } else {
    drawFallbackWill(x, y);
  }
}

// ─────────────────────────────────────────────────────────────────
// FALLBACK PIXEL CHARACTERS
// (used when PNG sprite sheets are not yet loaded)
// ─────────────────────────────────────────────────────────────────

function drawFallbackWill(x, y) {
  // Short fringe hair (light brown), athletic blue clothes
  const px = x, py = y;
  ctx.fillStyle = '#4a7acc'; ctx.fillRect(px+3,  py+9,  14, 10); // body
  ctx.fillStyle = '#333';    ctx.fillRect(px+4,  py+19,  5,  5); // leg L
                             ctx.fillRect(px+11, py+19,  5,  5); // leg R
  ctx.fillStyle = '#111';    ctx.fillRect(px+3,  py+23,  6,  3); // shoe L
                             ctx.fillRect(px+10, py+23,  6,  3); // shoe R
  ctx.fillStyle = '#e8c99a'; ctx.fillRect(px+5,  py+3,  10,  9); // head
  ctx.fillStyle = '#a0724a'; ctx.fillRect(px+5,  py+2,  10,  4); // hair top
                             ctx.fillRect(px+5,  py+3,   4,  3); // fringe L
                             ctx.fillRect(px+11, py+3,   4,  3); // fringe R
  ctx.fillStyle = '#222';    ctx.fillRect(px+7,  py+7,   2,  2); // eye L
                             ctx.fillRect(px+11, py+7,   2,  2); // eye R
  ctx.fillStyle = '#4a7acc'; ctx.fillRect(px+1,  py+9,   3,  7); // arm L
                             ctx.fillRect(px+16, py+9,   3,  7); // arm R
  ctx.fillStyle = '#e8c99a'; ctx.fillRect(px+1,  py+16,  3,  3); // hand L
                             ctx.fillRect(px+16, py+16,  3,  3); // hand R
  ctx.fillStyle = '#e55';    ctx.fillRect(px+3,  py+24,  6,  1); // shoe stripe L
                             ctx.fillRect(px+10, py+24,  6,  1); // shoe stripe R
}

function drawFallbackAndrea(x, y) {
  // Long dark curly hair, preppy pink
  const px = x, py = y;
  ctx.fillStyle = '#d45a8a'; ctx.fillRect(px+3,  py+9,  14, 12); // body/skirt
  ctx.fillStyle = '#c8a080'; ctx.fillRect(px+5,  py+20,  4,  5); // leg L
                             ctx.fillRect(px+11, py+20,  4,  5); // leg R
  ctx.fillStyle = '#d4507a'; ctx.fillRect(px+4,  py+24,  5,  3); // shoe L
                             ctx.fillRect(px+11, py+24,  5,  3); // shoe R
  ctx.fillStyle = '#e8c99a'; ctx.fillRect(px+5,  py+3,  10,  9); // head
  ctx.fillStyle = '#3d1f0a'; ctx.fillRect(px+3,  py+2,  14,  5); // hair top
                             ctx.fillRect(px+3,  py+7,   3, 12); // hair L
                             ctx.fillRect(px+14, py+7,   3, 12); // hair R
                             ctx.fillRect(px+4,  py+18,  2,  3); // curl L
                             ctx.fillRect(px+14, py+18,  2,  3); // curl R
                             ctx.fillRect(px+3,  py+19,  3,  2); // curl end L
                             ctx.fillRect(px+14, py+19,  3,  2); // curl end R
  ctx.fillStyle = '#222';    ctx.fillRect(px+7,  py+7,   2,  2); // eye L
                             ctx.fillRect(px+11, py+7,   2,  2); // eye R
  ctx.fillStyle = '#c06060'; ctx.fillRect(px+8,  py+10,  4,  1); // smile
  ctx.fillStyle = '#d45a8a'; ctx.fillRect(px+1,  py+9,   3,  7); // arm L
                             ctx.fillRect(px+16, py+9,   3,  7); // arm R
  ctx.fillStyle = '#e8c99a'; ctx.fillRect(px+1,  py+16,  3,  3); // hand L
                             ctx.fillRect(px+16, py+16,  3,  3); // hand R
  ctx.fillStyle = '#fff';    ctx.fillRect(px+8,  py+9,   4,  2); // collar
}

// ── Win sparkles ──────────────────────────────────────────────────

function drawWinSparkles() {
  const t = Date.now() / 200;
  const tileSize = MAP_DATA.meta.tileSize;
  const cx = player.col * tileSize + 10;
  const cy = player.row * tileSize;
  for (let i = 0; i < 8; i++) {
    const sx = cx + Math.cos(t + i * 0.785) * 35;
    const sy = cy + Math.sin(t + i * 0.785) * 20;
    ctx.fillStyle = i % 2 === 0 ? '#ff6b9d' : '#ffd700';
    ctx.fillRect(sx, sy, 4, 4);
  }
}
