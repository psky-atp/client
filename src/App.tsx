import { createSignal, For, onMount, type Component } from "solid-js";
import { WebSocket } from "partysocket";

const CHARLIMIT = 12;
const MAXPOSTS = 50;
const DID = "did:plc:bpmiiiabnbf2hf7uuqdbjne6";
const SERVER_URL = "https://pico.api.bsky.mom";
const WEBSOCKET = "wss://pico.api.bsky.mom/subscribe";

type PostRecord = {
  rkey: string;
  post: string;
  indexedAt: number;
};

const PostFeed: Component = () => {
  const [posts, setPosts] = createSignal<PostRecord[]>([]);
  const socket = new WebSocket(WEBSOCKET!);

  onMount(() => {
    socket.addEventListener("open", async () => {
      setPosts(await getPosts());
    });
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data) as PostRecord;
      setPosts([data, ...posts().slice(0, MAXPOSTS - 1)]);
    });
  });

  const getPosts = async () => {
    const res = await fetch(`${SERVER_URL}/posts`);
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
            <span class="flex gap-x-2 hover:bg-slate-200 dark:hover:bg-zinc-700">
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
  const [theme, setTheme] = createSignal("");
  let postInput = "";
  const segmenter = new Intl.Segmenter();

  onMount(() => {
    if (localStorage.theme !== undefined) setTheme(localStorage.theme);
    else setTheme("light");
  });
  const graphemeLen = (text: string): number => {
    let iterator = segmenter.segment(text)[Symbol.iterator]();
    let count = 0;

    while (!iterator.next().done) count++;

    return count;
  };

  const sendPost = async (post: string) => {
    await fetch(`${SERVER_URL}/post`, {
      method: "POST",
      body: JSON.stringify({ post: post }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div class="mb-4 flex items-center">
      <div class="mr-4 w-10">
        <button
          onclick={() => {
            localStorage.theme =
              localStorage.theme === "light" || !localStorage.theme ?
                "dark"
              : "light";
            if (localStorage.theme === "dark")
              document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
            setTheme(localStorage.theme);
          }}
        >
          {theme() == "dark" ? "light" : "dark"}
        </button>
      </div>
      <form
        class="items-center"
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
          size="12"
          class="mr-2 border border-black px-2 py-1 dark:border-white dark:bg-neutral-700"
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
          class="bg-slate-500 px-2 py-1 font-bold text-white hover:bg-slate-700 dark:bg-stone-600 dark:hover:bg-stone-700"
        >
          pico
        </button>
      </form>
    </div>
  );
};

const App: Component = () => {
  return (
    <div class="flex flex-col items-center p-5 font-mono dark:text-white">
      <h1 class="mb-3 text-2xl">picosky</h1>
      <p class="text-xs">
        original idea by{" "}
        <a class="text-sky-500" href="https://bsky.app/profile/cam.fyi">
          @cam.fyi
        </a>
      </p>
      <p class="mb-3 text-xs">
        developed by{" "}
        <a class="text-sky-500" href="https://bsky.app/profile/bsky.mom">
          @bsky.mom
        </a>
      </p>
      <PostComposer />
      <PostFeed />
    </div>
  );
};

export default App;
