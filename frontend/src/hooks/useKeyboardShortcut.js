import { useEffect, useCallback } from 'react';

function useKeyboardShortcut(keyMap) {
  const handleKeyPress = useCallback((event) => {
    const { key, ctrlKey, shiftKey, altKey } = event;
    
    for (const shortcut of Object.keys(keyMap)) {
      const keys = shortcut.toLowerCase().split('+');
      const mainKey = keys[keys.length - 1];
      const needCtrl = keys.includes('ctrl');
      const needShift = keys.includes('shift');
      const needAlt = keys.includes('alt');

      if (
        key.toLowerCase() === mainKey &&
        ctrlKey === needCtrl &&
        shiftKey === needShift &&
        altKey === needAlt
      ) {
        event.preventDefault();
        keyMap[shortcut]();
        break;
      }
    }
  }, [keyMap]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
}

export default useKeyboardShortcut;