if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let o={};const t=e=>i(e,l),u={module:{uri:l},exports:o,require:t};s[l]=Promise.all(n.map((e=>u[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-30e9d199"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-021bfb7b.js",revision:null},{url:"assets/index-4b2ce0e3.css",revision:null},{url:"assets/index-621bc3c8.js",revision:null},{url:"assets/index-95af365c.js",revision:null},{url:"assets/index-cac83771.js",revision:null},{url:"assets/index-d37e47fe.js",revision:null},{url:"assets/index-e05b3d40.css",revision:null},{url:"assets/useAIModal-60e37766.js",revision:null},{url:"index.html",revision:"82798ad46df6dc69724e9505ba333335"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"favicon.svg",revision:"504a41f4398f50b45ff9d87157206e2a"},{url:"pwa-192x192.png",revision:"e8edb535529201a3b8a82f2fe3b07b09"},{url:"pwa-512x512.png",revision:"2a5ea0072f596f4b1006b3943aac2a9e"},{url:"manifest.webmanifest",revision:"61106658a24718c1f06430b2aebb7bb5"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
