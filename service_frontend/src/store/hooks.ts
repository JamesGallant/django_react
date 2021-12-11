import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
/* eslint-disable */
export const useAppDispatch = () => useDispatch<AppDispatch>();
/* eslint-enable */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;