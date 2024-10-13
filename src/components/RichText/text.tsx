import { Accessor, Component, createMemo } from "solid-js";
import { RichText as RichTextAPI } from "../../utils/rich-text/lib.js";
import ensureMultilineValid from "../../utils/ensureMultilineValid.js";

interface RichTextProps {
  class?: string;
  value: Accessor<RichTextAPI | string>;
}
export const RichText: Component<RichTextProps> = ({
  class: htmlClass,
  value,
}: RichTextProps) => {
  const res = createMemo(() => {
    const val = value();
    const richText =
      val instanceof RichTextAPI ? val : new RichTextAPI({ text: val });
    const { text, facets } = richText;

    if (!!facets?.length) {
      const seg = [];
      // Must access segments via `richText.segments`, not via destructuring
      for (const segment of richText.segments()) {
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
          seg.push(<>{ensureMultilineValid(segment.text)}</>);
        }
      }
      return seg;
    }

    return ensureMultilineValid(text);
  });

  return (
    <span
      class={`overflow-hidden text-ellipsis whitespace-pre-wrap break-words ${htmlClass ?? ""}`}
    >
      {res()}
    </span>
  );
};
