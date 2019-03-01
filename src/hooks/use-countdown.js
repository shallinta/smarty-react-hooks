/**
 * 读秒倒计时hook
 */

import { useState, useEffect } from 'react';

const useCountdown = () => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown === 0) {
      return () => { };
    }
    const timer = setInterval(() => {
      setCountdown((lastTime) => {
        if (lastTime > 0) {
          return lastTime - 1;
        }
        return 0;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  return [countdown, setCountdown];
};

export default useCountdown;
