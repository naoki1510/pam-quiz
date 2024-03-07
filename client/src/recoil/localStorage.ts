import { AtomEffect, AtomOptions } from "recoil";

export const storageKeys = {
  password: "password",
  userId: "userId",
};

export const getSavedValue = <T>(key: string, defaultValue: T) => {
  try {
    return (JSON.parse(String(localStorage.getItem(key))) as T) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveValue =
  <T>(key: string): AtomEffect<T> =>
  ({ onSet }) => {
    onSet((value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  };

export const listenChange =
  <T>(key: string, defaultValue: T): AtomEffect<T> =>
  ({ setSelf }) => {
    const handleChangeStorage = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key) {
        if (e.newValue === null) {
          setSelf(defaultValue);
        } else {
          setSelf(JSON.parse(e.newValue) as T);
        }
      }
    };

    window.addEventListener("storage", handleChangeStorage);

    return () => {
      window.removeEventListener("storage", handleChangeStorage);
    };
  };

export const atomOptionsWithLocalStorage = <T>(
  key: string,
  defaultValue: T,
  effects: AtomEffect<T>[] = []
): AtomOptions<T> => ({
  key,
  default: getSavedValue(key, defaultValue),
  effects: [saveValue(key), listenChange(key, defaultValue), ...effects],
});
