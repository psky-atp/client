const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 1;

const graphemeLen = (text: string): number => {
  let iterator = new Intl.Segmenter().segment(text)[Symbol.iterator]();
  let count = 0;

  while (!iterator.next().done) count++;

  return count;
};

export { graphemeLen, isTouchDevice };
