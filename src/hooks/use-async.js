/**
 * 执行异步promise方法hook （如ajax请求）
 * 参数：
 *  fn: 异步方法
 *  args: 方法更新涉及的变量数组（用于缓存fn函数）
 *  cb: 结果变更时触发的回调
 *  cbArgs: 回调函数更新涉及的变量数组 （用于缓存cb回调函数）
 * 返回： [synching, run]
 *  synching: 异步状态 (true : 表示同步中)
 *  run: 调用异步方法
 */

import { useState, useCallback } from 'react';

let waiting = false;

const useAsync = (fn, args, cb, cbArgs) => {
  const [synching, setSynching] = useState(false);

  const promise = useCallback(fn, args);
  const memoizedCb = useCallback(cb, cbArgs);

  const run = useCallback((...params) => {
    if (waiting || !promise) {
      return;
    }
    waiting = true;
    const p = promise(...params);
    if (p && p.then) {
      setSynching(true);
      p.then(
        result => result,
        error => error
      ).then((result) => {
        if (result) {
          memoizedCb(result);
        }
        waiting = false;
        setSynching(false);
      });
    } else {
      waiting = false;
    }
  }, [waiting, promise, setSynching]);

  return [synching, run];
};

export default useAsync;