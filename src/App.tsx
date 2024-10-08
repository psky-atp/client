import { createSignal, onMount, type Component } from "solid-js";

import { APP_NAME } from "./utils/constants.js";
import Login from "./components/Login.jsx";
import PostComposer from "./components/PostComposer.jsx";
import PostFeed from "./components/PostFeed.jsx";

const App: Component = () => {
  const [theme, setTheme] = createSignal("");
  const [unreadCount, setUnreadCount] = createSignal(0);

  const resetUnreadCount = () => {
    setUnreadCount(0);
    document.title = APP_NAME;
  };

  onMount(() => {
    if (localStorage.theme !== undefined) setTheme(localStorage.theme);
    else setTheme("light");
    window.addEventListener("blur", resetUnreadCount);
  });

  return (
    <div class="flex flex-col items-center py-4 dark:text-white">
      <div class="relative flex w-80 flex-col items-center sm:w-[32rem]">
        <div class="absolute left-0 top-0 text-sm">
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
        <p class="absolute right-0 top-0 text-xs">
          <a class="text-sky-500" href="https://bsky.app/profile/psky.social">
            @psky.social
          </a>
        </p>
        <Login />
        <PostComposer setUnreadCount={setUnreadCount} />
        <PostFeed setUnreadCount={setUnreadCount} unreadCount={unreadCount} />
      </div>
    </div>
  );
};

export default App;
