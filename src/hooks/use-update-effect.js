/**
 * 用于代替 componentDidUpdate 生命周期的 react hook，用法同 useEffect
 * 它仅在更新时运行 effects，而不在初始 mount 时运行
 *
 * 参数：
 * effect: 要运行的 effect 函数
 * deps: 一组依赖项。如果任何依赖项发生变化，将重新运行
 *
 */

import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * 它在第一次渲染时返回 true，在每次后续渲染时返回 false
 * @returns 一个布尔值，在第一次渲染时为真，在后续渲染时为假。
 */
export function useFirstMountState() {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}

/**
 * It runs the effect only on updates, not on the initial mount
 * @param effect - The effect to run.
 * @param deps - An array of dependencies. If any of the dependencies change, the effect will be
 * re-run.
 */
const useUpdateEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;

/**
 * useUpdateEffect 的 useLayoutEffect 版本
 */
export const useUpdateLayoutEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  // eslint-disable-next-line consistent-return
  useLayoutEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
};
