export const BOARD_INTERACTION_PADDING = 48;

/**
 * Finds the nearest board whose interaction area overlaps the player.
 *
 * Board bounds are in map pixels (x = left, y = top), matching the player
 * position format used by the movement code.
 *
 * @param {Array} boards Boards configured for the current map
 * @param {{ top: Number, left: Number }} position Player position
 * @param {{ width: Number, height: Number }} size Player hitbox size
 * @param {Number} padding Extra interaction distance around each board
 * @returns {Object|null} Nearby board or null
 */
export const getNearbyBoard = (
  boards,
  position,
  size,
  padding = BOARD_INTERACTION_PADDING
) => {
  if (!boards?.length || !position || !size) return null;

  const playerLeft = position.left;
  const playerTop = position.top;
  const playerRight = playerLeft + size.width;
  const playerBottom = playerTop + size.height;

  return (
    boards.find(({ bounds }) => {
      if (!bounds) return false;

      const boardLeft = bounds.x - padding;
      const boardTop = bounds.y - padding;
      const boardRight = bounds.x + bounds.width + padding;
      const boardBottom = bounds.y + bounds.height + padding;

      return (
        playerLeft < boardRight &&
        playerRight > boardLeft &&
        playerTop < boardBottom &&
        playerBottom > boardTop
      );
    }) ?? null
  );
};
