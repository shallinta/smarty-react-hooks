import{useState as n,useCallback as t,useEffect as r}from"react";function e(n,t){return function(n){if(Array.isArray(n))return n}(n)||function(n,t){var r=[],e=!0,i=!1,u=void 0;try{for(var o,a=n[Symbol.iterator]();!(e=(o=a.next()).done)&&(r.push(o.value),!t||r.length!==t);e=!0);}catch(n){i=!0,u=n}finally{try{e||null==a.return||a.return()}finally{if(i)throw u}}return r}(n,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var i=function(i){var u=e(n(!1),2),o=u[0],a=u[1],f=e(n(!1),2),c=f[0],l=f[1],v=e(n(!1),2),p=v[0],d=v[1],s=e(n(!1),2),y=s[0],h=s[1],m=t(function(){h(!1),o||l(!1)},[o]);r(function(){return i&&i.addEventListener("transitionend",m,!1),function(){i&&i.removeEventListener("transitionend",m)}},[m]),r(function(){c&&setTimeout(function(){d(!0)},10)},[c]);var g=t(function(n){n!==o&&(y&&(l(o),d(o),h(!1)),setTimeout(function(){a(n),h(!0),n?l(!0):d(!1)},10))},[o,y]);return[c,p,g]},u={},o=null,a=!0,f=0,c=function(r,i,c,l,v){var p=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},d=e(n(0),2),s=d[0],y=d[1],h=t(r,i),m=t(c,l),g=p.leading,T=p.trailing,w=p.maxWait,x=t(function(){if(h&&(v||!u[r])){u[r]=!0;var n=h.apply(void 0,arguments);n&&n.then?(y(function(n){return n+1}),n.then(function(n){return n},function(n){return n}).then(function(n){n&&m(n),u[r]=!1,y(function(n){return n-1})})):u[r]=!1}},[v,u,h,m]);return[s>0,t(function(){for(var n=arguments.length,t=new Array(n),r=0;r<n;r++)t[r]=arguments[r];if(v){var e=(new Date).getTime();o&&clearTimeout(o),g&&a&&(a=!1,x.apply(void 0,t)),w>0&&e-f>w&&(0!==f&&x.apply(void 0,t),f=e),o=setTimeout(function(){f=0,o=null,a=!0,T&&x.apply(void 0,t)},v)}else x.apply(void 0,t)},[x,f,o,a])]},l=!1,v=function(r,i,u,o){var a=e(n(!1),2),f=a[0],c=a[1],v=t(r,i),p=t(u,o);return[f,t(function(){if(!l&&v){l=!0;var n=v.apply(void 0,arguments);n&&n.then?(c(!0),n.then(function(n){return n},function(n){return n}).then(function(n){n&&p(n),l=!1,c(!1)})):l=!1}},[l,v,c])]},p=function(){var t=e(n(0),2),i=t[0],u=t[1];return r(function(){if(0===i)return function(){};var n=setInterval(function(){u(function(n){return n>0?n-1:0})},1e3);return function(){clearInterval(n)}},[i]),[i,u]},d=function(r,i){var u=e(n(r),2),o=u[0],a=u[1],f=e(n(!1),2),c=f[0],l=f[1],v=t(function(){i instanceof RegExp?l(!i.test(o)):i instanceof Function&&l(i(o))},[i,o]);return[o,a,c,v]};export{i as useAnimation,c as useAsyncDebounce,v as useAsync,p as useCountdown,d as useInput};
