import { useContext } from "react";
import { ATFormWrapperContext } from "./ATFormWrapperContext";

export const useATFormWrapper = () => {
  const ctx = useContext(ATFormWrapperContext);

  if (!ctx) {
    throw new Error("useATFormWrapper must be used inside ATFormWrapperProvider");
  }

  return ctx;
};