/**
 * debounce throttle 的 异步promise方法生成器
 *
 * 参数：
 *  fn: 异步方法
 *  args: 方法更新涉及的变量数组（用于缓存fn函数）
 *  cb: 结果变更时触发的回调
 *  cbArgs: 回调函数更新涉及的变量数组 （用于缓存cb回调函数）
 *  wait: 延迟执行等待的毫秒数，大于0时，开启debounce模式
 *  opts: debounce配置参数 { leading, trailing, maxWait }
 *     leading: 首次执行
 *     trailing: 末尾执行
 *     maxWait: 最大延迟时间
 *
 * 返回： [synching, run]
 *  synching: 异步状态 (true : 表示同步中)
 *  run: 调用异步方法
 *
 */

import { useState, useCallback } from 'react';

const waitingObj = {};
let timer = null;
let trailingTimer = null;
let isFirst = true;
let lastTime = 0;

const useAsyncDebounce = (fn, args, cb, cbArgs, wait, opts = {}) => {
  const [synchingCount, setSynchingCount] = useState(0);
  const promise = useCallback(fn, args);
  const memoizedCb = useCallback(cb, cbArgs);
  const { leading, trailing, maxWait } = opts;

  const start = useCallback((...params) => {
    if (!promise) {
      return;
    }
    if (!wait && waitingObj[fn]) {
      return;
    }
    waitingObj[fn] = true;
    const p = promise(...params);
    if (p && p.then) {
      setSynchingCount(count => count + 1);
      p.then(
        result => result,
        error => error
      ).then((result) => {
        if (result) {
          memoizedCb(result);
        }
        waitingObj[fn] = false;
        setSynchingCount(count => count - 1);
      });
    } else {
      waitingObj[fn] = false;
    }
  }, [wait, waitingObj, promise, memoizedCb]);

  const run = useCallback((...params) => {
    if (wait) {
      const curTime = new Date().getTime();
      if (timer) {
        clearTimeout(timer);
      }
      if (leading && isFirst) {
        isFirst = false;
        start(...params);
      }
      if (maxWait > 0 && curTime - lastTime > maxWait) {
        if (lastTime !== 0) {
          start(...params);
        }
        lastTime = curTime;
      }

      timer = setTimeout(() => {
        lastTime = 0;
        start(...params);
        timer = null;
        isFirst = true;
      }, wait);

      if (trailing) {
        if (trailingTimer) {
          clearTimeout(trailingTimer);
          trailingTimer = null;
        }
        trailingTimer = setTimeout(() => {
          start(...args);
          trailingTimer = null;
        }, wait);
      }
    } else {
      start(...params);
    }
  }, [start, lastTime, timer, isFirst]);

  return [synchingCount > 0, run];
};

export default useAsyncDebounce;