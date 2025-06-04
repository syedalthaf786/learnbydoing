import { useState, useEffect, useCallback } from 'react';

function useLocalStorage(key, initialValue, options = {}) {
  const {
    expiry = null, // Time in milliseconds
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;

  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const { value, timestamp } = deserialize(item);

      if (expiry && timestamp && Date.now() - timestamp > expiry) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return value;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, expiry, deserialize]);

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        const storageValue = {
          value: newValue,
          timestamp: Date.now()
        };

        window.localStorage.setItem(key, serialize(storageValue));
        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue]
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue, remove];
}

export default useLocalStorage;