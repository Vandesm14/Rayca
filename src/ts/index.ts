import { Rayca } from './rayca';
import { toast } from './toast';
import { random, SEED } from './utils';

const RAYCA = new Rayca(10, 10, [' ', '-', '='], random(SEED));

const TOAST_DURATION = 2000;
const INFINITE_SCROLL_OFFSET = 400;
const INFINITE_SCROLL_BATCH = 16;

const cardList = document.getElementById('card-list') as HTMLDivElement;
const loadMore = document.getElementById('load-more') as HTMLAnchorElement;
const infScrollToggle = document.getElementById(
  'inf-scroll-toggle'
) as HTMLInputElement;

/** Creates a new card from a rayca sequence. */
function card(seq: number[]): HTMLElement {
  const card = document.createElement('div');
  card.classList.add('card');

  const id = document.createElement('p');
  id.innerText =
    '#' + seq.slice(0, 8).reduce((p, c, i) => p + String(c + i), '');
  card.append(id);

  const art = document.createElement('code');
  art.innerHTML = RAYCA.toString(seq)
    .replace(/\n/g, '<br>')
    .replace(/ /g, '&nbsp;');
  card.append(art);

  const copy = document.createElement('a');
  copy.innerText = 'Own a copy';
  copy.href = '?token=' + RAYCA.toToken(RAYCA.compress(seq));
  card.append(copy);

  const copyClipboard = (e: Event) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(copy.href)
        .then(() => toast('Copied to clipboard!', 'success', TOAST_DURATION))
        .catch(() => toast('Unable to copy.', 'error', TOAST_DURATION));
    } else {
      toast('Unable to copy.', 'error', TOAST_DURATION);
    }
  };
  copy.addEventListener('click', copyClipboard);
  copy.addEventListener('submit', copyClipboard);

  return card;
}

/** Generates a batch of cards. */
function cardBatch(batch: number): HTMLElement[] {
  return Array.from({ length: batch }).map(() => card(RAYCA.generate()));
}

/** Loads more cards. */
function loadMoreCardBatch(batch: number) {
  cardList.append(...cardBatch(batch));
}

loadMore.addEventListener('click', () =>
  loadMoreCardBatch(INFINITE_SCROLL_BATCH)
);
loadMore.addEventListener('submit', () =>
  loadMoreCardBatch(INFINITE_SCROLL_BATCH)
);

// /** Views a token if one was provided. */
// function viewToken(): boolean {
//   const token = (new URLSearchParams(location.search)).get("token");
//   if (token === null) return false;
//   // ...
//   return true;
// }

// if (!viewToken()) { /* infinite scroll here */ }

function infiniteScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - INFINITE_SCROLL_OFFSET) {
    loadMoreCardBatch(INFINITE_SCROLL_BATCH);
  }
}

// infinite scroll
let infiniteScrollEnabled = false;
infScrollToggle.addEventListener('change', (e) => {
  if (!infiniteScrollEnabled && infScrollToggle.checked) {
    infiniteScrollEnabled = true;
    document.addEventListener('scroll', infiniteScroll, { passive: true });
  } else if (infiniteScrollEnabled && !infScrollToggle.checked) {
    infiniteScrollEnabled = false;
    document.removeEventListener('scroll', infiniteScroll);
  }
});
if (infScrollToggle.checked) {
  infiniteScrollEnabled = true;
  document.addEventListener('scroll', infiniteScroll, { passive: true });
}

cardList.append(...cardBatch(INFINITE_SCROLL_BATCH));
