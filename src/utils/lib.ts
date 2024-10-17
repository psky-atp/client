const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 1;

const graphemeLen = (text: string): number => {
  let iterator = new Intl.Segmenter().segment(text)[Symbol.iterator]();
  let count = 0;

  while (!iterator.next().done) count++;

  return count;
};

const MULTILINE_VALIDATOR = (() => {
  let pattern = "";
  // Other: Control + Format + Surrogate + Private_Use + Unassigned
  pattern += "\\p{C}";
  // Separator: Space_Separator + Line_Separator + Paragraph_Separator
  pattern += "\\p{Z}";
  // Mark: Nonspacing_Mark + Spacing_Mark + Enclosing_Mark
  pattern += "\\p{M}";
  // Invisible Letters (yes, I know... unicode is damn weird hahaha)
  pattern += "\\u{115F}\\u{1160}\\u{3164}\\u{FFA0}";
  // Invisible Symbols
  pattern += "\\u{2800}\\u{FFFC}\\u{1D159}";
  // Pattern will look for two or more line breaks in a row, even if someone
  // tries to add invalid characters in between to bypass the validation
  return new RegExp(`\\n[${pattern}]*\\n`, "gu");
})();
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
