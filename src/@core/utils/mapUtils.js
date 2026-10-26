import explodeArray from '../../utils/explodeArray';

// Used so a tile that only touches the player's edge is not treated as an overlap.
const EPSILON = 0.001;

/**
 * Creates map matrix from data
 * @param {Object} mapObject Initial map object
 * @param {String} pathLayerName Map layer contains path
 * @returns Matrix of map and it's properties
 */
export const createMapData = (mapObject, pathLayerName) => {
  const { layers = [], tileheight, tilewidth } = mapObject;
  const pathLayer = layers.find((layer) => layer.name === pathLayerName);

  if (!pathLayer) {
    throw new Error(`Map layer "${pathLayerName}" was not found.`);
  }

  return {
    map: explodeArray(pathLayer.data, pathLayer.width),
    height: pathLayer.height,
    width: pathLayer.width,
    tileHeight: tileheight,
    tileWidth: tilewidth,
  };
};

/**
 * Calculates starting position of the player based on path layer of map
 * @param {Object} pathLayerData Path layer object
 * @returns Start position of player ({ top, left })
 */
export const getStartPosition = (pathLayerData) => {
  const { map, height, width, tileHeight, tileWidth } = pathLayerData;

  // Look for first movable tile location
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (map[row]?.[col] === 0) {
        return { top: row * tileHeight, left: col * tileWidth };
      }
    }
  }

  return { top: 0, left: 0 };
};

/**
 * Checks whether a single map tile can be walked on
 * @param {Object} pathLayerData Path layer data
 * @param {Number} row Tile row
 * @param {Number} col Tile column
 * @returns {Boolean} Whether the tile is inside the map and walkable
 */
export const isWalkableTile = (pathLayerData, row, col) => {
  const { map, height, width } = pathLayerData;

  if (row < 0 || row >= height || col < 0 || col >= width) return false;

  return map[row]?.[col] === 0;
};

/**
 * Checks whether the player's whole hitbox fits inside walkable tiles
 * @param {Object} pathLayerData Path layer data
 * @param {{ top: Number, left: Number }} position Position of the player
 * @param {{ width: Number, height: Number }} size Player hitbox size
 * @returns {Boolean} Whether the player can stand at the position
 */
export const canOccupy = (pathLayerData, position, size) => {
  const { tileHeight, tileWidth } = pathLayerData;
  const { top, left } = position;
  const { width, height } = size;

  const firstRow = Math.floor(top / tileHeight);
  const lastRow = Math.floor((top + height - EPSILON) / tileHeight);
  const firstCol = Math.floor(left / tileWidth);
  const lastCol = Math.floor((left + width - EPSILON) / tileWidth);

  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let col = firstCol; col <= lastCol; col += 1) {
      if (!isWalkableTile(pathLayerData, row, col)) return false;
    }
  }

  return true;
};

/**
 * Validates a saved position before restoring it
 * @param {Object} pathLayerData Path layer data
 * @param {{ top: Number, left: Number }} position Saved position
 * @param {{ width: Number, height: Number }} size Player hitbox size
 * @returns {Boolean} Whether the saved position is usable
 */
export const isValidPosition = (pathLayerData, position, size) => {
  if (!position || !Number.isFinite(position.top) || !Number.isFinite(position.left)) {
    return false;
  }

  return canOccupy(pathLayerData, position, size);
};
