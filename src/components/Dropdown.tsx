import { Component, Show } from "solid-js";
import {
  AiOutlineEllipsis,
  FaSolidPencil,
  FiTrash2,
  IoWarningOutline,
} from "./SVGs.jsx";
import { PostRecord } from "../utils/types.js";
import { loginState } from "./Login.jsx";

const Dropdown: Component<{ record: PostRecord }> = ({ record }) => {
  return (
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn">
        <AiOutlineEllipsis class="text-stone-500 dark:text-stone-400" />
      </div>
      <ul
        tabindex="0"
        class="dropdown-content z-[1] flex flex-col gap-y-2 rounded-md p-2 text-stone-500 dark:bg-zinc-800 dark:text-stone-400"
      >
        <Show when={record.did === loginState().session?.did}>
          <li class="inline-flex w-max items-center justify-center gap-x-2">
            <FiTrash2 class="h-4 w-4" />
            <span class="mt-0.5">Delete</span>
          </li>
        </Show>
        <Show when={record.did === loginState().session?.did}>
          <li class="inline-flex w-max items-center justify-center gap-x-2">
            <span class="h-4 w-4">
              <FaSolidPencil class="m-auto ml-0.5" />
            </span>
            <span>Edit</span>
          </li>
        </Show>
        <li class="inline-flex w-max items-center justify-center gap-x-2 text-red-400">
          <IoWarningOutline class="h-4 w-4" />
          <span class="mt-0.5">Report</span>
        </li>
      </ul>
    </div>
  );
};

export { Dropdown };
