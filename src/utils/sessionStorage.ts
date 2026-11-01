export const getSessionStorageItem = <T>(key: string): T | null => {
  const storedValue = sessionStorage.getItem(key);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    sessionStorage.removeItem(key);

    return null;
  }
};

export const setSessionStorageItem = <T>(key: string, value: T): void => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const removeSessionStorageItem = (key: string): void => {
  sessionStorage.removeItem(key);
};
