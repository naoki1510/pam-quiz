import { atom } from "recoil";
import { atomOptionsWithLocalStorage, storageKeys } from "recoil/localStorage";

export default atom<string>(
  atomOptionsWithLocalStorage(storageKeys.password, "")
);
