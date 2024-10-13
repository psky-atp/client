import "./styles.css";

import {
  Accessor,
  Component,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  on,
  Setter,
  Show,
} from "solid-js";
import { PostRecord } from "../../utils/types.js";
import { isMention } from "../../utils/rich-text/util.js";
import { loginState } from "../Login.js";
import { SocialPskyRichtextFacet } from "@atcute/client/lexicons";
import { composerValue } from "../PostComposer.js";
import { RichText as RichTextAPI } from "../../utils/rich-text/lib.js";
import { RichText } from "../RichText/text.jsx";
import { configs } from "../Settings.js";
import { PostDropdown } from "../PostDropdown.js";
import { render } from "solid-js/web";
import { isOverflowing } from "../../utils/lib.js";

interface PostItemProps {
  id: string;
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
                  loginState.get().session?.sub,
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
          "!py-1": mentionsUser() && !props.isSamePoster(),
        }}
        id={props.id}
      >
        {/* Post Content */}
        <div
          classList={{
            "flex-1 text-sm my-0.5 flex min-w-0 flex-col items-start hoverable-dropdown":
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
                    composerValue.set(
                      `${composerValue.get()}@${props.record().handle} `,
                    )
                  }
                >
                  @{props.record().handle}
                </span>
              </span>

              {((date) => (
                <span
                  title={date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                  class="w-fit shrink-0 text-right font-mono text-xs"
                >
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ))(new Date(props.record().indexedAt))}
            </span>
          </Show>

          <div class="flex min-h-0 w-full flex-1">
            <TextContent
              richText={richText}
              updatedAt={() => props.record().updatedAt}
            />
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

interface TextContentProps {
  richText: Accessor<RichTextAPI>;
  updatedAt: () => number | undefined;
}
const TextContent: Component<TextContentProps> = ({
  richText,
  updatedAt,
}: TextContentProps) => {
  const [self, setSelf] = createSignal<HTMLDivElement>();
  const [edited, setEdited] = createSignal<HTMLSpanElement>();
  const [showMoreOrLess, setShowMoreOrLess] = createSignal<HTMLDivElement>();
  createEffect(
    on([self, edited, richText], ([currSelf, edited, _]) => {
      if (!currSelf) return;
      const undo = () => {
        const button = showMoreOrLess();
        if (!button) return;
        edited && currSelf.appendChild(edited);
        button.remove();
      };

      // Undoes if was already done before (not first iteration)
      undo();
      if (isOverflowing(currSelf)) {
        const grandparent = currSelf.parentElement?.parentElement;
        if (!grandparent) return;

        const newDiv = <ShowMoreOrLess ref={setShowMoreOrLess} affect={self} />;
        render(() => newDiv, grandparent);

        // If edited, ensure it's still overflowing after moving edited tag
        // or else there's no reason to show the "Show more" button
        const button = showMoreOrLess();
        if (edited && button) {
          button.appendChild(edited);
          if (!isOverflowing(currSelf)) {
            button.firstElementChild!.remove();
          }
        }
      }
    }),
  );
  return (
    <div ref={setSelf} class="post-content min-w-0 max-w-full flex-1">
      <RichText value={richText} />
      <Show when={!!updatedAt()}>
        <span ref={setEdited} class="select-none text-xs text-zinc-500">
          {" "}
          (edited)
        </span>
      </Show>
    </div>
  );
};

interface ShowMoreOrLess {
  ref: Setter<HTMLDivElement | undefined>;
  affect: Accessor<HTMLDivElement | undefined>;
}
const ShowMoreOrLess: Component<ShowMoreOrLess> = ({
  ref,
  affect,
}: ShowMoreOrLess) => {
  const [isShowing, setIsShowing] = createSignal(false);
  return (
    <span ref={ref}>
      <a
        onClick={() => {
          let div = affect();
          if (!div) return;
          if (!isShowing()) {
            div.style.maxHeight = "none";
            div.style.display = "block";
            setIsShowing(true);
          } else {
            div.style.removeProperty("max-height");
            div.style.removeProperty("display");
            setIsShowing(false);
          }
        }}
        class="text-sky-500"
      >
        Show {isShowing() ? "less" : "more"}
      </a>
    </span>
  );
};

export default PostItem;
export type { PostItemProps };
