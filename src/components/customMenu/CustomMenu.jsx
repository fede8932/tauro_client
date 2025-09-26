import { useEffect, useRef, useState } from 'react';
import styles from './customMenu.module.css';

function CustomMenu(props) {
  const { children } = props;
  const [view, setView] = useState(false);
  const bodyContRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (bodyContRef.current && !bodyContRef.current.contains(event.target)) {
        setView(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div
      style={{ position: 'absolute', zIndex: '200', backgroundColor: 'white' }}
    >
      <button
        className={styles.filterBut}
        onClick={() => {
          setView(true);
        }}
      >
        <i class="fa-solid fa-filter"></i>
        <span style={{ marginLeft: '5px' }}>Filtro</span>
      </button>
      {view ? (
        <div
          className={styles.bodyCont}
          onMouseLeave={() => setView(false)}
          ref={bodyContRef}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default CustomMenu;
