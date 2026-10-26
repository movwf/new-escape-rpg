import Directions from '../config/Directions';
import { DEFAULT_STEP_SIZE, MAX_STEP_SIZE } from '../config/PlayerSettings';
import { canOccupy } from './utils/mapUtils';

const getFacingDirection = (vertical, horizontal) => {
  if (horizontal < 0) return Directions.LEFT;
  if (horizontal > 0) return Directions.RIGHT;
  if (vertical < 0) return Directions.UP;
  if (vertical > 0) return Directions.DOWN;
  return null;
};

/**
 * Moves the player using a movement vector.
 *
 * The player moves one pixel at a time, so high speed values can never
 * tunnel through a wall. When both axes are pressed the player moves
 * diagonally, and if only one axis is blocked it slides along the wall.
 *
 * @param {{ top: Number, left: Number }} position Current player position
 * @param {Object} pathLayerData Path layer data
 * @param {{ top: Number, left: Number }} movement Movement vector
 * @param {Number} stepSize Maximum pixels to move
 * @param {{ width: Number, height: Number }} playerSize Player hitbox size
 * @returns {{ position: { top: Number, left: Number }, moved: Boolean, direction: Number|null }}
 */
export const move = (position, pathLayerData, movement, stepSize, playerSize) => {
  const vertical = Math.sign(movement?.top ?? 0);
  const horizontal = Math.sign(movement?.left ?? 0);
  const direction = getFacingDirection(vertical, horizontal);

  if (direction === null) {
    return { position, moved: false, direction: null };
  }

  // Keep diagonal movement at roughly the same speed as straight movement.
  const isDiagonal = vertical !== 0 && horizontal !== 0;
  const distance = isDiagonal
    ? Math.max(1, Math.round(stepSize * Math.SQRT1_2))
    : stepSize;

  const nextPosition = { ...position };
  let moved = false;

  for (let step = 0; step < distance; step += 1) {
    const fullStep = {
      top: nextPosition.top + vertical,
      left: nextPosition.left + horizontal,
    };

    if (canOccupy(pathLayerData, fullStep, playerSize)) {
      nextPosition.top = fullStep.top;
      nextPosition.left = fullStep.left;
      moved = true;
      continue;
    }

    // Slide along a wall instead of stopping dead when moving diagonally.
    const verticalStep = { top: nextPosition.top + vertical, left: nextPosition.left };
    const horizontalStep = { top: nextPosition.top, left: nextPosition.left + horizontal };

    if (vertical !== 0 && canOccupy(pathLayerData, verticalStep, playerSize)) {
      nextPosition.top = verticalStep.top;
      moved = true;
      continue;
    }

    if (horizontal !== 0 && canOccupy(pathLayerData, horizontalStep, playerSize)) {
      nextPosition.left = horizontalStep.left;
      moved = true;
      continue;
    }

    break;
  }

  return {
    position: nextPosition,
    moved,
    direction,
  };
};

/**
 * Cycles the player speed: x1 -> x2 -> x4 -> x1
 * @param {Number} currentStepSize Current step size
 * @returns {Number} Next step size
 */
export const getNextStepSize = (currentStepSize) =>
  currentStepSize >= MAX_STEP_SIZE ? DEFAULT_STEP_SIZE : Math.min(currentStepSize * 2, MAX_STEP_SIZE);
