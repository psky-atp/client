import {
	type Accessor,
	type Component,
	For,
	type Setter,
	type Signal,
	createEffect,
	createSignal,
	onCleanup,
	onMount,
	untrack,
} from "solid-js";
import { unreadState } from "../App.jsx";
import { GENERAL_ROOM_URI, MAXPOSTS, SERVER_URL } from "../utils/constants.js";
import { registerCallback, unregisterCallback } from "../utils/socket.js";
import type { DeleteEvent, PostRecord, UpdateEvent } from "../utils/types.js";
import { loginState } from "./login.jsx";
import PostItem from "./post-item/component.jsx";

export const [posts, setPosts] = createSignal<Signal<PostRecord>[]>([]);
export const [feed, setFeed] = createSignal<HTMLDivElement>();

const PostFeed: Component = () => {
	let cursor = "0";
	const getPosts = async () => {
		// FIX: hardcoded room uri
		const res = await fetch(
			`https://${SERVER_URL}/xrpc/social.psky.chat.getMessages?limit=${MAXPOSTS}&cursor=${cursor}&uri=${GENERAL_ROOM_URI}`,
		);
		const json = await res.json();
		cursor = json.cursor.toString();
		return json.messages.map((p: PostRecord) => createSignal<PostRecord>(p));
	};

	const scrollToBottom = () => {
		const parent = feed()?.parentElement;
		if (parent) {
			parent.scrollTop = parent.scrollHeight;
		}
	};

	let previousHandle: string | undefined = "";
	createEffect(async () => {
		const currState = loginState.get();
		if (currState.pendingInit) return;
		if (previousHandle !== currState.handle) {
			cursor = "0";
			previousHandle = currState.handle;
			setPosts(await getPosts());
		}
		scrollToBottom();
	});

	const postCreateCallback = (data: PostRecord) =>
		onPostCreation(
			feed()?.parentElement ?? undefined,
			untrack(posts),
			data,
			setPosts,
		);
	const postUpdateCallback = (data: UpdateEvent) => onPostUpdate(posts(), data);
	const postDeleteCallback = (data: DeleteEvent) =>
		onPostDelete(posts, data, setPosts);
	onMount(() => {
		registerCallback("social.psky.chat.message#create", postCreateCallback);
		registerCallback("social.psky.chat.message#update", postUpdateCallback);
		registerCallback("social.psky.chat.message#delete", postDeleteCallback);
	});
	onCleanup(() => {
		unregisterCallback("social.psky.chat.message#create", postCreateCallback);
		unregisterCallback("social.psky.chat.message#update", postUpdateCallback);
		unregisterCallback("social.psky.chat.message#delete", postDeleteCallback);
	});

	return (
		<div
			ref={setFeed}
			class="flex h-fit w-80 flex-col items-center sm:w-[32rem]"
		>
			<div>
				<button
					type="button"
					class="mt-3 bg-stone-600 px-1 py-1 font-bold text-white hover:bg-stone-700"
					onclick={async () => setPosts(posts().concat(await getPosts()))}
				>
					Load More
				</button>
			</div>
			<div class="flex w-full flex-col-reverse">
				<For each={posts()}>
					{(record, idx) => (
						<PostItem
							id={`${record[0]().did}_${record[0]().rkey}`}
							isSamePoster={() =>
								idx() < posts().length - 1 &&
								posts()[idx() + 1][0]().did === record[0]().did &&
								record[0]().indexedAt - posts()[idx() + 1][0]().indexedAt <
									600000
							}
							firstUnread={() => idx() + 1 === unreadState.get().count}
							record={record[0]}
							markAsUnread={() =>
								unreadState.set({ count: idx() + 1, ignoreOnce: true })
							}
						/>
					)}
				</For>
			</div>
		</div>
	);
};

function onPostDelete(
	posts: Accessor<Signal<PostRecord>[]>,
	data: DeleteEvent,
	setPosts: Setter<Signal<PostRecord>[]>,
) {
	for (const [i, p] of posts().entries()) {
		const post = p[0]();
		if (post.did === data.did && post.rkey === data.rkey) {
			const all = untrack(posts);
			all.splice(i, 1);
			setPosts([...all]);

			const state = unreadState.get();
			if (i + 1 <= state.count)
				unreadState.set({ ...state, count: state.count - 1 });
			break;
		}
	}
}

function onPostUpdate(currPosts: Signal<PostRecord>[], data: UpdateEvent) {
	for (const p of currPosts) {
		const post = p[0]();
		if (post.did === data.did && post.rkey === data.rkey) {
			const newPost = data as PostRecord;
			newPost.handle = post.handle;
			newPost.indexedAt = post.indexedAt;
			newPost.nickname = post.nickname;
			p[1](newPost);
			break;
		}
	}
}

function onPostCreation(
	scrollBox: HTMLElement | undefined,
	currPosts: Signal<PostRecord>[],
	newPost: PostRecord,
	setter: Setter<Signal<PostRecord>[]>,
) {
	let toScroll = false;
	if (!scrollBox) return;

	if (
		scrollBox.scrollTop + scrollBox.clientHeight + 400 >=
		scrollBox.scrollHeight
	) {
		toScroll = true;
	}

	setter([
		createSignal<PostRecord>(newPost as PostRecord),
		...currPosts.slice(
			0,
			currPosts.length < MAXPOSTS ? currPosts.length : currPosts.length - 1,
		),
	]);

	const currUnreadState = unreadState.get();
	if (!document.hasFocus() || currUnreadState.count) {
		unreadState.set({
			...currUnreadState,
			count: currUnreadState.count + 1,
		});
	}

	if (toScroll) scrollBox.scrollTop = scrollBox.scrollHeight;
}

export default PostFeed;
