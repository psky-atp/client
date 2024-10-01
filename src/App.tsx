import { createSignal, For, onMount, type Component } from "solid-js";

const CHARLIMIT = 12;
const MAXPOSTS = 50;
const DID = "did:plc:tvvjkkw276ge47luiaq3uodr";

type PostRecord = {
  rkey: string;
  post: string;
  indexedAt: number;
};

const PostFeed: Component = () => {
  const [posts, setPosts] = createSignal<PostRecord[]>([]);
  const socket = new WebSocket("ws://localhost:8080/subscribe");

  onMount(async () => {
    setPosts(await getPosts());
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data) as PostRecord;
      setPosts([data, ...posts().slice(0, MAXPOSTS - 1)]);
    });
  });

  const getPosts = async () => {
    const res = await fetch("http://localhost:8080/posts");
    const json = await res.json();
    return json;
  };

  return (
    <div class="flex flex-col">
      <For each={posts()}>
        {(record) => (
          <a
            target="_blank"
            href={`https://bsky.app/profile/${DID}/post/${record.rkey}`}
          >
            <span class="flex gap-x-2 hover:bg-slate-200">
              <span class="w-48 truncate">{record.post}</span>
              <span>{new Date(record.indexedAt).toLocaleTimeString()}</span>
            </span>
          </a>
        )}
      </For>
      <p></p>
    </div>
  );
};

const PostComposer: Component = () => {
  let postInput = "";
  const segmenter = new Intl.Segmenter();

  const graphemeLen = (text: string): number => {
    let iterator = segmenter.segment(text)[Symbol.iterator]();
    let count = 0;

    while (!iterator.next().done) count++;

    return count;
  };

  const sendPost = async (post: string) => {
    await fetch("http://localhost:8080/post", {
      method: "POST",
      body: JSON.stringify({ post: post }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div>
      <form
        id="postForm"
        onsubmit={(e) => {
          e.currentTarget.reset();
          e.preventDefault();
        }}
      >
        <input
          type="text"
          id="post"
          placeholder="12 chars max"
          required
          class="mb-4 mr-2 w-48 border border-black px-2 py-1"
          onInput={(e) => (postInput = e.currentTarget.value)}
          onPaste={(e) => {
            if (
              graphemeLen(e.clipboardData?.getData("text") ?? "") >= CHARLIMIT
            )
              e.preventDefault();
          }}
          onBeforeInput={(e) => {
            if (e.data && graphemeLen(postInput) >= CHARLIMIT)
              e.preventDefault();
          }}
        />
        <button
          onclick={() => {
            if (postInput.length) sendPost(postInput);
            postInput = "";
          }}
          class="bg-slate-500 px-2 py-1 font-bold text-white hover:bg-slate-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

const App: Component = () => {
  return (
    <div class="m-5 flex flex-col items-center font-mono">
      <h1 class="mb-5 text-2xl">picosky</h1>
      <PostComposer />
      <PostFeed />
    </div>
  );
};

export default App;
