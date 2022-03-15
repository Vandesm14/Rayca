export const SEED = 1337 ^ 0xdeadbeef;
/** Generates random numbers using mulberry32. */
export const random =
  (seed: number): (() => number) =>
  () => {
    let t = (seed += 0x6d2b79f5);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
