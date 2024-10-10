import { Accessor, Component, createMemo, Setter, Show } from "solid-js";
import { PostRecord } from "../utils/types.js";
import { isMention } from "../utils/rich-text/util.js";
import { loginState } from "./Login.jsx";
import { SocialPskyRichtextFacet } from "@atcute/client/lexicons";
import { postInput, setPostInput } from "./PostComposer.jsx";
import { RichText as RichTextAPI } from "../utils/rich-text/lib.js";
import { RichText } from "./RichText.jsx";
import { configs } from "./Settings.jsx";
import { PostDropdown } from "./PostDropdown.jsx";

interface PostItemProps {
  isSamePoster: boolean;
  firstUnread: boolean;
  record: Accessor<PostRecord>;
  markAsUnread: () => void;
}
const PostItem: Component<PostItemProps> = (props: PostItemProps) => {
  const richText = createMemo(() => {
    const record = props.record();
    return new RichTextAPI({
      text: record.post,
      facets: record.facets,
    });
  });

  const mentionsUser = createMemo(
    () =>
      !!props
        .record()
        .facets?.find(
          (f) =>
            !!f.features.find(
              (feat) =>
                isMention(feat) &&
                (feat as SocialPskyRichtextFacet.Mention).did ===
                  loginState().session?.did,
            ),
        ),
  );

  return (
    <div
      classList={{
        "flex flex-col items-start gap-x-3 text-sm py-1.5 hoverable-dropdown":
          true,
        "mt-[-0.75rem]": props.isSamePoster,
        "border-t dark:border-neutral-800":
          !props.isSamePoster && configs().lineSeparator,
        "first-unread": props.firstUnread,
        "pt-0 border-t-0 mt-[-0.25rem]":
          !props.isSamePoster && props.firstUnread,
      }}
    >
      <div
        classList={{
          "my-0.5 flex max-h-40 flex-col items-start": true,
          "w-full": !mentionsUser(),
          "bg-neutral-200 dark:bg-neutral-800 mx-[-0.5rem] py-0.5 pl-2 pr-1 w-[102.25%] border-l-2 rounded-md border-zinc-400":
            mentionsUser(),
        }}
      >
        <Show when={!props.isSamePoster}>
          <span class="mb-1 flex w-full items-center justify-between gap-x-2 break-words text-sm text-stone-500 dark:text-stone-400">
            <span class="flex w-full min-w-0 grow">
              <a
                classList={{
                  "mr-1": props.record().nickname ? true : false,
                  "truncate font-bold text-black dark:text-white": true,
                }}
                target="_blank"
                href={`https://bsky.app/profile/${props.record().handle}`}
              >
                {props.record().nickname ? `${props.record().nickname} ` : ""}
              </a>
              <span
                class="w-fit max-w-full shrink-0 cursor-pointer truncate text-zinc-600 dark:text-zinc-400"
                onclick={() =>
                  setPostInput(`${postInput()}@${props.record().handle} `)
                }
              >
                @{props.record().handle}
              </span>
            </span>

            <span class="w-fit shrink-0 text-right font-mono text-xs">
              {new Date(props.record().indexedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </span>
        </Show>

        <div class="flex h-full w-full">
          <span class="h-full w-full flex-1 pr-2">
            <RichText value={richText} />
            <Show when={!!props.record().updatedAt}>
              {" "}
              <span class="select-none text-xs text-zinc-500">(edited)</span>
            </Show>
          </span>
          <PostDropdown
            record={props.record}
            markAsUnread={props.markAsUnread}
          />
        </div>
      </div>
    </div>
  );
};

export default PostItem;
export type { PostItemProps };
