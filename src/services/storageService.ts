const STORAGE_KEY_PREFIX = "ai-smart-recipe-maker";

const isStorageAvailable = () => {
  try {
    const key = `${STORAGE_KEY_PREFIX}-test`;
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn("Local storage не доступний", error);
    return false;
  }
};

export const storage = {
  save<T>(key: string, value: T) {
    if (!isStorageAvailable()) return;
    const data = JSON.stringify(value);
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}:${key}`, data);
  },
  load<T>(key: string, fallback: T): T {
    if (!isStorageAvailable()) return fallback;
    const data = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}:${key}`);
    return data ? (JSON.parse(data) as T) : fallback;
  },
  remove(key: string) {
    if (!isStorageAvailable()) return;
    window.localStorage.removeItem(`${STORAGE_KEY_PREFIX}:${key}`);
  }
};
