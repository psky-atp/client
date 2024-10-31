import { Accessor, Component, Show } from "solid-js";
import {
  AiOutlineEllipsis,
  AiOutlineFileText,
  FaSolidPencil,
  FiTrash2,
  IoMailUnreadOutline,
} from "./SVGs.jsx";
import { PostData } from "../utils/types.js";
import { getSessionDid } from "./Login.jsx";
import { editPico } from "./PostComposer.jsx";
import { isTouchDevice } from "../utils/lib.js";
import { deletePico } from "../utils/api.js";

const PostDropdown: Component<{
  record: Accessor<PostData>;
  markAsUnread: () => void;
}> = ({ record, markAsUnread }) => {
  return (
    <div class="dropdown min-w-fit pl-2">
      <div
        tabindex="0"
        role="button"
        classList={{
          btn: true,
          "opacity-0 trigger": !isTouchDevice,
        }}
      >
        <AiOutlineEllipsis class="text-stone-500 dark:text-stone-400" />
      </div>
      <ul
        tabindex="0"
        class="dropdown-content z-[1] flex flex-col rounded-md border border-zinc-400 bg-zinc-100 p-2 text-stone-500 dark:bg-zinc-800 dark:text-stone-400"
      >
        <Show when={record().did === getSessionDid()}>
          <li
            class="text-red-500 hover:!bg-red-200 dark:hover:!bg-red-950"
            onClick={(e) => {
              deletePico(record().rkey);
              e.currentTarget.parentElement!.blur();
            }}
          >
            <FiTrash2 class="h-4 w-4" />
            <span class="mt-0.5">Delete</span>
          </li>
        </Show>
        <Show when={record().did === getSessionDid()}>
          <li onClick={() => editPico.set(record())}>
            <span class="h-4 w-4">
              <FaSolidPencil class="m-auto ml-0.5 h-3 w-3" />
            </span>
            <span>Edit</span>
          </li>
        </Show>
        <li
          onClick={(e) => {
            markAsUnread();
            e.currentTarget.parentElement!.blur();
          }}
        >
          <IoMailUnreadOutline class="h-4 w-4" />
          <span>Mark as unread</span>
        </li>
        <li>
          <a
            href={`https://pdsls.dev/at/${record().did}/social.psky.chat.message/${record().rkey}`}
            class="inline-flex w-max cursor-pointer items-center justify-center gap-x-2"
            target="_blank"
          >
            <AiOutlineFileText class="h-4 w-4" />
            <span>View Record</span>
          </a>
        </li>
        {/* <li class="inline-flex w-max items-center justify-center gap-x-2 text-red-400">
          <IoWarningOutline class="h-4 w-4" />
          <span class="mt-0.5">Report</span>
        </li> */}
      </ul>
    </div>
  );
};

export { PostDropdown };
