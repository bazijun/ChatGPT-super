if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let t={};const o=e=>i(e,l),a={module:{uri:l},exports:t,require:o};s[l]=Promise.all(n.map((e=>a[e]||o(e)))).then((e=>(r(...e),t)))}}define(["./workbox-e0782b83"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-200618a9.js",revision:null},{url:"assets/index-2d215ae9.js",revision:null},{url:"assets/index-4b2ce0e3.css",revision:null},{url:"assets/index-510e7a20.js",revision:null},{url:"assets/index-843e4538.js",revision:null},{url:"assets/index-94a20593.js",revision:null},{url:"assets/index-e05b3d40.css",revision:null},{url:"assets/useAIModal-acbd6914.js",revision:null},{url:"index.html",revision:"2a478e1a4801279d6eea94fb39efc7e1"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"pwa-192x192.png",revision:"e8edb535529201a3b8a82f2fe3b07b09"},{url:"pwa-512x512.png",revision:"2a5ea0072f596f4b1006b3943aac2a9e"},{url:"manifest.webmanifest",revision:"2ba951a6a1cfe633cb13aedeb311f672"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
