import { useContext } from "react";
import { AtFormWrapperContext } from "./AtFormWrapperContext";

export const useAtFormWrapper = () => {
  const ctx = useContext(AtFormWrapperContext);

  return ctx;
};