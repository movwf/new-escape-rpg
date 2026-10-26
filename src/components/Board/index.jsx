import React from 'react';
import styles from './Board.module.css';

function Board({ board, onClose }) {
  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <section
        className={styles.board}
        role="dialog"
        aria-modal="true"
        aria-labelledby="board-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="board-title" className={styles.title}>
          {board.title}
        </h2>
        <div className={styles.content}>
          {board.content.map((line, index) => (
            <p key={index} className={styles.line}>
              {line}
            </p>
          ))}
        </div>
        <div className={styles.actions}>
          <span className={styles.hint}>Press E or Esc to close</span>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

export default Board;
