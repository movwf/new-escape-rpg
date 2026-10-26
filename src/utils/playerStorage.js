const STORAGE_KEY = 'run-escape:positions';
const LEGACY_STORAGE_KEY = 'run-escape-player';

const isPosition = (value) =>
  Boolean(value) && Number.isFinite(value.top) && Number.isFinite(value.left);

const readJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const readPositions = () => {
  const stored = readJson(STORAGE_KEY, {});
  return stored && typeof stored === 'object' && !Array.isArray(stored) ? { ...stored } : {};
};

/**
 * Loads the last position of every map.
 * Also migrates the format used by older versions of the game.
 * @returns {Object} Positions keyed by map id
 */
export const loadSavedPositions = () => {
  const positions = readPositions();
  const legacy = readJson(LEGACY_STORAGE_KEY, null);

  // Old versions stored a single position where x was top and y was left.
  if (legacy && Number.isFinite(legacy.x) && Number.isFinite(legacy.y) && !positions['map-1']) {
    positions['map-1'] = { top: legacy.x, left: legacy.y };
  }

  return positions;
};

/**
 * Persists the player's position for a map
 * @param {String} mapId Map identifier
 * @param {{ top: Number, left: Number }} position Player position
 */
export const savePosition = (mapId, position) => {
  if (!mapId || !isPosition(position)) return;

  const positions = readPositions();
  positions[mapId] = position;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Storage can be unavailable (private mode/quota); the game still works without it.
  }
};
