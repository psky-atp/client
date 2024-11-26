import { type Accessor, type Component, Show } from "solid-js";
import { deletePico } from "../utils/api.js";
import { isTouchDevice } from "../utils/lib.js";
import type { PostData } from "../utils/types.js";
import { getSessionDid } from "./login.jsx";
import { editPico } from "./post-composer.jsx";
import {
	AiOutlineEllipsis,
	AiOutlineFileText,
	FaSolidPencil,
	FiTrash2,
	IoMailUnreadOutline,
} from "./svg.jsx";

const PostDropdown: Component<{
	record: Accessor<PostData>;
	markAsUnread: () => void;
}> = ({ record, markAsUnread }) => {
	const handleKeyPress = (e: KeyboardEvent, action: () => void) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			action();
		}
	};

	const handleBlur = (element: HTMLElement) => {
		element.parentElement?.blur();
	};

	return (
		<div class="dropdown min-w-fit pl-2">
			<button
				type="button"
				class={`btn ${!isTouchDevice ? "opacity-0 trigger" : ""}`}
			>
				<AiOutlineEllipsis class="text-stone-500 dark:text-stone-400" />
			</button>
			<ul
				tabindex="0"
				class="dropdown-content z-[1] flex flex-col rounded-md border border-zinc-400 bg-zinc-100 p-2 text-stone-500 dark:bg-zinc-800 dark:text-stone-400"
			>
				<Show when={record().did === getSessionDid()}>
					<li
						class="text-red-500 hover:!bg-red-200 dark:hover:!bg-red-950"
						onClick={(e) => {
							deletePico(record().rkey);
							handleBlur(e.currentTarget);
						}}
						onKeyDown={(e) =>
							handleKeyPress(e, () => {
								deletePico(record().rkey);
								handleBlur(e.currentTarget);
							})
						}
						tabindex="0"
						role="button"
					>
						<FiTrash2 class="h-4 w-4" />
						<span class="mt-0.5">Delete</span>
					</li>
				</Show>
				<Show when={record().did === getSessionDid()}>
					<li
						onClick={() => editPico.set(record())}
						onKeyDown={(e) => handleKeyPress(e, () => editPico.set(record()))}
						tabindex="0"
						role="button"
					>
						<span class="h-4 w-4">
							<FaSolidPencil class="m-auto ml-0.5 h-3 w-3" />
						</span>
						<span>Edit</span>
					</li>
				</Show>
				<li
					onClick={(e) => {
						markAsUnread();
						handleBlur(e.currentTarget);
					}}
					onKeyDown={(e) =>
						handleKeyPress(e, () => {
							markAsUnread();
							handleBlur(e.currentTarget);
						})
					}
					tabindex="0"
					role="button"
				>
					<IoMailUnreadOutline class="h-4 w-4" />
					<span>Mark as unread</span>
				</li>
				<li>
					<a
						href={`https://pdsls.dev/at/${
							record().did
						}/social.psky.chat.message/${record().rkey}`}
						class="inline-flex w-max cursor-pointer items-center justify-center gap-x-2"
						target="_blank"
						rel="noreferrer"
					>
						<AiOutlineFileText class="h-4 w-4" />
						<span>View Record</span>
					</a>
				</li>
			</ul>
		</div>
	);
};

export { PostDropdown };
