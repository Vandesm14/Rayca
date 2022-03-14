export class Something {
  #BYTE = 8;

  width: number;
  height: number;
  chars: string[];
  rand: () => number;

  constructor(
    width: number,
    height: number,
    chars: string[],
    rand: () => number
  ) {
    this.width = width;
    this.height = height;
    this.chars = chars;
    this.rand = rand;
  }

  #bitsNeeded(n: number, max: number): number | undefined {
    for (let i = 0; i < max; i++) {
      if (Math.pow(2, i) - 1 >= n) return i;
    }
  }

  #bitMask(n: number): number {
    return Array.from<number>({ length: n }).reduce(
      (a, _, i) => a | (1 << i),
      0
    );
  }

  /** Generates new data. */
  generate() {
    return Array.from({ length: this.width * this.height }).map(() =>
      Math.floor(this.rand() * this.chars.length)
    );
  }

  /** Compresses data. */
  compress(data: number[]): number[] | undefined {
    const bitsPerChar = this.#bitsNeeded(this.chars.length - 1, this.#BYTE);
    if (bitsPerChar === undefined) return;

    const charsPerByte = Math.floor(this.#BYTE / bitsPerChar);
    const length = Math.ceil(data.length / charsPerByte);

    return Array.from({ length }).map((_, i) => {
      return Array.from({ length: charsPerByte })
        .map((_, j) => (data[j + i * charsPerByte] ?? 0) << (bitsPerChar * j))
        .reduce((p, c) => p | c);
    });
  }

  /** Decompresses data. */
  decompress(data: number[]): number[] | undefined {
    const bitsPerChar = this.#bitsNeeded(this.chars.length - 1, this.#BYTE);
    if (bitsPerChar === undefined) return;

    const charsPerByte = Math.floor(this.#BYTE / bitsPerChar);
    const length = this.width * this.height;
    const charBitsMask = this.#bitMask(bitsPerChar);

    return Array.from({ length })
      .reverse()
      .map((_, i) => {
        const offset = bitsPerChar * (i % charsPerByte);
        return (
          (data[Math.floor(i / charsPerByte)] & (charBitsMask << offset)) >>
          offset
        );
      });
  }

  /** Converts data into its string form. */
  toString(data: number[]): string {
    return Array.from<string>({ length: data.length }).reduce(
      (a, _, i) =>
        a + (i % this.width === 0 && i !== 0 ? '\n' : '') + this.chars[data[i]],
      ''
    );
  }

  /** Converts data from its string form. */
  fromString(data: string): number[] {
    return Array.from<number[]>({ length: data.length }).reduce(
      (a, _, i) =>
        data.charAt(i) !== '\n'
          ? [...a, this.chars.indexOf(data.charAt(i))]
          : a,
      []
    );
  }

  /** Converts data into its token form. */
  toToken(data: number[]): string {
    return btoa(String.fromCharCode(...data));
  }

  /** Converts data from its token form. */
  fromToken(data: string): number[] {
    return atob(data)
      .split('')
      .map((c) => c.charCodeAt(0));
  }
}
