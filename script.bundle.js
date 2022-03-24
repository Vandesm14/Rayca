// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class Rayca {
    static BYTE = 8;
    width;
    height;
    chars;
    random;
    constructor(width, height, chars, random1){
        this.width = width;
        this.height = height;
        this.chars = chars;
        this.random = random1;
    }
     #bitsNeeded(n, max) {
        return Array.from({
            length: max
        }).findIndex((_, i)=>Math.pow(2, i) - 1 >= n
        );
    }
     #bitMask(n1) {
        return Array.from({
            length: n1
        }).reduce((a, _, i)=>a | 1 << i
        , 0);
    }
    generate() {
        return Array.from({
            length: this.width * this.height
        }).map(()=>Math.floor(this.random() * this.chars.length)
        );
    }
    compress(seq) {
        const bitsPerChar = this.#bitsNeeded(this.chars.length - 1, Rayca.BYTE);
        if (bitsPerChar === undefined) return;
        const charsPerByte = Math.floor(Rayca.BYTE / bitsPerChar);
        const length = Math.ceil(seq.length / charsPerByte);
        return Array.from({
            length
        }).map((_, i)=>Array.from({
                length: charsPerByte
            }).map((_, j)=>(seq[j + i * charsPerByte] ?? 0) << bitsPerChar * j
            ).reduce((p, c)=>p | c
            )
        );
    }
    decompress(seq) {
        const bitsPerChar = this.#bitsNeeded(this.chars.length - 1, Rayca.BYTE);
        if (bitsPerChar === undefined) return;
        const charsPerByte = Math.floor(Rayca.BYTE / bitsPerChar);
        const length = this.width * this.height;
        const charBitsMask = this.#bitMask(bitsPerChar);
        return Array.from({
            length
        }).reverse().map((_, i)=>{
            const offset = bitsPerChar * (i % charsPerByte);
            return (seq[Math.floor(i / charsPerByte)] & charBitsMask << offset) >> offset;
        });
    }
    toString(seq) {
        return Array.from({
            length: seq.length
        }).reduce((a, _, i)=>a + (i % this.width === 0 && i !== 0 ? "\n" : "") + this.chars[seq[i]]
        , "");
    }
    fromString(s) {
        return Array.from({
            length: s.length
        }).reduce((a, _, i)=>s.charAt(i) !== "\n" ? [
                ...a,
                this.chars.indexOf(s.charAt(i))
            ] : a
        , []);
    }
    toToken(seq) {
        return btoa(String.fromCharCode(...seq));
    }
    fromToken(s) {
        return atob(s).split("").map((c)=>c.charCodeAt(0)
        );
    }
}
const SEED = 1337 ^ 3735928559;
const random = (seed)=>()=>{
        let t = seed += 1831565813;
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
;
async function copyToClipboard(text) {
    if (navigator?.clipboard !== undefined) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch  {
            return false;
        }
    } else {
        return false;
    }
}
const RAYCA = new Rayca(10, 10, [
    " ",
    "-",
    "="
], random(SEED));
const ART_LIST = document.getElementById("art-list");
const LOAD_MORE = document.getElementById("load-more");
const INFINITE_SCROLL = document.getElementById("infinite-scroll");
if (ART_LIST === null || LOAD_MORE === null || INFINITE_SCROLL === null) {
    throw new Error("a required element does not exists");
}
async function createCardHash(seq) {
    const hash = document.createElement("button");
    const compressed = RAYCA.compress(seq);
    if (compressed !== undefined) {
        if (crypto?.subtle?.digest !== undefined) {
            try {
                const digest = await crypto.subtle.digest("SHA-256", Uint8Array.from(compressed));
                const hashText = Array.from(new Uint8Array(digest)).reduce((a, b)=>a + b.toString(16)
                , "");
                const hashTetShort = hashText.slice(0, 7);
                hash.innerText = "#" + hashTetShort;
                const copyHash = async ()=>{
                    const original = hash.innerText;
                    if (await copyToClipboard(hashText)) {
                        hash.innerText = "Copied";
                    } else {
                        hash.innerText = "Not copied";
                    }
                    setTimeout(()=>hash.innerText = original
                    , 2000);
                };
                hash.addEventListener("submit", copyHash);
                hash.addEventListener("click", copyHash);
            } catch (error) {
                hash.innerText = "Broken hash";
                console.warn(error);
            }
        } else {
            hash.innerText = "Broken hash";
            console.warn("`crypto.subtle.digest()` does not exist");
        }
    } else {
        hash.innerText = "Broken hash";
        console.warn("`Rayca.compress()` is not working");
    }
    return hash;
}
function createCardArt(seq) {
    const art = document.createElement("code");
    art.innerHTML = RAYCA.toString(seq).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
    return art;
}
function createCardToken(seq) {
    const token = document.createElement("button");
    token.innerText = "Own a copy";
    const compressed = RAYCA.compress(seq);
    if (compressed !== undefined) {
        const tokenText = RAYCA.toToken(compressed);
        const copyToken = async ()=>{
            const original = token.innerText;
            if (await copyToClipboard(tokenText)) {
                token.innerText = "Copied";
            } else {
                token.innerText = "Not copied";
            }
            setTimeout(()=>token.innerText = original
            , 2000);
        };
        token.addEventListener("submit", copyToken);
        token.addEventListener("click", copyToken);
    } else {
        token.innerText = "Broken copy";
        console.warn("`Rayca.compress()` is not working");
    }
    return token;
}
async function createCard(seq) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.appendChild(await createCardHash(seq));
    card.appendChild(createCardArt(seq));
    card.appendChild(createCardToken(seq));
    return card;
}
(()=>{
    const ART_LIST_TEXT = document.getElementById("art-list-text");
    if (ART_LIST_TEXT !== null) {
        ART_LIST_TEXT.innerText = "Sorted by randomness";
    }
    const loadMore = async ()=>{
        for(let i = 0; i < 16; i++){
            ART_LIST.appendChild(await createCard(RAYCA.generate()));
        }
    };
    loadMore();
    LOAD_MORE.addEventListener("submit", loadMore);
    LOAD_MORE.addEventListener("click", loadMore);
    const infiniteScroll = {
        _: Boolean(JSON.parse(localStorage.getItem("infiniteScroll") ?? "false")),
        get enabled () {
            return this._;
        },
        set enabled (to){
            this._ = to;
            localStorage.setItem("infiniteScroll", JSON.stringify(this._));
        },
        onscroll () {
            const { scrollTop , scrollHeight , clientHeight  } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 400) {
                loadMore();
            }
        }
    };
    INFINITE_SCROLL.checked = infiniteScroll.enabled;
    if (infiniteScroll.enabled) {
        document.addEventListener("scroll", infiniteScroll.onscroll);
    }
    INFINITE_SCROLL.addEventListener("change", ()=>{
        if (infiniteScroll.enabled && !INFINITE_SCROLL.checked) {
            infiniteScroll.enabled = false;
            document.removeEventListener("scroll", infiniteScroll.onscroll);
        } else if (!infiniteScroll.enabled && INFINITE_SCROLL.checked) {
            infiniteScroll.enabled = true;
            document.addEventListener("scroll", infiniteScroll.onscroll);
        }
    });
})();
