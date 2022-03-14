import { Something } from './something';

const SEED = 1337 & 0xdeadbeef;
// NOTE: uses mulberry32 seeded random
const RAND =
  (seed: number): (() => number) =>
  () => {
    let t = (seed += 0x6d2b79f5);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
const ST = new Something(10, 10, [' ', '-', '='], RAND(SEED));

function html(data: number[]): HTMLElement {
  const inner = document.createElement('code');
  inner.innerHTML = ST.toString(data)
    .replace(/ /g, '&nbsp;')
    .replace(/\n/g, '<br>');
  return inner;
}

const artList = document.createElement('div');
artList.classList.add('list');
document.getElementById('our-art').appendChild(artList);

function card(data: number[], omitCta = false) {
  const card = document.createElement('div');
  card.setAttribute('aria-label', 'art');
  card.classList.add('card');

  const ascii = html(data);
  ascii.tabIndex = 0;
  if (!omitCta) {
    const openModal = () => {
      const modalWrapper = document.getElementById('modal-wrapper');
      const modalContent = document.getElementById('modal-content');
      modalWrapper.classList.add('active');
      modalContent.innerHTML = card.outerHTML.replace(cta.outerHTML, '');
      history.pushState(null, null, '?token=' + ST.toToken(ST.compress(data)));
    };
    ascii.addEventListener('click', openModal);
    ascii.addEventListener("keydown", (e) => e.key === "Enter" ? openModal() : void(0));
  }

  const number = document.createElement('span');
  number.innerHTML = `#${data
    .map((el, i) => String(el + i).slice(-1))
    .slice(0, 8)
    .join('')}`;

  const cta = document.createElement('a');
  cta.href = '?token=' + ST.toToken(ST.compress(data));
  cta.innerText = 'Own a copy';
  cta.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(cta.href);

    const originalInnerText = cta.innerText;
    cta.innerText = 'Copied!';
    setTimeout(() => (cta.innerText = originalInnerText), 2000);
  });

  card.appendChild(ascii);
  card.appendChild(number);
  !omitCta && card.appendChild(cta);

  return card;
}

const INF_SCROLL_OFF = 400;
const CARDS_TO_INSERT = 16;

function maybeModal() {
  const queryToken = new URLSearchParams(location.search).get('token');
  const modal = document.getElementById('modal-content');
  const modalWrapper = document.getElementById('modal-wrapper');

  if (queryToken) {
    const cardFromUrl = card(ST.decompress(ST.fromToken(queryToken)), true);
    modal.innerHTML = cardFromUrl.outerHTML;
    modalWrapper.classList.add('active');
  } else {
    modalWrapper.classList.remove('active');
  }
}

function nextCards() {
  for (let i = 0; i < CARDS_TO_INSERT; i++) {
    artList.appendChild(card(ST.generate()));
  }
}

nextCards();
maybeModal();

document.addEventListener(
  'scroll',
  () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - INF_SCROLL_OFF) {
      nextCards();
    }
  },
  {
    passive: true,
  }
);

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal-wrapper').classList.remove('active');
  history.pushState(null, null, '/');
});

document.getElementById('modal-wrapper').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    document.getElementById('modal-wrapper').classList.remove('active');
    history.pushState(null, null, '/');
  }
});

window.addEventListener('popstate', maybeModal);
