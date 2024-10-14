import {
  Component,
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Signal,
  untrack,
} from "solid-js";
import { PostRecord, DeleteEvent, UpdateEvent } from "../utils/types.js";
import { MAXPOSTS, SERVER_URL } from "../utils/constants.js";
import PostItem from "./PostItem/component.jsx";
import { loginState } from "./Login.jsx";
import { unreadState } from "../App.jsx";
import { registerCallback, unregisterCallback } from "../utils/socket.js";
import createProp, { Prop } from "../utils/createProp.js";

export const [feed, setFeed] = createSignal<HTMLDivElement>();
type PostStore = Map<string, Signal<PostRecord>>;
export const posts = createProp<PostStore>(
  new Map(),
  function (state: PostStore) {
    return this[1](new Map(state));
  },
);
const setAllPosts = (signals: Signal<PostRecord>[]) =>
  posts.set(
    signals.reduce(
      (acc, p) => acc.set(((p) => `${p.did}_${p.rkey}`)(p[0]()), p),
      posts.get(),
    ),
  );

const PostFeed: Component = () => {
  let cursor = "0";
  const getPosts = async () => {
    const res = await fetch(
      `https://${SERVER_URL}/xrpc/social.psky.chat.getMessages?limit=${MAXPOSTS}&cursor=${cursor}`,
    );
    const json = await res.json();
    cursor = json.cursor.toString();
    return json.messages
      .reverse()
      .map((p: PostRecord) =>
        createSignal<PostRecord>(p),
      ) as Signal<PostRecord>[];
  };

  const scrollToBottom = () => {
    const parent = feed()!.parentElement!;
    parent.scrollTop = parent.scrollHeight;
  };

  let previousHandle: string | undefined = "";
  createEffect(async () => {
    let currState = loginState.get();
    if (currState.pendingInit) return;
    if (previousHandle !== currState.handle) {
      cursor = "0";
      previousHandle = currState.handle;
      posts.signal[1](new Map()); // Reset state
      setAllPosts(await getPosts());
    }
    scrollToBottom();
  });

  const postCreateCallback = (data: PostRecord) =>
    onPostCreation(posts, data, feed()!.parentElement!);
  const postUpdateCallback = (event: UpdateEvent) => onPostUpdate(posts, event);
  const postDeleteCallback = (event: DeleteEvent) => onPostDelete(posts, event);
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
    <div ref={setFeed} class="flex h-fit w-full flex-col items-center px-5">
      <button
        class="my-3 bg-stone-600 px-1 py-1 font-bold text-white hover:bg-stone-700"
        onclick={async () => setAllPosts(await getPosts())}
      >
        Load More
      </button>
      <For each={Array.from(posts.get())}>
        {(entry, idx) => (
          <PostItem
            id={entry[0]}
            record={entry[1][0]}
            isSamePoster={() => {
              const curr = Array.from(posts.get());
              return (
                idx() > 0 &&
                curr[idx() - 1][1][0]().did === entry[1][0]().did &&
                entry[1][0]().indexedAt - curr[idx() - 1][1][0]().indexedAt <
                  600000
              );
            }}
            firstUnread={() => idx() + 1 === unreadState.get().count}
            markAsUnread={() =>
              unreadState.set({ count: idx() + 1, ignoreOnce: true })
            }
          />
        )}
      </For>
    </div>
  );
};

function onPostDelete(posts: Prop<PostStore>, event: DeleteEvent) {
  const id = `${event.did}_${event.rkey}`;
  const curr = posts.get();
  const asArr = Array.from(curr.keys());
  const idx = asArr.indexOf(id);
  if (idx === -1) return;
  curr.delete(id);
  posts.set(curr); // Update state

  let state = unreadState.get();
  if (idx + 1 >= asArr.length - state.count)
    unreadState.set({ ...state, count: state.count - 1 });
}

function onPostUpdate(posts: Prop<PostStore>, event: UpdateEvent) {
  const post = posts.get().get(`${event.did}_${event.rkey}`);
  if (post) {
    const oldPost = post[0]();
    const newPost = event as PostRecord;
    newPost.handle = oldPost.handle;
    newPost.indexedAt = oldPost.indexedAt;
    newPost.nickname = oldPost.nickname;
    post[1](newPost);
  }
}

function onPostCreation(
  posts: Prop<PostStore>,
  data: PostRecord,
  scrollBox: HTMLElement,
) {
  let toScroll = false;
  if (
    scrollBox.scrollTop + scrollBox.clientHeight + 400 >=
    scrollBox.scrollHeight
  )
    toScroll = true;

  const currPosts = untrack(posts.signal[0]);
  if (currPosts.size >= MAXPOSTS) {
    // Remove the first inserted (oldest) post
    const firstKey = currPosts.keys().next().value;
    if (firstKey) currPosts.delete(firstKey);
  }
  // Insert current
  currPosts.set(`${data.did}_${data.rkey}`, createSignal(data));
  // Update state
  posts.set(currPosts);

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
