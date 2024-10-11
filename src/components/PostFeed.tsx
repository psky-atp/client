import {
  Component,
  createEffect,
  createSignal,
  For,
  onMount,
  Signal,
  untrack,
} from "solid-js";
import { PostRecord, DeleteEvent, UpdateEvent } from "../utils/types.js";
import { MAXPOSTS, SERVER_URL } from "../utils/constants.js";
import PostItem from "./PostItem.jsx";
import { loginState } from "./Login.jsx";
import { socket, unreadState } from "../App.jsx";

const PostFeed: Component = () => {
  const [self, setSelf] = createSignal<HTMLDivElement>();
  const [posts, setPosts] = createSignal<Signal<PostRecord>[]>([]);
  let feedSize = 100;
  let cursor = "0";

  const getPosts = async () => {
    const res = await fetch(
      `https://${SERVER_URL}/posts?limit=${MAXPOSTS}&cursor=${cursor}`,
    );
    const json = await res.json();
    cursor = json.cursor.toString();
    return json.posts.map((p: PostRecord) => createSignal<PostRecord>(p));
  };

  createEffect(async () => {
    if (loginState.get().handle) {
      cursor = "0";
      setPosts(await getPosts());
    }
    const thisObj = self()!;
    thisObj.scrollTop = thisObj.scrollHeight;
  });

  onMount(() => {
    socket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      const [nsid, t] = data.$type.split("#");
      if (nsid !== "social.psky.feed.post") return;

      // TODO: Try to refactor this into proper functions
      switch (t) {
        case "create":
          let toScroll = false;
          const thisObj = self()!;
          if (thisObj.scrollTop + 1000 >= thisObj.scrollHeight) toScroll = true;

          setPosts([
            createSignal<PostRecord>(data as PostRecord),
            ...untrack(posts).slice(0, feedSize - 1),
          ]);

          const currUnreadState = unreadState.get();
          if (!document.hasFocus() || currUnreadState.count) {
            unreadState.set({
              ...currUnreadState,
              count: currUnreadState.count + 1,
            });
          }

          if (toScroll) thisObj.scrollTop = thisObj.scrollHeight;
          break;

        case "update":
          data = data as UpdateEvent;
          for (const p of posts()) {
            let post = p[0]();
            if (post.did === data.did && post.rkey === data.rkey) {
              data.handle = post.handle;
              data.indexedAt = post.indexedAt;
              data.nickname = post.nickname;
              p[1](data);
              break;
            }
          }
          break;

        case "delete":
          data = data as DeleteEvent;
          for (const [i, p] of posts().entries()) {
            let post = p[0]();
            if (post.did === data.did && post.rkey === data.rkey) {
              let all = untrack(posts);
              all.splice(i, 1);
              setPosts([...all]);
              break;
            }
          }
          break;
      }
    });
  });

  return (
    <div
      ref={setSelf}
      class="hide-scroll flex max-h-full w-80 flex-col items-center overflow-auto sm:w-[32rem]"
    >
      <div>
        <button
          class="mt-3 bg-stone-600 px-1 py-1 font-bold text-white hover:bg-stone-700"
          onclick={async () => {
            setPosts(posts().concat(await getPosts()));
            feedSize += MAXPOSTS;
          }}
        >
          Load More
        </button>
      </div>
      <div class="flex w-full flex-col-reverse">
        <For each={posts()}>
          {(record, idx) => (
            <PostItem
              isSamePoster={
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

export default PostFeed;
