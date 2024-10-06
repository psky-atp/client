import { Component, JSX } from "solid-js";
import { PostRecord } from "../utils/types.js";
import {
  facetSort,
  isLink,
  isMention,
  isRoom,
} from "../utils/rich-text/util.js";
import { loginState } from "./Login.jsx";
import { Brand, SocialPskyRichtextFacet } from "@atcute/client/lexicons";
import { postInput, setPostInput } from "./PostComposer.jsx";
import { graphemeLen } from "../utils/lib.js";
import { CHARLIMIT } from "../utils/constants.js";

interface PostItemProps {
  record: PostRecord;
  class?: string;
}
const PostItem: Component<PostItemProps> = (props: PostItemProps) => {
  let mentionsUser = !!props.record.facets?.find(
    (f) =>
      !!f.features.find(
        (feat) =>
          isMention(feat) &&
          (feat as SocialPskyRichtextFacet.Mention).did ===
            loginState().session?.did,
      ),
  );

  return (
    <div
      class={`flex flex-col items-start gap-x-3 border-b py-1 text-sm dark:border-b-neutral-800 ${props.class ?? ""}`}
    >
      <div
        classList={{
          "my-0.5 flex max-h-40 flex-col items-start": true,
          "w-full": !mentionsUser,
          "bg-neutral-200 dark:bg-neutral-800 mx-[-0.5rem] py-0.5 pl-2 pr-1 w-[102.25%] border-l-2 rounded-md border-zinc-400":
            mentionsUser,
        }}
      >
        <span class="flex w-full items-center justify-between gap-x-2 break-words text-xs text-stone-500 dark:text-stone-400 sm:text-sm">
          <span class="w-full truncate">
            <span class="font-bold text-black dark:text-white">
              {props.record.nickname ? `${props.record.nickname} ` : ""}
            </span>
            <span
              class="cursor-pointer text-zinc-600 dark:text-zinc-400"
              onclick={() => {
                const newInput = `${postInput()}@${props.record.handle} `;
                if (graphemeLen(newInput) > CHARLIMIT) return;
                setPostInput(newInput);
                const textInputElem = document.getElementById(
                  "textInput",
                ) as HTMLInputElement;
                textInputElem.value = postInput();
              }}
            >
              @{props.record.handle}
            </span>
          </span>

          <span class="w-32 text-right font-mono text-xs">
            {new Date(props.record.indexedAt).toLocaleTimeString()}
          </span>
        </span>

        <span class="h-full w-full overflow-hidden whitespace-pre-wrap break-words">
          <RichText text={props.record.post} facets={props.record.facets} />
        </span>
      </div>
    </div>
  );
};

const RichText: Component<{
  text: string;
  facets?: SocialPskyRichtextFacet.Main[];
}> = ({ text, facets }) =>
  facets
    ?.sort(facetSort)
    .reverse()
    .reduce(
      (acc, { index, features }) => {
        // Current is guaranteed to be string
        let curr = acc[0] as unknown as string;
        return [
          curr.slice(0, index.byteStart),
          features.reduce(
            processFeat,
            curr.slice(index.byteStart, index.byteEnd),
          ),
          <>{curr.slice(index.byteEnd)}</>,
          ...acc.slice(1),
        ];
      },
      [text] as (string | JSX.Element)[],
    ) ?? text;

type Feature = Brand.Union<
  | SocialPskyRichtextFacet.Link
  | SocialPskyRichtextFacet.Mention
  | SocialPskyRichtextFacet.Room
>;
const processFeat = (content: string | JSX.Element, feat: Feature) => {
  if (isMention(feat)) {
    return <span class="font-bold">{content}</span>;
  } else if (isLink(feat)) {
    return (
      <a
        target="_blank"
        class="text-sky-500"
        href={(feat as SocialPskyRichtextFacet.Link).uri}
      >
        {content}
      </a>
    );
  } else if (isRoom(feat)) {
    return (
      // <a
      //   target="_blank"
      //   class="text-emerald-500 dark:text-emerald-400"
      //   href={`/room/${(feat as Room).room}`}
      // >
      //   {content}
      // </a>
      <span class="text-emerald-500 dark:text-emerald-400">{content}</span> // TODO: Implement rooms
    );
  } else {
    return <>{content}</>;
  }
};

export default PostItem;
export type { PostItemProps };
