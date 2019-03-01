"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var react=require("react");function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var n=[],r=!0,i=!1,a=void 0;try{for(var u,c=t[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){i=!0,a=t}finally{try{r||null==c.return||c.return()}finally{if(i)throw a}}return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}var useAnimation=function(t){var e=_slicedToArray(react.useState(!1),2),n=e[0],r=e[1],i=_slicedToArray(react.useState(!1),2),a=i[0],u=i[1],c=_slicedToArray(react.useState(!1),2),o=c[0],s=c[1],l=_slicedToArray(react.useState(!1),2),f=l[0],y=l[1],d=react.useCallback(function(){y(!1),n||u(!1)},[n]);react.useEffect(function(){return t&&t.addEventListener("transitionend",d,!1),function(){t&&t.removeEventListener("transitionend",d)}},[d]),react.useEffect(function(){a&&setTimeout(function(){s(!0)},10)},[a]);var v=react.useCallback(function(t){t!==n&&(f&&(u(n),s(n),y(!1)),setTimeout(function(){r(t),y(!0),t?u(!0):s(!1)},10))},[n,f]);return[a,o,v]},waitingObj={},timer=null,isFirst=!0,lastTime=0,useAsyncDebounce=function(t,e,n,r,i){var a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},u=_slicedToArray(react.useState(0),2),c=u[0],o=u[1],s=react.useCallback(t,e),l=react.useCallback(n,r),f=a.leading,y=a.trailing,d=a.maxWait,v=react.useCallback(function(){if(s&&(i||!waitingObj[t])){waitingObj[t]=!0;var e=s.apply(void 0,arguments);e&&e.then?(o(function(t){return t+1}),e.then(function(t){return t},function(t){return t}).then(function(e){e&&l(e),waitingObj[t]=!1,o(function(t){return t-1})})):waitingObj[t]=!1}},[i,waitingObj,s,l]);return[c>0,react.useCallback(function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];if(i){var r=(new Date).getTime();timer&&clearTimeout(timer),f&&isFirst&&(isFirst=!1,v.apply(void 0,e)),d>0&&r-lastTime>d&&(0!==lastTime&&v.apply(void 0,e),lastTime=r),timer=setTimeout(function(){lastTime=0,timer=null,isFirst=!0,y&&v.apply(void 0,e)},i)}else v.apply(void 0,e)},[v,lastTime,timer,isFirst])]},waiting=!1,useAsync=function(t,e,n,r){var i=_slicedToArray(react.useState(!1),2),a=i[0],u=i[1],c=react.useCallback(t,e),o=react.useCallback(n,r);return[a,react.useCallback(function(){if(!waiting&&c){waiting=!0;var t=c.apply(void 0,arguments);t&&t.then?(u(!0),t.then(function(t){return t},function(t){return t}).then(function(t){t&&o(t),waiting=!1,u(!1)})):waiting=!1}},[waiting,c,u])]},useCountdown=function(){var t=_slicedToArray(react.useState(0),2),e=t[0],n=t[1];return react.useEffect(function(){if(0===e)return function(){};var t=setInterval(function(){n(function(t){return t>0?t-1:0})},1e3);return function(){clearInterval(t)}},[e]),[e,n]},useInput=function(t,e){var n=_slicedToArray(react.useState(t),2),r=n[0],i=n[1],a=_slicedToArray(react.useState(!1),2),u=a[0],c=a[1],o=react.useCallback(function(){e instanceof RegExp?c(!e.test(r)):e instanceof Function&&c(e(r))},[e,r]);return[r,i,u,o]};exports.useAnimation=useAnimation,exports.useAsyncDebounce=useAsyncDebounce,exports.useAsync=useAsync,exports.useCountdown=useCountdown,exports.useInput=useInput;
