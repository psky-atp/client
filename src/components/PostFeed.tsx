import { Accessor, Component, createSignal, For, onMount, Setter, untrack } from "solid-js";
import { PostRecord } from "../utils/defs.js";
import { APP_NAME, MAXPOSTS, SERVER_URL } from "../utils/constants.js";
import PostItem from "./PostItem.jsx";

interface PostFeedProps {
  unreadCount: Accessor<number>,
  setUnreadCount: Setter<number>
}
const PostFeed: Component<PostFeedProps> = ({unreadCount, setUnreadCount}) => {
  const [posts, setPosts] = createSignal<PostRecord[]>([]);
  const socket = new WebSocket(`wss://${SERVER_URL}/subscribe`);

  onMount(() => {
    socket.addEventListener("open", async () => {
      setPosts(await getPosts());
    });
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data) as PostRecord;
      setPosts([data, ...untrack(posts).slice(0, MAXPOSTS - 1)]);
      const currUnreadCount = unreadCount();
      if (!document.hasFocus() || currUnreadCount) {
        setUnreadCount(currUnreadCount + 1);
        document.title = `(${currUnreadCount + 1}) ${APP_NAME}`;
      }
    });
  });

  const getPosts = async () => {
    const res = await fetch(`https://${SERVER_URL}/posts?limit=${MAXPOSTS}`);
    return await res.json();
  };

  return (
    <div class="flex w-full flex-col">
      <For each={posts()}>{(record, idx) => <PostItem record={record} class={idx() && idx() == unreadCount() ? 'last-post-msg' : ''}/>}</For>
      <p></p>
    </div>
  );
};

export default PostFeed;
export type { PostFeedProps };