/**
 * utils 为工具函数，对原生API做兼容性处理及提取公共方法
 */
const utils = {
  // 防抖动函数，method 回调函数，context 上下文，event 传入的时间，delay 延迟函数
  debounce(method, context, event, delay) {
    if (method.tId) {
      clearTimeout();
    }
    method.tId = setTimeout(() => {
      method.call(context, event);
    }, delay);
  },
  // 截流函数，method 回调函数，context 上下文，delay 延迟函数，
  throttle(method, context, event, delay) {
    let wait = false;
    return function(...args) {
      if (!wait) {
        method.apply(context, args);
        wait = true;
        setTimeout(() => {
          wait = false;
        }, delay);
      }
    };
  },
  // 删除 类名
  deleteClassName(el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    }
  },
  // polyfill Object.assign
  polyfill() {
    if (typeof Object.assign !== 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign(target) {
          if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
          }
          const to = Object(target);
          for (let index = 1; index < arguments.length; index++) {
            const nextSource = arguments[index];
            if (nextSource != null) {
              for (const nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        },
        writable: true,
        configurable: true,
      });
    }
  },
};
