/*
 * SPRITE DEFINITIONS
 */

window.SPRITES = {

  will: {
    src: 'assets/sprites/will.png',   
    frameW: 32,                         // width of one frame in the sheet
    frameH: 32,                         // height of one frame
    frameCount: 3,                      // frames per animation row
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
    frameW: 32,
    frameH: 32,
    frameCount: 2,
    animSpeed: 150,
    rows: {
      down:  0,
      up:  1
    },
    useFallback: false
  },

  /*
   * TILESET — westside.png (220×20, 11 tiles × 20px each)
   */
  tileset: {
    src: 'assets/maps/westside.png',
    tileH: 20,
    useFallback: false,
    tiles: [
      { name: 'water',    sx: 0,   sw: 50, walkable: false },  // 0
      { name: 'pier',     sx: 50,  sw: 29, walkable: true  },  // 1
      { name: 'sidewalk', sx: 79,  sw: 14, walkable: true  },  // 2
      { name: 'path',     sx: 93,  sw: 13, walkable: true  },  // 3
      { name: 'grass',    sx: 106, sw: 32, walkable: true  },  // 4
      { name: 'road',     sx: 138, sw: 36, walkable: true  },  // 5
      { name: 'building', sx: 174, sw: 46, walkable: false },  // 6
    ]
  },

  /**
   * HEART COLLECTIBLE
   */
  heart: {
    src: 'assets/sprites/heart.png',
    frameW: 30,
    frameH: 30,
    frameCount: 2,  // frame 0 = uncollected, frame 1 = collected
    animSpeed: 500,
    useFallback: false
  }
};
