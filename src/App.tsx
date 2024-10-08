import { createSignal, onMount, Show, type Component } from "solid-js";

import { APP_NAME } from "./utils/constants.js";
import Login, { isLoggedIn, logout } from "./components/Login.jsx";
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
    <div
      classList={{
        "pb-4": isLoggedIn() ? false : true,
        "flex flex-col items-center dark:text-white": true,
      }}
    >
      <div class="flex w-full flex-col items-center">
        <div class="sticky top-0 flex w-full flex-col items-center bg-white dark:bg-zinc-900">
          <div class="mt-2 flex w-80 sm:w-[32rem]">
            <button
              class="basis-1/3 text-left"
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
            <div class="flex basis-1/3 flex-col items-center text-sm">
              <a
                class="text-sky-500"
                href="https://bsky.app/profile/psky.social"
              >
                @psky.social
              </a>
            </div>
            <Show when={isLoggedIn()}>
              <div class="flex basis-1/3 flex-col text-right text-sm">
                <a href="" class="text-red-500" onclick={() => logout()}>
                  Logout
                </a>
              </div>
            </Show>
          </div>
          <Login />
        </div>
        <div class="w-80 sm:w-[32rem]">
          <PostFeed setUnreadCount={setUnreadCount} unreadCount={unreadCount} />
        </div>
        <Show when={isLoggedIn()}>
          <PostComposer setUnreadCount={setUnreadCount} />
        </Show>
      </div>
    </div>
  );
};

export default App;
