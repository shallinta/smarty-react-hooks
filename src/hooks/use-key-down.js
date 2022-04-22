/**
 * 用于自动监听某个按键按下（keydown）事件，并产生回调
 *
 * 参数：
 * keyOrKeyCode: 要监听的按键 keydown 事件的 key 或 code 或 keyCode
 * callback: 回调函数，监听到 keydown 事件的按键匹配传入的 keyOrKeyCode 时，
 *                  将调用此回调
 *
 * 返回：
 * [start, stop, set]
 *    start: 开始监听（默认不监听）
 *    stop: 停止监听
 *    set: 重新设置回调函数，参数必须是函数类型
 */

import { useState, useEffect, useCallback } from 'react';

export default (keyOrKeyCode, callback) => {
  const [cb, setCb] = useState(() => {
    if (callback && typeof callback === 'function') {
      return callback;
    }
    return () => { };
  });
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const listener = (e) => {
      if (cb && typeof cb === 'function') {
        if (keyOrKeyCode === e.key) {
          cb(e.key);
          return;
        }
        if (keyOrKeyCode === e.code) {
          cb(e.code);
          return;
        }
        if (keyOrKeyCode === e.keyCode) {
          cb(e.keyCode);
        }
      }
    };
    if (listening) {
      // eslint-disable-next-line no-undef
      window.addEventListener('keydown', listener, false);
    }

    return () => {
      if (listening) {
        // eslint-disable-next-line no-undef
        window.removeEventListener('keydown', listener);
      }
    };
  }, [keyOrKeyCode, listening, cb]);

  const start = useCallback(() => {
    setListening(true);
  }, []);

  const stop = useCallback(() => {
    setListening(false);
  }, []);

  const set = useCallback((newCb) => {
    if (newCb && typeof newCb === 'function') {
      setCb(() => newCb);
    }
  }, []);

  return [start, stop, set];
};
