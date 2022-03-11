const WIDTH = 20;
const HEIGHT = 10;
const CHARS = [" ", "-", "="];

function gen() {
  return Array(WIDTH * HEIGHT).fill(0).map(() => {
    return Math.floor(Math.random() * CHARS.length);
  });
}

function comp(data) {
  const res = [];
  for (let i = 0; i < data.length; i += 4) {
    res.push(
      (data[i] << 6) | (data[i + 1] << 4) | (data[i + 2] << 2) | data[i + 3],
    );
  }
  return res;
}

function decomp(data) {
  const res = [];
  for (let i = 0; i < data.length; i++) {
    res.push((data[i] & 0b11000000) >> 6);
    res.push((data[i] & 0b00110000) >> 4);
    res.push((data[i] & 0b00001100) >> 2);
    res.push(data[i] & 0b00000011);
  }
  return res;
}

function ser(data) {
  return btoa(data.map((v) => String.fromCodePoint(v)).join(""));
}

function de(data) {
  return atob(data).split("").map((v) => v.codePointAt(0));
}

function view(data) {
  let res = "┌────────────────────┐\n│";
  for (let i = 0; i < data.length; i++) {
    if (i % WIDTH === 0 && i !== 0) res += "│\n│";
    res += CHARS[data[i]];
  }
  return res + "│\n└────────────────────┘";
}

const appendMore = (amount = 20) => {
  for (let i = 0; i < amount; i++) {
    const el = document.createElement("p");
    const art = gen();

    el.innerHTML = view(art).replace(/ /g, '&nbsp;');
    el.innerHTML += `<a href="?token=${ser(comp(art))}">
      <br><i>$${art.reduce((p, c) => p + c)}</i>
    </a>`;

    document.getElementById("list").appendChild(el);
  }
}

const scrollListener = () => {
  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    appendMore();
  }
};

const token = new URLSearchParams(location.search).get("token");
const isValidToken = (token) => {
  if (!token) return false;
  if (token.length !== 68) return false;
  if (/[^A-Za-z0-9+/=]/.test(token)) return false;
  return true;
};

if (!isValidToken(token)) {
  document.addEventListener('scroll', scrollListener, {
    passive: true
  });
  appendMore();
} else {
  const el = document.createElement("p");
  el.innerHTML = view(decomp(de(token))).replace(/ /g, "&nbsp;");
  el.innerHTML += `<br><i>$${decomp(de(token)).reduce((p, c) => p + c)}</i>`;
  el.innerHTML += `<br><br><a href="/">&lt;- Go back</a>`;
  document.getElementById("list").appendChild(el);
}
