import { useDispatch, useSelector } from "react-redux";

/** @typedef {ReturnType<import('@/store').makeStore>} AppStore */
/** @typedef {ReturnType<AppStore['getState']>} RootState */
/** @typedef {AppStore['dispatch']} AppDispatch */

/** @param {import('react-redux').TypedUseSelectorHook<RootState>} */
export const useAppSelector = useSelector;

/** @returns {AppDispatch} */
export function useAppDispatch() {
  return useDispatch();
}
