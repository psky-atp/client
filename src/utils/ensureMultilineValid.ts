const MULTILINE_VALIDATOR =
  /\n[\u{0000}-\u{001F}\u{0020}\u{007F}\u{0080}-\u{009F}\u{00A0}\u{00AD}\u{0300}-\u{036F}\u{061C}\u{0F0B}\u{1680}\u{1AB0}-\u{1AFF}\u{1DC0}-\u{1DFF}\u{180E}\u{17B4}\u{17B5}\u{2000}-\u{200F}\u{2028}-\u{202F}\u{205F}\u{2060}-\u{2065}\u{206A}-\u{206F}\u{3000}\u{3164}\u{D800}-\u{DFFF}\u{FE00}-\u{FE0F}\u{FE20}-\u{FE2F}\u{FEFF}\u{FFF9}-\u{FFFD}\u{E0000}-\u{E007F}]*\n/gu;
const ensureMultilineValid = (text: string) =>
  text.replace(MULTILINE_VALIDATOR, "\n\n");

export default ensureMultilineValid;
