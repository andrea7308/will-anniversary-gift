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
    frameW: 32,                         // width of one frame in the sheet
    frameH: 32,                         // height of one frame
    frameCount:12,                      // frames per animation row
    animSpeed: 150,                     // ms per frame
    rows: {
      down:  0,
      up:  1,
      left: 2,
      right:    3
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
    useFallback: true
  },

  /**
   * TILESET
   * ─────────────────────────────────────────────────────────────────
   * Your map tileset is a single horizontal strip PNG.
   * Each tile is tileW × tileH. Tiles are ordered left to right
   * matching the tile IDs in westside.json.
   *
   * Tile order in your PNG (left → right):
   *   0: river
   *   1: pier
   *   2: path
   *   3: road
   *   4: grass
   *   5: grass_dark
   *   6: sidewalk
   *   7: building
   *   8: tree_top
   *   9: tree_trunk
   *  10: water_shimmer
   *
   * HOW TO MAKE THE TILESET:
   *   1. Open Piskel, set canvas to 220×20 (11 tiles × 20px each)
   *   2. Draw each tile in its slot
   *   3. Export as PNG → save as assets/maps/westside.png
   * ─────────────────────────────────────────────────────────────────
   */
  tileset: {
    src: 'assets/maps/westside.png',
    tileW: 20,
    tileH: 20,
    useFallback: false, 

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
