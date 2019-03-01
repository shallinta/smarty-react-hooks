/**
 * 用于控制input控件的值和输入验证的状态
 *
 * 参数：
 * initValue 初始值
 * rule 值的验证规则，可以是`正则表达式`类型或`带返回值的自定义函数`类型
 *       使用正则时，最好加上/^和$/，即开始和结束标记，以免部分匹配成功时返回验证通过的结果
 *
 * 返回：
 * [value, setValue, error, test]
 *    value: 控件值
 *    setValue: 修改控件值的方法
 *    error: 验证结果，默认为false
 *            验证方式rule为正则时，验证通过时error=false，验证失败时error=true
 *            验证方式rule为函数时，验证结果为自定义函数rule(value)返回值
 *    test: 用于启动验证。例如：
 *            在input的onBlur时调用，则每次失去焦点时才验证；
 *            在input的onChange时调用，则每次值改变，就验证。
 */

import { useState, useCallback } from 'react';

export default (initValue, rule) => {
  const [value, setValue] = useState(initValue);
  const [error, setError] = useState(false);

  const test = useCallback(() => {
    if (rule instanceof RegExp) {
      setError(!rule.test(value));
    } else if (rule instanceof Function) {
      setError(rule(value));
    }
  }, [rule, value]);

  return [value, setValue, error, test];
};
