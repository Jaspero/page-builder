function x(){}const v=t=>t;function w(t,n){for(const e in n)t[e]=n[e];return t}function E(t){return t()}function A(){return Object.create(null)}function j(t){t.forEach(E)}function B(t){return typeof t=="function"}function C(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}let i;function D(t,n){return i||(i=document.createElement("a")),i.href=n,t===i.href}function P(t){return Object.keys(t).length===0}function q(t,...n){if(t==null){for(const c of n)c(void 0);return x}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function S(t,n,e){t.$$.on_destroy.push(q(n,e))}function U(t,n,e,c){if(t){const s=y(t,n,e,c);return t[0](s)}}function y(t,n,e,c){return t[1]&&c?w(e.ctx.slice(),t[1](c(n))):e.ctx}function G(t,n,e,c){if(t[2]&&c){const s=t[2](c(e));if(n.dirty===void 0)return s;if(typeof s=="object"){const a=[],_=Math.max(n.dirty.length,s.length);for(let u=0;u<_;u+=1)a[u]=n.dirty[u]|s[u];return a}return n.dirty|s}return n.dirty}function H(t,n,e,c,s,a){if(s){const _=y(n,e,c,a);t.p(_,s)}}function I(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let c=0;c<e;c++)n[c]=-1;return n}return-1}function J(t){const n={};for(const e in t)n[e]=!0;return n}function K(t){const n=typeof t=="string"&&t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return n?[parseFloat(n[1]),n[2]||"px"]:[t,"px"]}let f;function h(t){f=t}function m(){if(!f)throw new Error("Function called outside component initialization");return f}function L(t){m().$$.on_mount.push(t)}function N(t){m().$$.after_update.push(t)}function Q(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach(c=>c.call(this,n))}const l=[],g=[];let r=[];const p=[],k=Promise.resolve();let b=!1;function O(){b||(b=!0,k.then(F))}function R(){return O(),k}function z(t){r.push(t)}function T(t){p.push(t)}const d=new Set;let o=0;function F(){if(o!==0)return;const t=f;do{try{for(;o<l.length;){const n=l[o];o++,h(n),M(n.$$)}}catch(n){throw l.length=0,o=0,n}for(h(null),l.length=0,o=0;g.length;)g.pop()();for(let n=0;n<r.length;n+=1){const e=r[n];d.has(e)||(d.add(e),e())}r.length=0}while(l.length);for(;p.length;)p.pop()();b=!1,d.clear(),h(t)}function M(t){if(t.fragment!==null){t.update(),j(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(z)}}function V(t){const n=[],e=[];r.forEach(c=>t.indexOf(c)===-1?n.push(c):e.push(c)),e.forEach(c=>c()),r=n}export{h as A,E as B,l as C,O as D,N as a,g as b,U as c,D as d,G as e,S as f,I as g,T as h,K as i,J as j,Q as k,w as l,z as m,x as n,L as o,B as p,v as q,j as r,C as s,R as t,H as u,A as v,F as w,P as x,V as y,f as z};
