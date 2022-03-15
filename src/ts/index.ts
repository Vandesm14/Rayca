import { Rayca } from './rayca';
import { toast } from './toast';
import { random, SEED } from './utils';

const RAYCA = new Rayca(10, 10, [' ', '-', '='], random(SEED));
const TOAST_DURATION = 2000;
const INFINITE_SCROLL_OFFSET = 400;
const INFINITE_SCROLL_BATCH = 16;

/** Creates a new card from a rayca sequence. */
function card(seq: number[]): HTMLElement {
  const card = document.createElement('div');
  card.classList.add('card');

  const id = document.createElement('p');
  id.innerText =
    '#' +
    seq
      .slice(0, 8)
      .map((c, i) => String(c + i).slice(-1))
      .join('');
  card.appendChild(id);

  const art = document.createElement('code');
  art.innerHTML = RAYCA.toString(seq)
    .replace(/\n/g, '<br>')
    .replace(/ /g, '&nbsp;');
  card.appendChild(art);

  const copy = document.createElement('a');
  copy.innerText = 'Own a copy';
  copy.href = '?token=' + RAYCA.toToken(RAYCA.compress(seq));
  card.appendChild(copy);

  const copyClipboard = (e: Event) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(copy.href);
      toast('Copied to clipboard!', 'success', TOAST_DURATION);
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

// /** Views a token if one was provided. */
// function viewToken(): boolean {
//   const token = (new URLSearchParams(location.search)).get("token");
//   if (token === null) return false;
//   // ...
//   return true;
// }

// if (!viewToken()) { /* infinite scroll here */ }

// infinite scroll
document.addEventListener(
  'scroll',
  () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - INFINITE_SCROLL_OFFSET) {
      document
        .getElementById('card-list')
        .append(...cardBatch(INFINITE_SCROLL_BATCH));
    }
  },
  { passive: true }
);
