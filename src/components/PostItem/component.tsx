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
import { composerValue } from "../PostComposer.jsx";
import { RichText as RichTextAPI } from "../../utils/rich-text/lib.js";
import { RichText } from "../RichText/text.jsx";
import { configs } from "../Settings/component.jsx";
import { PostDropdown } from "../PostDropdown/component.jsx";
import { render } from "solid-js/web";
import { isOverflowing } from "../../utils/lib.js";

interface PostItemProps {
  id: string;
  record: Accessor<PostRecord>;
  isSamePoster: () => boolean;
  firstUnread: () => boolean;
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
      classList={() => ({
        "post-item w-full": true,
        "same-poster": props.isSamePoster(),
        "line-separator": configs.get().lineSeparator,
      })}
      firstUnread={props.firstUnread}
    >
      <div
        classList={{
          "flex flex-col w-full": true,
          "mentions-user": mentionsUser(),
        }}
        id={props.id}
      >
        {/* Post */}
        <div class="flex w-full">
          {/* Post Content */}
          <div
            classList={{
              "flex-1 text-sm flex min-w-0 flex-col items-start hoverable-dropdown":
                true,
            }}
          >
            <Show when={!props.isSamePoster()}>
              <span class="flex w-full items-center justify-between gap-x-2 break-words text-sm text-stone-500 dark:text-stone-400">
                <span class="flex w-full min-w-0 grow">
                  <a
                    classList={{
                      "mr-1": props.record().nickname ? true : false,
                      "truncate font-bold text-black dark:text-white": true,
                    }}
                    target="_blank"
                    href={`https://bsky.app/profile/${props.record().handle}`}
                  >
                    {props.record().nickname ?
                      `${props.record().nickname} `
                    : ""}
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

            <div class="flex w-full">
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
      </div>
    </NewMessagesIndicator>
  );
};

interface NewMessagesIndicatorProps {
  class?: string;
  classList?: () => Record<string, boolean>;
  firstUnread: () => boolean;
  children?: JSX.Element;
}
const NewMessagesIndicator: Component<NewMessagesIndicatorProps> = ({
  class: htmlClass,
  classList,
  firstUnread,
  children,
}: NewMessagesIndicatorProps) => {
  return (
    <div
      classList={{
        [`flex flex-col ${htmlClass || ""}`]: true,
        "first-unread": firstUnread(),
        ...classList?.(),
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
    <div ref={setSelf} class="post-text min-w-0 max-w-full flex-1">
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
