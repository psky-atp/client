import { Component } from "solid-js";
import { PostRecord } from "../utils/types.js";

interface PostItemProps {
  record: PostRecord;
  class?: string;
}
const PostItem: Component<PostItemProps> = (props: PostItemProps) => {
  return (
    <div
      class={`flex flex-col items-start gap-x-3 border-b py-1 text-sm dark:border-b-neutral-800 ${props.class ?? ""}`}
    >
      <div class="my-0.5 flex max-h-40 w-full flex-col items-start">
        <span class="flex w-full items-center justify-between gap-x-2 break-words text-xs text-stone-500 dark:text-stone-400">
          <span>
            <span class="text-violet-600 dark:text-violet-400">
              {props.record.nickname ? `${props.record.nickname} ` : ""}
            </span>
            <a
              class="truncate"
              target="_blank"
              href={`https://bsky.app/profile/${props.record.handle}`}
            >
              @{props.record.handle}{" "}
            </a>
          </span>

          <span class="w-32 text-right">
            {new Date(props.record.indexedAt).toLocaleTimeString()}
          </span>
        </span>
        <span class="h-full w-full overflow-hidden whitespace-pre-wrap break-words font-sans">
          {props.record.post}
        </span>
      </div>
    </div>
  );
};

export default PostItem;
export type { PostItemProps };
