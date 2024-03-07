import { atom } from "recoil";
import { atomOptionsWithLocalStorage, storageKeys } from "./localStorage";

export default atom(
  atomOptionsWithLocalStorage<number | undefined>(storageKeys.userId, undefined)
);
