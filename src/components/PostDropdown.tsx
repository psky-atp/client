import { Accessor, Component, Setter, Show } from "solid-js";
import {
  AiOutlineEllipsis,
  AiOutlineFileText,
  FaSolidPencil,
  FiTrash2,
  IoMailUnreadOutline,
} from "./SVGs.jsx";
import { PostData } from "../utils/types.js";
import { loginState } from "./Login.jsx";
import { editPico } from "./PostComposer.jsx";
import { isTouchDevice } from "../utils/lib.js";

const PostDropdown: Component<{
  record: Accessor<PostData>;
  markAsUnread: () => void;
}> = ({ record, markAsUnread }) => {
  const sessDid = () => loginState().session?.did ?? loginState().did!;

  const deletePico = async (rkey: string) => {
    await loginState()
      .rpc!.call("com.atproto.repo.deleteRecord", {
        data: {
          repo: sessDid(),
          collection: "social.psky.feed.post",
          rkey,
        },
      })
      .catch((err) => console.log(err));
  };

  return (
    <div class="dropdown">
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
        class="dropdown-content z-[1] flex flex-col gap-y-2 rounded-md border border-zinc-400 bg-zinc-100 p-2 text-stone-500 dark:bg-zinc-800 dark:text-stone-400"
      >
        <Show when={record().did === sessDid()}>
          <li
            class="inline-flex w-max cursor-pointer items-center justify-center gap-x-2 text-red-400"
            onClick={(e) => {
              deletePico(record().rkey);
              e.currentTarget.parentElement!.blur();
            }}
          >
            <FiTrash2 class="h-4 w-4" />
            <span class="mt-0.5">Delete</span>
          </li>
        </Show>
        <Show when={record().did === sessDid()}>
          <li
            class="inline-flex w-max cursor-pointer items-center justify-center gap-x-2"
            onClick={() => editPico(record())}
          >
            <span class="h-4 w-4">
              <FaSolidPencil class="m-auto ml-0.5 h-3 w-3" />
            </span>
            <span>Edit</span>
          </li>
        </Show>
        <li
          class="inline-flex w-max cursor-pointer items-center justify-center gap-x-2"
          onClick={(e) => {
            markAsUnread();
            e.currentTarget.parentElement!.blur();
          }}
        >
          <IoMailUnreadOutline class="h-4 w-4" />
          <span>Mark as unread</span>
        </li>
        <li class="inline-flex w-max">
          <a
            href={`https://atproto-browser.vercel.app/at/${record().did}/social.psky.feed.post/${record().rkey}`}
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
