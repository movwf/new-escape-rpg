import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  return (
    <span className={styles.footer}>
      2026 -<a href="https://github.com/movwf">Movwf</a>
    </span>
  );
}

export default React.memo(Footer);
