import { useState, useEffect } from 'react';
import Iframe from 'react-iframe';
import styles from '../app/styles/components/iframePopup.module.scss';
import Cross from '../app/svgs/circle-xmark-regular.svg';

function IframePopup({ url, visible, setVisible }) {

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && visible) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  useEffect(() => {
    if (visible) {
      document.body.classList.add('iframe-active');
    } else {
      document.body.classList.remove('iframe-active');
    }

    return () => {
      document.body.classList.remove('iframe-active');
    };
  }, [visible]);

  return (
    <>
      {visible && (
        <div className={styles['iframe-overlay']}>
          <button className={styles['close-button']} onClick={() => setVisible(false)}><Cross /></button>
          <Iframe url={url}
                  width="640px"
                  height="320px"
                  className={styles['centered-iframe']}
                  display="block"
                  position="relative"/>
        </div>
      )}
    </>
  );
}

export default IframePopup;
