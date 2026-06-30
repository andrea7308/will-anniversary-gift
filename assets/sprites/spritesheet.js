/**
 * SPRITE DEFINITIONS
 * ─────────────────────────────────────────────────────────────────
 * Each character sprite sheet should be a PNG laid out like:
 *
 *   Row 0: walk DOWN  → [frame0, frame1, frame2, frame3]
 *   Row 1: walk LEFT  → [frame0, frame1, frame2, frame3]
 *   Row 2: walk RIGHT → [frame0, frame1, frame2, frame3]
 *   Row 3: walk UP    → [frame0, frame1, frame2, frame3]
 *
 * Each frame is FRAME_W × FRAME_H pixels.
 * If you don't have a walk animation, just use 1 frame per row
 * and set frameCount to 1.
 *
 * Recommended tools:
 *   • Piskel (piskelapp.com) — free, browser-based pixel art + export sprite sheet
 *   • Aseprite — paid but excellent, exports sprite sheets automatically
 *
 * ─────────────────────────────────────────────────────────────────
 * HOW TO REPLACE WITH YOUR OWN PNG:
 *   1. Draw your sprite in Piskel (or similar)
 *   2. Export as sprite sheet PNG → put in assets/sprites/
 *   3. Update the `src` path and frame dimensions below
 *   4. The game will automatically use your PNG instead of the fallback
 * ─────────────────────────────────────────────────────────────────
 */

window.SPRITES = {

  will: {
    src: 'assets/sprites/will.png',   // ← replace with your PNG filename
    frameW: 20,                         // width of one frame in the sheet
    frameH: 26,                         // height of one frame
    frameCount: 4,                      // frames per animation row
    animSpeed: 150,                     // ms per frame
    rows: {
      down:  0,
      left:  1,
      right: 2,
      up:    3
    },
    // fallback: drawn in code if PNG fails to load (see game.js drawFallbackWill)
    useFallback: false
  },

  andrea: {
    src: 'assets/sprites/andrea.png', // ← replace with your PNG filename
    frameW: 20,
    frameH: 26,
    frameCount: 4,
    animSpeed: 150,
    rows: {
      down:  0,
      left:  1,
      right: 2,
      up:    3
    },
    useFallback: false
  },

  /**
   * TILESET — westside.png (220×20, 11 tiles × 20px each)
   * ─────────────────────────────────────────────────────────────────
   * Tile index → what's in YOUR PNG (left → right):
   *
   *   0  river          — blue ripple water
   *   1  river_shimmer  — blue ripple (lighter variant)
   *   2  pier           — water left half + sandy planks right half
   *   3  path           — full sandy brown (walkway / bike path)
   *   4  sidewalk       — light gray with dark right edge
   *   5  road_edge      — dark left strip + grass checkerboard (transition)
   *   6  grass          — green with small red flower dot
   *   7  road           — solid dark gray
   *   8  building       — dark gray body + light gray right strip (window column)
   *   9  sidewalk_line  — light gray with dark center lane markings
   *  10  sidewalk_plain — solid light gray
   *
   * The tile IDs used in westside.json ground layer must match these indices.
   * ─────────────────────────────────────────────────────────────────
   */
  tileset: {
    src: 'assets/maps/westside.png',
    tileW: 20,
    tileH: 20,
    useFallback: false,  // ✅ PNG loaded — set back to true if you swap the file

    // Named aliases so game.js can reference tiles by name instead of magic numbers
    ids: {
      river:          0,
      river_shimmer:  1,
      pier:           2,
      path:           3,
      sidewalk:       4,
      road_edge:      5,
      grass:          6,
      road:           7,
      building:       8,
      sidewalk_line:  9,
      sidewalk_plain: 10
    }
  },

  /**
   * HEART COLLECTIBLE
   * A simple 20×20 sprite (or use fallback heart drawn in canvas).
   */
  heart: {
    src: 'assets/sprites/heart.png',
    frameW: 20,
    frameH: 20,
    frameCount: 2,  // frame 0 = uncollected, frame 1 = collected
    animSpeed: 500,
    useFallback: false
  }
};
