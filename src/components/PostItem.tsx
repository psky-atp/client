import { Accessor, Component, createMemo, JSX, Show } from "solid-js";
import { PostRecord } from "../utils/types.js";
import { isMention } from "../utils/rich-text/util.js";
import { loginState } from "./Login.jsx";
import { SocialPskyRichtextFacet } from "@atcute/client/lexicons";
import { postInput } from "./PostComposer.jsx";
import { RichText as RichTextAPI } from "../utils/rich-text/lib.js";
import { RichText } from "./RichText.jsx";
import { configs } from "./Settings.jsx";
import { PostDropdown } from "./PostDropdown.jsx";

interface PostItemProps {
  isSamePoster: () => boolean;
  firstUnread: () => boolean;
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
                  loginState.get().session?.did,
            ),
        ),
  );

  return (
    <NewMessagesIndicator
      isSamePoster={props.isSamePoster}
      firstUnread={props.firstUnread}
      mentionsUser={mentionsUser}
    >
      <div
        classList={{
          "flex items-start": true,
          "w-full": !mentionsUser(),
          "mentions-user": mentionsUser(),
          "!py-1": mentionsUser() && !props.isSamePoster,
        }}
      >
        {/* Post Content */}
        <div
          classList={{
            "flex-1 text-sm my-0.5 flex min-w-0 max-h-48 flex-col items-start hoverable-dropdown":
              true,
          }}
        >
          <Show when={!props.isSamePoster()}>
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
                    postInput.set(
                      `${postInput.get()}@${props.record().handle} `,
                    )
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

          <div class="flex min-h-0 w-full flex-1">
            <span class="inline-flex min-w-0 flex-1 pr-2">
              <RichText value={richText} />
              <Show when={!!props.record().updatedAt}>
                <span class="select-none text-xs text-zinc-500"> (edited)</span>
              </Show>
            </span>
            <PostDropdown
              record={props.record}
              markAsUnread={props.markAsUnread}
            />
          </div>
        </div>
      </div>
    </NewMessagesIndicator>
  );
};

interface NewMessagesIndicatorProps {
  children?: JSX.Element;
  isSamePoster: () => boolean;
  mentionsUser: () => boolean;
  firstUnread: () => boolean;
}
const NewMessagesIndicator: Component<NewMessagesIndicatorProps> = ({
  children,
  isSamePoster,
  mentionsUser,
  firstUnread,
}: NewMessagesIndicatorProps) => {
  return (
    <div
      classList={{
        "flex flex-col py-1.5": true,
        "mt-[-0.75rem]": isSamePoster(),
        "first-unread": firstUnread(),
        "pt-0 border-t-0 mt-[-0.25rem]": !isSamePoster() && firstUnread(),
        "!mt-[-0.625rem]": isSamePoster() && !firstUnread() && mentionsUser(),
        "border-t dark:border-neutral-800":
          !isSamePoster() && configs.get().lineSeparator,
      }}
      children={children}
    />
  );
};

export default PostItem;
export type { PostItemProps };
