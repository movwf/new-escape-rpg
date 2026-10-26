import React from 'react';
import styles from './InteractionPrompt.module.css';

function InteractionPrompt({ label = 'open board' }) {
  return (
    <div className={styles.prompt} role="status">
      Press <kbd className={styles.key}>E</kbd> to {label}
    </div>
  );
}

export default React.memo(InteractionPrompt);
