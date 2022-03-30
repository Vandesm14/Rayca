//// IMPORTS ///////////////////////////////////////////////////////////////////

import { Rayca } from "./rayca.ts";

//// UTILITIES /////////////////////////////////////////////////////////////////

const SEED = 1337 ^ 0xdeadbeef;
// NOTE: uses mulberry32 seeded prng
const random = (seed: number): (() => number) =>
  () => {
    let t = (seed += 0x6d2b79f5);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard !== undefined) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  } else {
    return false;
  }
}

//// CONSTANTS /////////////////////////////////////////////////////////////////

const RAYCA = new Rayca(10, 10, [" ", "-", "="], random(SEED));

const ART_LIST = document.getElementById("art-list") as (HTMLDivElement | null);
const LOAD_MORE = document.getElementById(
  "load-more",
) as (HTMLButtonElement | null);
const INFINITE_SCROLL = document.getElementById(
  "infinite-scroll",
) as (HTMLInputElement | null);

if (ART_LIST === null || LOAD_MORE === null || INFINITE_SCROLL === null) {
  throw new Error("a required element does not exists");
}

const COPY_TEXT_TIMEOUT = 2000;
const LOAD_MORE_BATCH = 16;
const INFINITE_SCROLL_OFFSET = 400;

//// CARDS /////////////////////////////////////////////////////////////////////

async function createCardHash(seq: number[]): Promise<HTMLElement> {
  const hash = document.createElement("button");

  const compressed = RAYCA.compress(seq);
  if (compressed !== undefined) {
    if (crypto?.subtle?.digest !== undefined) {
      try {
        const digest = await crypto.subtle.digest(
          "SHA-256",
          Uint8Array.from(compressed),
        );
        const hashText = Array.from(new Uint8Array(digest))
          .reduce((a, b) => a + b.toString(16), "");
        // FIXME: find a way to show the whole hash
        const hashTetShort = hashText.slice(0, 7);

        hash.innerText = "#" + hashTetShort;

        const copyHash = async () => {
          const original = hash.innerText;
          if (await copyToClipboard(hashText)) {
            hash.innerText = "Copied";
          } else {
            hash.innerText = "Not copied";
          }
          setTimeout(() => hash.innerText = original, COPY_TEXT_TIMEOUT);
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

function createCardArt(seq: number[]): HTMLElement {
  const art = document.createElement("code");

  art.innerHTML = RAYCA.toString(seq)
    .replaceAll("\n", "<br>")
    .replaceAll(" ", "&nbsp;");

  return art;
}

function createCardToken(seq: number[]): HTMLElement {
  const token = document.createElement("button");

  token.innerText = "Copy";

  const compressed = RAYCA.compress(seq);
  if (compressed !== undefined) {
    const tokenText = RAYCA.toToken(compressed);

    const copyToken = async () => {
      const original = token.innerText;
      if (await copyToClipboard(tokenText)) {
        token.innerText = "Copied";
      } else {
        token.innerText = "Not copied";
      }
      setTimeout(() => token.innerText = original, COPY_TEXT_TIMEOUT);
    };

    token.addEventListener("submit", copyToken);
    token.addEventListener("click", copyToken);
  } else {
    token.innerText = "Broken copy";
    console.warn("`Rayca.compress()` is not working");
  }

  return token;
}

async function createCardViewModal(seq: number[]): Promise<HTMLElement> {
  const modal = document.createElement("dialog");
  modal.classList.add("card");

  const card = await createCard(seq, { modal: false, float: false });
  modal.append(...card.children);

  return modal;
}

function createCardView(seq: number[], modal: HTMLElement): HTMLElement {
  const view = document.createElement("a");
  view.innerText = "View";

  const compressed = RAYCA.compress(seq);
  if (compressed !== undefined) {
    const tokenText = RAYCA.toToken(compressed);
    view.href = `?token=${tokenText}`;
  } else {
    view.innerText = "Broken link";
    console.warn("`Rayca.compress()` is not working");
  }

  const openModal = (e: Event) => {
    e.preventDefault();
    // @ts-expect-error dialog is very new
    modal.showModal();
  };

  view.addEventListener("submit", openModal);
  view.addEventListener("click", openModal);

  return view;
}

async function createCard(
  seq: number[],
  options = {
    modal: true,
    float: true,
  },
): Promise<HTMLElement> {
  const card = document.createElement("div");
  card.classList.add("card");
  if (options.float) {
    card.classList.add("--float");
  }

  card.appendChild(await createCardHash(seq));
  card.appendChild(createCardArt(seq));

  const cardBottom = document.createElement("div");
  cardBottom.classList.add("bottom");

  cardBottom.appendChild(createCardToken(seq));
  if (options.modal) {
    const viewModal = await createCardViewModal(seq);
    card.appendChild(viewModal);
    cardBottom.appendChild(createCardView(seq, viewModal));
  }

  card.appendChild(cardBottom);

  return card;
}

//// DOCUMENT LOADED ///////////////////////////////////////////////////////////

// NOTE: using an annonymous function to not pollute the global scope
(() => {
  // changes text to show whether javascript is enabled

  const ART_LIST_TEXT = document.getElementById("art-list-text");
  if (ART_LIST_TEXT !== null) {
    ART_LIST_TEXT.innerText = "Sorted by randomness";
  }

  // loads more cards on the page

  const loadMore = async () => {
    for (let i = 0; i < LOAD_MORE_BATCH; i++) {
      ART_LIST.appendChild(await createCard(RAYCA.generate()));
    }
  };
  loadMore();

  LOAD_MORE.addEventListener("submit", loadMore);
  LOAD_MORE.addEventListener("click", loadMore);

  // infinite scrolling to load more cards

  const infiniteScroll = {
    _: Boolean(JSON.parse(localStorage.getItem("infiniteScroll") ?? "false")),
    get enabled(): boolean {
      return this._;
    },
    set enabled(to: boolean) {
      this._ = to;
      localStorage.setItem("infiniteScroll", JSON.stringify(this._));
    },
    onscroll() {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - INFINITE_SCROLL_OFFSET) {
        loadMore();
      }
    },
  };

  INFINITE_SCROLL.checked = infiniteScroll.enabled;
  if (infiniteScroll.enabled) {
    document.addEventListener("scroll", infiniteScroll.onscroll);
  }

  INFINITE_SCROLL.addEventListener("change", () => {
    if (infiniteScroll.enabled && !INFINITE_SCROLL.checked) {
      infiniteScroll.enabled = false;
      document.removeEventListener("scroll", infiniteScroll.onscroll);
    } else if (!infiniteScroll.enabled && INFINITE_SCROLL.checked) {
      infiniteScroll.enabled = true;
      document.addEventListener("scroll", infiniteScroll.onscroll);
    }
  });
})();
