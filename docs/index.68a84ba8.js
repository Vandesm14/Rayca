class e{constructor(e,t,n,r){this.width=e,this.height=t,this.chars=n,this.random=r}#e(e,t){return Array.from({length:t}).findIndex(((t,n)=>Math.pow(2,n)-1>=e))}#t(e){return Array.from({length:e}).reduce(((e,t,n)=>e|1<<n),0)}generate(){return Array.from({length:this.width*this.height}).map((()=>Math.floor(this.random()*this.chars.length)))}compress(t){const n=this.#e(this.chars.length-1,e.BYTE);if(void 0===n)return;const r=Math.floor(e.BYTE/n),o=Math.ceil(t.length/r);return Array.from({length:o}).map(((e,o)=>Array.from({length:r}).map(((e,s)=>(t[s+o*r]??0)<<n*s)).reduce(((e,t)=>e|t))))}decompress(t){const n=this.#e(this.chars.length-1,e.BYTE);if(void 0===n)return;const r=Math.floor(e.BYTE/n),o=this.width*this.height,s=this.#t(n);return Array.from({length:o}).reverse().map(((e,o)=>{const c=n*(o%r);return(t[Math.floor(o/r)]&s<<c)>>c}))}toString(e){return Array.from({length:e.length}).reduce(((t,n,r)=>t+(r%this.width==0&&0!==r?"\n":"")+this.chars[e[r]]),"")}fromString(e){return Array.from({length:e.length}).reduce(((t,n,r)=>"\n"!==e.charAt(r)?[...t,this.chars.indexOf(e.charAt(r))]:t),[])}toToken(e){return btoa(String.fromCharCode(...e))}fromToken(e){return atob(e).split("").map((e=>e.charCodeAt(0)))}}function t(e,t,n){const r=document.createElement("p");r.classList.add(t),r.innerText=e,document.getElementById("toast-list").appendChild(r),setTimeout((()=>r.classList.add("fade-in")),100),setTimeout((()=>{r.classList.remove("fade-in"),setTimeout((()=>document.getElementById("toast-list").removeChild(r)),100)}),n)}e.BYTE=8;const n=new e(10,10,[" ","-","="],(r=-559039530,()=>{let e=r+=1831565813;return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}));var r;const o=document.getElementById("card-list"),s=document.getElementById("load-more"),c=document.getElementById("inf-scroll-toggle");function i(e){return Array.from({length:e}).map((()=>function(e){const r=document.createElement("div");r.classList.add("card");const o=document.createElement("p");o.innerText="#"+e.slice(0,8).reduce(((e,t,n)=>e+String(t+n)),""),r.append(o);const s=document.createElement("code");s.innerHTML=n.toString(e).replace(/\n/g,"<br>").replace(/ /g,"&nbsp;"),r.append(s);const c=document.createElement("a");c.innerText="Own a copy",c.href="?token="+n.toToken(n.compress(e)),r.append(c);const i=e=>{e.preventDefault(),navigator.clipboard?navigator.clipboard.writeText(c.href).then((()=>t("Copied to clipboard!","success",2e3))).catch((()=>t("Unable to copy.","error",2e3))):t("Unable to copy.","error",2e3)};return c.addEventListener("click",i),c.addEventListener("submit",i),r}(n.generate())))}function a(e){o.append(...i(e))}function d(){const{scrollTop:e,scrollHeight:t,clientHeight:n}=document.documentElement;e+n>=t-400&&a(16)}s.addEventListener("click",(()=>a(16))),s.addEventListener("submit",(()=>a(16)));let h=!1;c.addEventListener("change",(e=>{!h&&c.checked?(h=!0,document.addEventListener("scroll",d,{passive:!0})):h&&!c.checked&&(h=!1,document.removeEventListener("scroll",d))})),c.checked&&(h=!0,document.addEventListener("scroll",d,{passive:!0})),o.append(...i(16));
//# sourceMappingURL=index.68a84ba8.js.map
