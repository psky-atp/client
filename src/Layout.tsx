import { createSignal, onMount, Show, type Component } from "solid-js";

import Login, { isLoggedIn, loginState } from "./components/Login.jsx";
import PostComposer from "./components/PostComposer.jsx";
import PostFeed from "./components/PostFeed.jsx";
import Settings from "./components/Settings.jsx";
import { socket, theme } from "./App.jsx";

export interface UnreadState {
  count: number;
  ignoreOnce?: boolean;
}

const Layout: Component = () => {
  const [sessionCount, setSessionCount] = createSignal(0);
  onMount(() => {
    socket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      if (data.$type === "serverState") setSessionCount(data.sessionCount);
    });
  });

  return (
    <div
      classList={{
        "pb-4": isLoggedIn() ? false : true,
        "flex flex-col items-center dark:text-white h-screen dark:bg-zinc-900":
          true,
      }}
    >
      <div class="flex w-full flex-col items-center">
        <div class="sticky top-0 z-[2] flex w-full flex-col items-center bg-white dark:bg-zinc-900">
          <div class="mt-2 flex w-80 sm:w-[32rem]">
            <div class="flex basis-1/3 items-center gap-2 text-sm">
              <Settings />
              <button
                class="text-left"
                onclick={() =>
                  theme.set(theme.get() === "light" ? "dark" : "light")
                }
              >
                {theme.get()}
              </button>
            </div>
            <div class="flex basis-1/3 flex-col text-center text-xs">
              <a
                class="text-sky-500"
                href="https://bsky.app/profile/psky.social"
              >
                psky.social
              </a>
              <span>{sessionCount()} online</span>
            </div>
            <Show when={isLoggedIn()}>
              <div class="basis-1/3 text-right text-sm">
                <a
                  href=""
                  class="text-red-500"
                  onclick={() => loginState.set({})}
                >
                  Logout
                </a>
              </div>
            </Show>
          </div>
          <Login />
        </div>
        <div class="w-80 sm:w-[32rem]">
          <PostFeed />
        </div>
        <Show when={isLoggedIn()}>
          <PostComposer />
        </Show>
      </div>
    </div>
  );
};

export default Layout;
