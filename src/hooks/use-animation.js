/**
 * 控制节点从无到有和动画显示
 * 传入参数：
 *    ref: 实施动画的节点引用。如果使用react hook: useRef 创建的引用，需传入ref.current
 * 返回值：
 *    [display, active, set]
 *    1. display: 用于控制display显示隐藏
 *    2. active: 用于控制动画样式添加与否
 *    3. set(bool): 用于变更动画状态，变更后将自动按需要的顺序变更display和active
 *       - set(true)时，将先获得display=true的变化，然后自动下一次render获得active=true
 *       - set(false)时，将先获得active=false的变化，用于执行动画
 *                      然后会在transtionend触发后再获得display=false
 */

import { useState, useEffect, useCallback } from 'react';

const useAnimation = (ref) => {
  const [visible, setVisible] = useState(false); // 总体状态
  const [display, setDisplay] = useState(false); // 用于控制显示隐藏(display样式)状态
  const [active, setActive] = useState(false); // 用于控制动画激活(css动画样式)状态
  const [animating, setAnimating] = useState(false); // 正在动画中的标识

  const resetAnimating = useCallback(() => {
    // 动画结束后
    setAnimating(false);
    if (!visible) {
      // 离开动画结束后，更新display=false
      setDisplay(false);
    }
  }, [visible]);

  useEffect(() => {
    if (ref) {
      ref.addEventListener('transitionend', resetAnimating, false);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('transitionend', resetAnimating);
      }
    };
  }, [resetAnimating]);

  useEffect(() => {
    if (display) {
      // 更新display=true后激活动画
      setTimeout(() => {
        setActive(true);
      }, 10);
    }
  }, [display]);

  const set = useCallback((flag) => {
    if (flag === visible) {
      return;
    }
    if (animating) {
      // 终结未完成动画的状态(停止未完成动画而不会让动画直接执行完)
      setDisplay(visible);
      setActive(visible);
      setAnimating(false);
    }
    // 开始自动动画行为
    setTimeout(() => {
      setVisible(flag);
      setAnimating(true);
      if (flag) {
        // 进入时，先更新display，然后激活动画
        setDisplay(true);
      } else {
        // 离开时，先激活动画，待动画完成再更新display
        setActive(false);
      }
    }, 10);
  }, [visible, animating]);

  return [display, active, set];
};

export default useAnimation;
