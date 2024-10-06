import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  For,
  onMount,
  Setter,
  untrack,
} from "solid-js";
import { PostRecord } from "../utils/types.js";
import { APP_NAME, MAXPOSTS, SERVER_URL } from "../utils/constants.js";
import PostItem from "./PostItem.jsx";
import { WebSocket } from "partysocket";
import { loginState } from "./Login.jsx";

interface PostFeedProps {
  unreadCount: Accessor<number>;
  setUnreadCount: Setter<number>;
}
const PostFeed: Component<PostFeedProps> = ({
  unreadCount,
  setUnreadCount,
}) => {
  const [posts, setPosts] = createSignal<PostRecord[]>([]);
  const socket = new WebSocket(`wss://${SERVER_URL}/subscribe`);
  let cursor = 0;
  let feedSize = 100;

  createEffect(async () => {
    if (loginState().handle) setPosts(await getPosts(false));
  });

  onMount(() => {
    socket.addEventListener("open", async () => {
      setPosts(await getPosts(false));
    });
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data) as PostRecord;
      setPosts([data, ...untrack(posts).slice(0, feedSize - 1)]);
      const currUnreadCount = unreadCount();
      if (!document.hasFocus() || currUnreadCount) {
        setUnreadCount(currUnreadCount + 1);
        document.title = `(${currUnreadCount + 1}) ${APP_NAME}`;
      }
    });
  });

  const getPosts = async (updateCursor?: boolean) => {
    const res = await fetch(
      `https://${SERVER_URL}/posts?limit=${MAXPOSTS}&cursor=${cursor}`,
    );
    const json = await res.json();
    // HACK: force the cursor to only be updated after a first click
    // fetching getPosts can happen twice:
    // - when connecting to the websocket
    // - when the handle is found, to refresh and show mentions as highlighted
    // this would result in cursor getting updated, then fetching older posts
    cursor = (updateCursor ?? true) ? json.cursor.toString() : "0";
    return json.posts;
  };

  return (
    <div class="flex w-full flex-col items-center">
      <div class="w-full">
        <For each={posts()}>
          {(record, idx) => (
            <PostItem
              record={record}
              class={idx() && idx() == unreadCount() ? "last-post-msg" : ""}
            />
          )}
        </For>
      </div>
      <div>
        <button
          class="mt-3 bg-stone-600 px-1 py-1 font-bold text-white hover:bg-stone-700"
          onclick={async () => {
            cursor = cursor == 0 ? 100 : cursor;
            setPosts(posts().concat(await getPosts()));
            feedSize += MAXPOSTS;
          }}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default PostFeed;
export type { PostFeedProps };
