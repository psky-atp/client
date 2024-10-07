import { createMemo } from "solid-js";
import { RichText as RichTextAPI } from "../utils/rich-text/lib.js";

export function RichText({ value }: { value: RichTextAPI | string }) {
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
    <span class="h-full w-full overflow-hidden whitespace-pre-wrap break-words">
      {res}
    </span>
  );
}
