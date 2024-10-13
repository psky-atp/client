const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 1;

const graphemeLen = (text: string): number => {
  let iterator = new Intl.Segmenter().segment(text)[Symbol.iterator]();
  let count = 0;

  while (!iterator.next().done) count++;

  return count;
};

const MULTILINE_VALIDATOR =
  /\n[\u{0000}-\u{001F}\u{0020}\u{007F}\u{0080}-\u{009F}\u{00A0}\u{00AD}\u{0300}-\u{036F}\u{061C}\u{0F0B}\u{1680}\u{1AB0}-\u{1AFF}\u{1DC0}-\u{1DFF}\u{180E}\u{17B4}\u{17B5}\u{2000}-\u{200F}\u{2028}-\u{202F}\u{205F}\u{2060}-\u{206F}\u{3000}\u{3164}\u{D800}-\u{DFFF}\u{FE00}-\u{FE0F}\u{FE20}-\u{FE2F}\u{FEFF}\u{FFF9}-\u{FFFD}\u{E0000}-\u{E007F}]*\n/gu;
const ensureMultilineValid = (text: string) =>
  text.replace(MULTILINE_VALIDATOR, "\n\n");

const isOverflowing = (element?: Element | null) => {
  return (
    element &&
    (element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight)
  );
};

/// HACK:
/// This function is used to convert a string CSS size to a number size in pixels
/// -prf (joking, Elaina <3)
const convertToPx = (parent: HTMLElement, size: string) => {
  const tempElement = document.createElement("div");
  // Set to absolute so it doesn't get affected by the layout
  tempElement.style.position = "absolute";
  tempElement.style.width = size;

  parent.appendChild(tempElement);
  const computedWidth = getComputedStyle(tempElement).width;
  parent.removeChild(tempElement);

  return parseFloat(computedWidth);
};

const isInView = (el: Element) => {
  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
};

export {
  graphemeLen,
  ensureMultilineValid,
  isOverflowing,
  convertToPx,
  isInView,
  isTouchDevice,
};
