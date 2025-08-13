import { useContext } from "react";
import { ATFormWrapperContext } from "./ATFormWrapperContext";

export const useATFormWrapper = () => {
  const ctx = useContext(ATFormWrapperContext);

  return ctx;
};