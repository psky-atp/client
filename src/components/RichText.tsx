import { createMemo } from "solid-js";
import { RichText as RichTextAPI } from "../utils/rich-text/lib.js";

interface RichTextProps {
  class?: string;
  value: RichTextAPI | string;
}
export function RichText({ class: htmlClass, value }: RichTextProps) {
  const richText = createMemo(() =>
    value instanceof RichTextAPI ? value : new RichTextAPI({ text: value }),
  );

  const { text, facets } = richText();

  let res;
  if (!!facets?.length) {
    const seg = [];
    // Must access segments via `richText.segments`, not via destructuring
    for (const segment of richText().segments()) {
      if (segment.mention) {
        seg.push(<span class="font-bold">{segment.text}</span>);
      } else if (segment.link) {
        seg.push(
          <a target="_blank" class="text-sky-500" href={segment.link.uri}>
            {segment.text}
          </a>,
        );
      } else if (segment.room) {
        seg.push(
          <span class="text-emerald-500 dark:text-emerald-400">
            {segment.text}
          </span>,
        );
      } else {
        seg.push(<>{segment.text}</>);
      }
    }
    res = seg;
  } else {
    res = text;
  }

  return (
    <span
      class={`h-full w-full overflow-hidden whitespace-pre-wrap break-words ${htmlClass ?? ""}`}
    >
      {res}
    </span>
  );
}
