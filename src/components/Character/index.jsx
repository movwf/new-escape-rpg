import React from 'react';
import Sprite from './Sprite';
import { Characters } from '../../config/CharacterModels';
import KeyboardSettings from '../../config/KeyboardSettings';
import Directions from '../../config/Directions';
import {
  DEFAULT_STEP_SIZE,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../../config/PlayerSettings';
import { getNextStepSize, move } from '../../@core/characterMovements';
import { getNearbyBoard } from '../../@core/utils/boardUtils';

const PLAYER_SIZE = { width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
const MOVEMENT_TICK_MS = 1000 / 30;

const MOVEMENT_KEYS = new Set([
  KeyboardSettings.ARROW_UP_KEY,
  KeyboardSettings.ARROW_DOWN_KEY,
  KeyboardSettings.ARROW_LEFT_KEY,
  KeyboardSettings.ARROW_RIGHT_KEY,
]);

const Character = React.forwardRef(function Character(
  {
    startPos,
    pathLayerData,
    char,
    boards = [],
    onPositionChange,
    onNearbyBoardChange,
    controlsEnabled = true,
    boardOpen = false,
    onInteract,
    onEscape,
  },
  ref
) {
  // Positions are absolute map coordinates. The component is remounted when
  // the selected map changes, so startPos is only needed for initialization.
  const [pos, setPos] = React.useState(startPos);
  const [direction, setDirection] = React.useState(Directions.DOWN);
  const [step, setStep] = React.useState(1);
  const posRef = React.useRef(startPos);
  const stepSizeRef = React.useRef(DEFAULT_STEP_SIZE);
  const pressedKeysRef = React.useRef(new Set());
  const controlsEnabledRef = React.useRef(controlsEnabled);
  const lastMoveTimeRef = React.useRef(0);

  React.useEffect(() => {
    controlsEnabledRef.current = controlsEnabled;
    if (!controlsEnabled) pressedKeysRef.current.clear();
  }, [controlsEnabled]);

  const nearbyBoard = React.useMemo(
    () => getNearbyBoard(boards, pos, PLAYER_SIZE),
    [boards, pos]
  );

  React.useEffect(() => {
    onNearbyBoardChange?.(nearbyBoard);
  }, [nearbyBoard, onNearbyBoardChange]);

  React.useEffect(
    () => () => {
      onNearbyBoardChange?.(null);
    },
    [onNearbyBoardChange]
  );

  const applyMovement = React.useCallback(
    (now = performance.now()) => {
      const pressedKeys = pressedKeysRef.current;

      const vertical =
        (pressedKeys.has(KeyboardSettings.ARROW_DOWN_KEY) ? 1 : 0) -
        (pressedKeys.has(KeyboardSettings.ARROW_UP_KEY) ? 1 : 0);
      const horizontal =
        (pressedKeys.has(KeyboardSettings.ARROW_RIGHT_KEY) ? 1 : 0) -
        (pressedKeys.has(KeyboardSettings.ARROW_LEFT_KEY) ? 1 : 0);

      if (vertical === 0 && horizontal === 0) return;

      lastMoveTimeRef.current = now;

      const result = move(
        posRef.current,
        pathLayerData,
        { top: vertical, left: horizontal },
        stepSizeRef.current,
        PLAYER_SIZE
      );

      if (result.direction !== null) setDirection(result.direction);
      if (!result.moved) return;

      posRef.current = result.position;
      setPos(result.position);
      setStep((currentStep) => (currentStep + 1) % 3);
    },
    [pathLayerData]
  );

  // Held keys are sampled at a fixed rate, which keeps movement smooth and
  // lets two directions be combined into a diagonal move.
  React.useEffect(() => {
    let animationFrameId;

    const tick = (time) => {
      if (
        controlsEnabledRef.current &&
        pressedKeysRef.current.size > 0 &&
        time - lastMoveTimeRef.current >= MOVEMENT_TICK_MS
      ) {
        applyMovement(time);
      }

      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [applyMovement]);

  const handleKeyDown = React.useCallback(
    (event) => {
      const { code } = event;

      if (code === KeyboardSettings.ESCAPE_KEY) {
        event.preventDefault();
        if (!event.repeat) onEscape?.();
        return;
      }

      if (code === KeyboardSettings.INTERACT_KEY) {
        if (boardOpen || controlsEnabled) {
          event.preventDefault();
          if (!event.repeat) onInteract?.();
        }
        return;
      }

      if (!controlsEnabled) return;

      if (code === KeyboardSettings.SPEED_KEY) {
        event.preventDefault();
        if (!event.repeat) {
          stepSizeRef.current = getNextStepSize(stepSizeRef.current);
        }
        return;
      }

      if (MOVEMENT_KEYS.has(code)) {
        event.preventDefault();
        if (!pressedKeysRef.current.has(code)) {
          pressedKeysRef.current.add(code);
          applyMovement();
        }
      }
    },
    [applyMovement, boardOpen, controlsEnabled, onEscape, onInteract]
  );

  const handleKeyUp = React.useCallback((event) => {
    pressedKeysRef.current.delete(event.code);
  }, []);

  const clearPressedKeys = React.useCallback(() => {
    pressedKeysRef.current.clear();
  }, []);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearPressedKeys);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearPressedKeys);
    };
  }, [clearPressedKeys, handleKeyDown, handleKeyUp]);

  // Keep the parent informed so it can persist the exact position.
  React.useEffect(() => {
    onPositionChange?.(posRef.current);
  }, [onPositionChange, pos]);

  return (
    <div
      id="character"
      ref={ref}
      style={{
        display: 'inline-block',
        position: 'relative',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
      }}
    >
      <Sprite
        spriteUrl={Characters[char].sprite}
        height={PLAYER_HEIGHT}
        width={PLAYER_WIDTH}
        direction={direction}
        step={step}
      />
    </div>
  );
});

export default Character;
