import { atom } from "recoil";
import { atomOptionsWithLocalStorage } from "recoil/localStorage";

export default atom<string>(atomOptionsWithLocalStorage("password", ""));
