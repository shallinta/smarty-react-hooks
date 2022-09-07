/**
 * 拖拽和放置事件自动绑定
 *
 * 参数：
 *   eventType: 'drag' | 'drop' | 'drag-n-drop' 需要应用的事件组，
 *              分别为拖拽事件组 drag (dragstart + dragend)、
 *                   放置事件组 drop (dragover + dragleave + drop)、
 *                以及两组同时应用 drag-n-drop
 *   opts: {
 *       namespace: string | number 命名空间，避免在同一页面有多个不同拖拽事务时事件处理混乱
 *       dragStyle: string | function 被拖拽元素在拖拽发生时的样式，不传时不进行样式处理
 *              可以传字符串类型的 className，或传递函数自行处理，函数参数为元素 dom 引用
 *       dragData: any | function 被拖拽元素发生拖拽时携带的数据
 *              可携带任意类型数据，也可以传函数在拖拽发生时调用自行收集数据并返回，函数参数为元素 dom 引用和事件本身，需要返回数据
 *       droppingStyle: string | object | function 可释放元素在拖拽元素经过上方时的样式
 *              可以传字符串类型的 className；
 *              也可以传递 object 类型的 className map，用于分别指定拖拽元素位于可释放元素不同象限时的样式
 *                  {
 *                    basic: string; // 所有位置应用
 *                    left: string; // 左侧时应用
 *                    right: string;
 *                    top: string;
 *                    bottom: string;
 *                    leftTop: string; // 左上（第二）象限时应用
 *                    leftBottom: string;
 *                    rightTop: string;
 *                    rightBottom: string;
 *                  }
 *              也可以传递函数自行处理样式，函数参数为可释放元素 dom 引用和时间时机 (途径 'over' | 离开 'leave')
 *        dropHandler: function 拖拽元素在可释放元素上释放时触发的回调函数，可通过返回值 updateDropHandler 进行函数更新
 *             dropHandler(data, { isLeft, isTop }, el)
 *                  函数参数 data: { namespace, data } namespace 为命名空间，data 为拖拽元素携带的数据；
 *                  第二个参数对象 { isLeft, isTop } 中包含拖拽落点位置处于可释放元素的象限位置信息
 *                  第三个参数 el 为可释放元素本身;
 *   }
 *
 * return: [ref, updateDropHandler, updateDragData]
 *   ref: 元素 ref 绑定函数，在组件中将其绑定给需要应用拖拽的 react 元素的 ref 属性
 *   updateDropHandler(dropHandler callback): 更新释放事件回调函数
 *   updateDragData(string | function): 更新拖拽时携带的数据
 *
 * 可释放元素：同时注册监听了 dragover 和 drop 事件，且都阻止了默认行为的元素
 */

import { useState, useCallback, useEffect } from 'react';

export default (eventType, {
  namespace,
  dragStyle,
  dragData,
  droppingStyle,
  dropHandler,
} = {}) => {
  const [el, setEl] = useState();
  const [innerDragData, setInnerDragData] = useState(() => dragData);
  const [innerDropHandler, setInnerDropHandler] = useState(() => (dropHandler || (() => { })));

  const ref = useCallback((node) => {
    setEl(node);
  }, []);

  const updateDropHandler = useCallback((cb) => {
    setInnerDropHandler(() => cb);
  }, []);

  const updateDragData = useCallback((newDragData) => {
    setInnerDragData(() => newDragData);
  }, []);

  // 计算拖拽位置处于落点元素的哪个象限，返回 [isLeft: boolean, isTop: boolean]
  const calculatePos = useCallback((e) => {
    let parent = e.target;
    let accOffsetLeft = 0;
    let accOffsetTop = 0;
    while (parent && parent !== el) {
      if (parent.offsetParent) {
        accOffsetLeft += parent.offsetLeft;
        accOffsetTop += parent.offsetTop;
        parent = parent.offsetParent;
      } else {
        parent = parent.parentElement;
      }
    }
    const offsetLeftFromNode = accOffsetLeft + e.offsetX;
    const offsetTopFromNode = accOffsetTop + e.offsetY;
    const isLeft = offsetLeftFromNode < (el.clientWidth / 2);
    const isTop = offsetTopFromNode < (el.clientHeight / 2);
    return [isLeft, isTop];
  }, [el]);

  const addDroppingObjectStyle = useCallback((styleObj, isLeft, isTop) => {
    if (!el) {
      return;
    }

    const isRight = !isLeft;
    const isBottom = !isTop;
    const {
      basic, left, right, top, bottom, leftTop, leftBottom, rightTop, rightBottom
    } = styleObj;

    if (basic) {
      el.classList.add(basic);
    }
    if (left) {
      if (isLeft) {
        el.classList.add(left);
      } else {
        el.classList.remove(left);
      }
    }

    if (right) {
      if (isRight) {
        el.classList.add(right);
      } else {
        el.classList.remove(right);
      }
    }

    if (top) {
      if (isTop) {
        el.classList.add(top);
      } else {
        el.classList.remove(top);
      }
    }

    if (bottom) {
      if (isBottom) {
        el.classList.add(bottom);
      } else {
        el.classList.remove(bottom);
      }
    }

    if (leftTop) {
      if (isLeft && isTop) {
        el.classList.add(leftTop);
      } else {
        el.classList.remove(leftTop);
      }
    }

    if (leftBottom) {
      if (isLeft && isBottom) {
        el.classList.add(leftBottom);
      } else {
        el.classList.remove(leftBottom);
      }
    }

    if (rightTop) {
      if (isRight && isTop) {
        el.classList.add(rightTop);
      } else {
        el.classList.remove(rightTop);
      }
    }

    if (rightBottom) {
      if (isRight && isBottom) {
        el.classList.add(rightBottom);
      } else {
        el.classList.remove(rightBottom);
      }
    }
  }, [el]);

  useEffect(() => {
    if (!el) {
      return () => { };
    }

    const handle = eventName => (e) => {
      // 事件 dragover 和 drop 需阻止默认事件，防止默认打开元素链接等行为
      if (eventName === 'dragover' || eventName === 'drop') {
        e.preventDefault();
      }

      // 事件 dragstart 触发时（开始拖拽动作，最早触发，仅会触发一次），
      // 设置携带数据，并对被拖拽元素进行（样式）处理
      // e.target 为被拖拽元素
      if (eventName === 'dragstart') {
        // 增加拖拽中标记
        e.target.dataset.dragging = true;

        // 处理被拖拽元素发生拖拽时的样式
        if (dragStyle && typeof dragStyle === 'string') {
          e.target.classList.add(dragStyle);
        } else if (typeof dragStyle === 'function') {
          dragStyle(e.target);
        }

        // 发生拖拽时处理携带数据
        if (typeof innerDragData === 'function') {
          const data = innerDragData(e.target, e);
          if (data) {
            const draggingData = JSON.stringify({ namespace, data });
            e.dataTransfer.setData('text/plain', draggingData);
          }
        } else {
          const draggingData = JSON.stringify({ namespace, data: innerDragData });
          e.dataTransfer.setData('text/plain', draggingData);
        }
      }

      // 事件 dragend 触发时（停止拖拽动作，晚于 drop 事件，最后触发，仅会触发一次），
      // 清理携带数据，并对被拖拽元素进行（样式）恢复
      // e.target 为被拖拽元素
      if (eventName === 'dragend') {
        // 清除拖拽中标记
        delete e.target.dataset.dragging;

        // 处理被拖拽元素停止拖拽时的样式
        if (dragStyle && typeof dragStyle === 'string') {
          e.target.classList.remove(dragStyle);
        } else if (typeof dragStyle === 'function') {
          dragStyle(e.target);
        }

        // 停止拖拽时清空携带数据
        e.dataTransfer.setData('text/plain', null);
      }

      // 事件 dragover 触发时（拖拽元素经过其他元素上方，会随着拖拽移动连续、持续触发），
      // 注册监听事件的元素为可释放元素，途经时对元素进行（样式）处理，
      // 并进行边缘方位判断（处于可释放元素的左侧或右侧、上侧或下侧，常用于排序）
      // e.target 为途经可释放元素（或内部子元素）
      if (eventName === 'dragover') {
        // 经过拖拽元素本身，不做任何处理
        if (el.dataset.dragging) {
          return;
        }

        // 1. 从触发元素开始向上逐级累加位置偏移量，计算拖拽点相对于注册事件的可释放元素的位置象限
        const [isLeft, isTop] = calculatePos(e);

        // 2. 根据计算出的位置象限，对途经的可释放元素进行（样式）处理
        if (droppingStyle && typeof droppingStyle === 'string') {
          el.classList.add(droppingStyle);
        } else if (typeof droppingStyle === 'object') {
          addDroppingObjectStyle(droppingStyle, isLeft, isTop);
        } else if (typeof droppingStyle === 'function') {
          droppingStyle(el, 'over');
        }
      }

      // 事件 dragleave 触发时（拖拽元素离开可释放元素（或内部子元素）时触发，每离开一次触发一次），
      // 注册监听事件的元素为可释放元素，途经离开时对元素进行（样式）恢复，
      // e.target 为途经可释放元素（或内部子元素）
      if (eventName === 'dragleave') {
        // 离开拖拽元素本身，不做任何处理
        if (el.dataset.dragging) {
          return;
        }

        // 1. 对离开的可释放元素进行（样式）恢复
        if (droppingStyle && typeof droppingStyle === 'string') {
          el.classList.remove(droppingStyle);
        } else if (typeof droppingStyle === 'object') {
          Object.values(droppingStyle).map(className => el.classList.remove(className));
        } else if (typeof droppingStyle === 'function') {
          droppingStyle(el, 'leave');
        }
      }

      // 事件 drop 触发时（在可释放元素上方停止拖拽，触发一次），
      // 触发后需对元素进行（样式）恢复，
      // 读取携带数据，进行拖拽完成处理
      // e.target 为可释放元素（或内部子元素）
      if (eventName === 'drop') {
        // 离开拖拽元素本身，不做任何处理
        if (el.dataset.dragging) {
          return;
        }

        // 1. 释放后对可释放元素进行（样式）恢复
        if (droppingStyle && typeof droppingStyle === 'string') {
          el.classList.remove(droppingStyle);
        } else if (typeof droppingStyle === 'object') {
          Object.values(droppingStyle).map(className => el.classList.remove(className));
        } else if (typeof droppingStyle === 'function') {
          droppingStyle(el, 'leave');
        }

        // 2. 命名空间不同，不做任何处理
        let droppedData = e.dataTransfer.getData('text');
        try {
          droppedData = JSON.parse(droppedData);
        } catch (ex) {
          // console.error(ex);
          return;
        }
        if (!droppedData || droppedData.namespace !== namespace) {
          return;
        }

        // 3. 从触发元素开始向上逐级累加位置偏移量，计算拖拽点相对于注册事件的可释放元素的位置象限
        const [isLeft, isTop] = calculatePos(e);

        // 4. 根据计算出的位置象限，对获取的拖拽数据进行处理
        const { data } = droppedData;
        if (innerDropHandler && typeof innerDropHandler === 'function') {
          innerDropHandler(data, { isLeft, isTop }, el);
        }
      }
    };

    const dragEventNameList = ['dragstart', 'dragend'];
    const dropEventNameList = ['dragleave', 'dragover', 'drop'];
    const customEventNameList = [];
    switch (eventType) {
      case 'drag':
        customEventNameList.push(...dragEventNameList);
        el.draggable = true;
        break;
      case 'drop':
        customEventNameList.push(...dropEventNameList);
        break;
      case 'drag-n-drop':
        customEventNameList.push(...dragEventNameList, ...dropEventNameList);
        el.draggable = true;
        break;
      default:
    }
    const eventList = customEventNameList.map(eventName => ({
      eventName,
      handler: handle(eventName),
    }));

    eventList.forEach(({ eventName, handler }) => {
      el.addEventListener(eventName, handler, false);
    });

    return () => {
      eventList.forEach(({ eventName, handler }) => {
        el.removeEventListener(eventName, handler);
      });
    };
  }, [el, innerDragData, innerDropHandler]);

  return [ref, updateDropHandler, updateDragData];
};
