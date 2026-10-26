import React from 'react';

/**
 * Adds an event listener to the window object without re-registering it on
 * every render.
 * @param {Function} cb Handler function
 */
export default function useKeyPress(cb) {
  const callbackRef = React.useRef(cb);

  React.useEffect(() => {
    callbackRef.current = cb;
  }, [cb]);

  React.useEffect(() => {
    const handleKeyDown = (event) => callbackRef.current(event);

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
