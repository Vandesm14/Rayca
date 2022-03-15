/** Modifies plain text sequences. */
export class Rayca {
  static BYTE = 8;

  width: number;
  height: number;
  /**
   * Used to convert to and from string form and for character count dependent
   * maths.
   */
  chars: string[];
  /** Generates the next random number. */
  random: () => number;

  constructor(
    width: number,
    height: number,
    chars: string[],
    random: () => number
  ) {
    this.width = width;
    this.height = height;
    this.chars = chars;
    this.random = random;
  }

  /** Returns the amount of bits needed to store a number `n`. */
  #bitsNeeded(n: number, max: number): number | undefined {
    return Array.from({ length: max }).findIndex(
      (_, i) => Math.pow(2, i) - 1 >= n
    );
  }

  /** Returns a bit mask for `n` number of bits. */
  #bitMask(n: number): number {
    return Array.from<number>({ length: n }).reduce(
      (a, _, i) => a | (1 << i),
      0
    );
  }

  /** Returns a newly generated sequence. */
  generate(): number[] {
    return Array.from({ length: this.width * this.height }).map(() =>
      Math.floor(this.random() * this.chars.length)
    );
  }

  /** Returns a new sequence of the compressed sequence `seq`. */
  compress(seq: number[]): number[] | undefined {
    const bitsPerChar = this.#bitsNeeded(this.chars.length - 1, Rayca.BYTE);
    if (bitsPerChar === undefined) return;

    const charsPerByte = Math.floor(Rayca.BYTE / bitsPerChar);
    const length = Math.ceil(seq.length / charsPerByte);

    return Array.from({ length }).map((_, i) =>
      Array.from({ length: charsPerByte })
        .map((_, j) => (seq[j + i * charsPerByte] ?? 0) << (bitsPerChar * j))
        .reduce((p, c) => p | c)
    );
  }

  /** Returns a new sequence of the decompressed sequence `seq`. */
  decompress(seq: number[]): number[] | undefined {
    const bitsPerChar = this.#bitsNeeded(this.chars.length - 1, Rayca.BYTE);
    if (bitsPerChar === undefined) return;

    const charsPerByte = Math.floor(Rayca.BYTE / bitsPerChar);
    const length = this.width * this.height;
    const charBitsMask = this.#bitMask(bitsPerChar);

    return Array.from({ length })
      .reverse()
      .map((_, i) => {
        const offset = bitsPerChar * (i % charsPerByte);
        return (
          (seq[Math.floor(i / charsPerByte)] & (charBitsMask << offset)) >>
          offset
        );
      });
  }

  /** Returns a string of the sequence `seq`. */
  toString(seq: number[]): string {
    return Array.from<string>({ length: seq.length }).reduce(
      (a, _, i) =>
        a + (i % this.width === 0 && i !== 0 ? '\n' : '') + this.chars[seq[i]],
      ''
    );
  }

  /** Returns a sequence of the string `s`. */
  fromString(s: string): number[] {
    return Array.from<number[]>({ length: s.length }).reduce(
      (a, _, i) =>
        s.charAt(i) !== '\n' ? [...a, this.chars.indexOf(s.charAt(i))] : a,
      []
    );
  }

  /** Returns a base64 token of the sequence `seq`. */
  toToken(seq: number[]): string {
    return btoa(String.fromCharCode(...seq));
  }

  /** Returns a sequence from the base64 token `s`. */
  fromToken(s: string): number[] {
    return atob(s)
      .split('')
      .map((c) => c.charCodeAt(0));
  }
}
