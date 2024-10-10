import { createSignal, onMount, Show, type Component } from "solid-js";

import { APP_NAME } from "./utils/constants.js";
import Login, { isLoggedIn, logout } from "./components/Login.jsx";
import PostComposer from "./components/PostComposer.jsx";
import PostFeed from "./components/PostFeed.jsx";
import Settings from "./components/Settings.jsx";

export interface UnreadState {
  count: number;
  ignoreOnce?: boolean;
}

const App: Component = () => {
  const [theme, setTheme] = createSignal("");
  const [unreadState, setUnreadStateInternal] = createSignal<UnreadState>({
    count: 0,
  });
  const setUnreadState = (state: UnreadState) => {
    document.title = state.count ? `(${state.count}) ${APP_NAME}` : APP_NAME;
    setUnreadStateInternal(state);
  };

  const resetUnreadOnBlur = () => {
    const state = unreadState();
    if (state.ignoreOnce) {
      setUnreadState({ ...state, ignoreOnce: false });
      return;
    }

    setUnreadState({ count: 0 });
  };

  onMount(() => {
    if (localStorage.theme !== undefined) setTheme(localStorage.theme);
    else setTheme("light");
    window.addEventListener("blur", resetUnreadOnBlur);
  });

  return (
    <div
      classList={{
        "pb-4": isLoggedIn() ? false : true,
        "flex flex-col items-center dark:text-white": true,
      }}
    >
      <div class="flex w-full flex-col items-center">
        <div class="sticky top-0 z-[2] flex w-full flex-col items-center bg-white dark:bg-zinc-900">
          <div class="mt-2 flex w-80 sm:w-[32rem]">
            <div class="flex basis-1/3 items-center gap-2 text-sm">
              <Settings />
              <button
                class="text-left"
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
          <PostFeed setUnreadState={setUnreadState} unreadState={unreadState} />
        </div>
        <Show when={isLoggedIn()}>
          <PostComposer setUnreadState={setUnreadState} />
        </Show>
      </div>
    </div>
  );
};

export default App;
