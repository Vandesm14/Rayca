const e=new class{#e=8;constructor(e,t,n,r){this.width=e,this.height=t,this.chars=n,this.rand=r}#t(e,t){for(let n=0;n<t;n++)if(Math.pow(2,n)-1>=e)return n}#n(e){return Array.from({length:e}).reduce(((e,t,n)=>e|1<<n),0)}generate(){return Array.from({length:this.width*this.height}).map((()=>Math.floor(this.rand()*this.chars.length)))}compress(e){const t=this.#t(this.chars.length-1,this.#e);if(void 0===t)return;const n=Math.floor(this.#e/t),r=Math.ceil(e.length/n);return Array.from({length:r}).map(((r,o)=>Array.from({length:n}).map(((r,s)=>(e[s+o*n]??0)<<t*s)).reduce(((e,t)=>e|t))))}decompress(e){const t=this.#t(this.chars.length-1,this.#e);if(void 0===t)return;const n=Math.floor(this.#e/t),r=this.width*this.height,o=this.#n(t);return Array.from({length:r}).reverse().map(((r,s)=>{const a=t*(s%n);return(e[Math.floor(s/n)]&o<<a)>>a}))}toString(e){return Array.from({length:e.length}).reduce(((t,n,r)=>t+(r%this.width==0&&0!==r?"\n":"")+this.chars[e[r]]),"")}fromString(e){return Array.from({length:e.length}).reduce(((t,n,r)=>"\n"!==e.charAt(r)?[...t,this.chars.indexOf(e.charAt(r))]:t),[])}toToken(e){return btoa(String.fromCharCode(...e))}fromToken(e){return atob(e).split("").map((e=>e.charCodeAt(0)))}}(10,10,[" ","-","="],(t=1065,()=>{let e=t+=1831565813;return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}));var t;const n=document.createElement("div");function r(t,n=!1){const r=document.createElement("div");r.setAttribute("aria-label","art"),r.classList.add("card");const o=function(t){const n=document.createElement("code");return n.innerHTML=e.toString(t).replace(/ /g,"&nbsp;").replace(/\n/g,"<br>"),n}(t);if(o.tabIndex=0,!n){const n=()=>{const n=document.getElementById("modal-wrapper"),o=document.getElementById("modal-content");n.classList.add("active"),o.innerHTML=r.outerHTML.replace(a.outerHTML,""),history.pushState(null,null,"?token="+e.toToken(e.compress(t)))};o.addEventListener("click",n),o.addEventListener("keydown",(e=>"Enter"===e.key?n():void 0))}const s=document.createElement("span");s.innerHTML=`#${t.map(((e,t)=>String(e+t).slice(-1))).slice(0,8).join("")}`;const a=document.createElement("a");return a.href="?token="+e.toToken(e.compress(t)),a.innerText="Own a copy",a.addEventListener("click",(e=>{e.preventDefault(),navigator.clipboard.writeText(a.href);const t=a.innerText;a.innerText="Copied!",setTimeout((()=>a.innerText=t),2e3)})),r.appendChild(o),r.appendChild(s),!n&&r.appendChild(a),r}n.classList.add("list"),document.getElementById("our-art").appendChild(n);function o(){const t=new URLSearchParams(location.search).get("token"),n=document.getElementById("modal-content"),o=document.getElementById("modal-wrapper");if(t){const s=r(e.decompress(e.fromToken(t)),!0);n.innerHTML=s.outerHTML,o.classList.add("active")}else o.classList.remove("active")}function s(){for(let t=0;t<16;t++)n.appendChild(r(e.generate()))}s(),o(),document.addEventListener("scroll",(()=>{const{scrollTop:e,scrollHeight:t,clientHeight:n}=document.documentElement;e+n>=t-400&&s()}),{passive:!0}),document.getElementById("modal-close").addEventListener("click",(()=>{document.getElementById("modal-wrapper").classList.remove("active"),history.pushState(null,null,"/")})),document.getElementById("modal-wrapper").addEventListener("click",(e=>{e.target===e.currentTarget&&(document.getElementById("modal-wrapper").classList.remove("active"),history.pushState(null,null,"/"))})),window.addEventListener("popstate",o);
//# sourceMappingURL=index.752af355.js.map