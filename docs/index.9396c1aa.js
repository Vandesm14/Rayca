class e{constructor(e,t,r,n){this.width=e,this.height=t,this.chars=r,this.random=n}#e(e,t){return Array.from({length:t}).findIndex(((t,r)=>Math.pow(2,r)-1>=e))}#t(e){return Array.from({length:e}).reduce(((e,t,r)=>e|1<<r),0)}generate(){return Array.from({length:this.width*this.height}).map((()=>Math.floor(this.random()*this.chars.length)))}compress(t){const r=this.#e(this.chars.length-1,e.BYTE);if(void 0===r)return;const n=Math.floor(e.BYTE/r),o=Math.ceil(t.length/n);return Array.from({length:o}).map(((e,o)=>Array.from({length:n}).map(((e,s)=>(t[s+o*n]??0)<<r*s)).reduce(((e,t)=>e|t))))}decompress(t){const r=this.#e(this.chars.length-1,e.BYTE);if(void 0===r)return;const n=Math.floor(e.BYTE/r),o=this.width*this.height,s=this.#t(r);return Array.from({length:o}).reverse().map(((e,o)=>{const c=r*(o%n);return(t[Math.floor(o/n)]&s<<c)>>c}))}toString(e){return Array.from({length:e.length}).reduce(((t,r,n)=>t+(n%this.width==0&&0!==n?"\n":"")+this.chars[e[n]]),"")}fromString(e){return Array.from({length:e.length}).reduce(((t,r,n)=>"\n"!==e.charAt(n)?[...t,this.chars.indexOf(e.charAt(n))]:t),[])}toToken(e){return btoa(String.fromCharCode(...e))}fromToken(e){return atob(e).split("").map((e=>e.charCodeAt(0)))}}function t(e,t,r){const n=document.createElement("p");n.classList.add(t),n.innerText=e,document.getElementById("toast-list").appendChild(n),setTimeout((()=>n.classList.add("fade-in")),100),setTimeout((()=>{n.classList.remove("fade-in"),setTimeout((()=>document.getElementById("toast-list").removeChild(n)),100)}),r)}e.BYTE=8;const r=new e(10,10,[" ","-","="],(n=-559039530,()=>{let e=n+=1831565813;return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}));var n;const o=document.getElementById("card-list"),s=document.getElementById("load-more"),c=document.getElementById("inf-scroll-toggle");function a(e){return Array.from({length:e}).map((()=>function(e){const n=document.createElement("div");n.classList.add("card");const o=document.createElement("p");crypto.subtle.digest("SHA-256",Uint8Array.from(r.compress(e))).then((e=>Array.from(new Uint8Array(e)).reduce(((e,t)=>e+t.toString(16)),""))).then((e=>{o.innerText="#"+e.slice(0,8),o.title="#"+e})),n.append(o);const s=document.createElement("code");s.innerHTML=r.toString(e).replace(/\n/g,"<br>").replace(/ /g,"&nbsp;"),n.append(s);const c=document.createElement("a");c.innerText="Own a copy",c.href="?token="+r.toToken(r.compress(e)),n.append(c);const a=e=>{e.preventDefault(),navigator.clipboard?navigator.clipboard.writeText(c.href).then((()=>t("Copied to clipboard!","success",2e3))).catch((()=>t("Unable to copy.","error",2e3))):t("Unable to copy.","error",2e3)};return c.addEventListener("click",a),c.addEventListener("submit",a),n}(r.generate())))}function i(e){o.append(...a(e))}function d(){const{scrollTop:e,scrollHeight:t,clientHeight:r}=document.documentElement;e+r>=t-400&&i(16)}s.addEventListener("click",(()=>i(16))),s.addEventListener("submit",(()=>i(16)));let l=!1;c.addEventListener("change",(e=>{!l&&c.checked?(l=!0,document.addEventListener("scroll",d,{passive:!0})):l&&!c.checked&&(l=!1,document.removeEventListener("scroll",d)),localStorage.setItem("inf-scroll",String(l))})),null!==localStorage.getItem("inf-scroll")&&(l=Boolean(localStorage.getItem("inf-scroll"))),c.checked&&(l=!0,document.addEventListener("scroll",d,{passive:!0})),o.append(...a(16));
//# sourceMappingURL=index.9396c1aa.js.map