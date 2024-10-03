import { createSignal, For, onMount, untrack, type Component } from "solid-js";
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

let unreadCount = 0;

const PostFeed: Component = () => {
  const [posts, setPosts] = createSignal<PostRecord[]>([]);
  const socket = new WebSocket(WEBSOCKET!);

  onMount(() => {
    socket.addEventListener("open", async () => {
      setPosts(await getPosts());
    });
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data) as PostRecord;
      setPosts([data, ...untrack(posts).slice(0, MAXPOSTS - 1)]);
      if (!document.hasFocus()) {
        unreadCount++;
        document.title = `(${unreadCount}) picosky`;
      }
    });
  });

  const getPosts = async () => {
    const res = await fetch(`${SERVER_URL}/posts`);
    return await res.json();
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
  const [saveToggle, setSaveToggle] = createSignal(false);
  const [firstChar, setFirstChar] = createSignal("");
  let postInput = "";
  const segmenter = new Intl.Segmenter();

  onMount(() => {
    setSaveToggle(
      localStorage.getItem("saveFirstChar") === "true" ? true : false,
    );

    setFirstChar(localStorage.getItem("firstChar") ?? "");
    const textInputElem = document.getElementById(
      "textInput",
    ) as HTMLInputElement;
    if (saveToggle() && firstChar()) {
      textInputElem.setAttribute("value", firstChar());
      textInputElem.value = firstChar();
    }
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
    <div class="mb-4 flex">
      <div class="mr-2 flex w-16 items-center">
        <input
          type="checkbox"
          id="saveChar"
          checked={saveToggle()}
          class="ml-3 mr-2 accent-stone-600"
          onChange={(e) => {
            setSaveToggle(e.currentTarget.checked);
            localStorage.setItem(
              "saveFirstChar",
              saveToggle() ? "true" : "false",
            );
            if (!saveToggle()) {
              const textInputElem = document.getElementById(
                "textInput",
              ) as HTMLInputElement;
              textInputElem.setAttribute("value", "");
              textInputElem.value = "";
            }
          }}
        />
        <label for="saveChar" class="text-xs">
          save char
        </label>
      </div>
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
            id="textInput"
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
              if (!postInput.length) return;
              sendPost(postInput);
              if (saveToggle()) {
                setFirstChar([...segmenter.segment(postInput)][0].segment);
                const textInputElem = document.getElementById(
                  "textInput",
                ) as HTMLInputElement;
                textInputElem.setAttribute("value", firstChar());
                textInputElem.value = firstChar();
                localStorage.setItem("firstChar", firstChar());
              }
              postInput = saveToggle() ? firstChar() : "";
            }}
            class="bg-stone-600 px-1 py-1 text-sm font-bold text-white hover:bg-stone-700"
          >
            pico
          </button>
        </form>
      </div>
    </div>
  );
};

const App: Component = () => {
  const [theme, setTheme] = createSignal("");

  onMount(() => {
    if (localStorage.theme !== undefined) setTheme(localStorage.theme);
    else setTheme("light");

    window.addEventListener("focus", () => {
      unreadCount = 0;
      document.title = "picosky";
    });
  });

  return (
    <div class="flex flex-col items-center p-5 font-mono dark:text-white">
      <h1 class="mb-3 text-2xl">picosky</h1>
      <div class="absolute left-5 top-5 mr-4 w-10 text-sm">
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
