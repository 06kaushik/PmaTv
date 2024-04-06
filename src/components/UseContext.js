import { createContext, useContext } from "react";
export const orientation = createContext();
export const tokenContext = createContext();


export function Useorientation() {
  return useContext(orientation);
}

export function Usesettoken() {
  return useContext(tokenContext);
}