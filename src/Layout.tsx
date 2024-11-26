import { type Component, Show } from "solid-js";

import Header from "./components/header.jsx";
import Login, { isLoggedIn } from "./components/login.jsx";
import PostComposer from "./components/post-composer.jsx";
import PostFeed from "./components/post-feed.jsx";

export interface UnreadState {
  count: number;
  ignoreOnce?: boolean;
}

const Layout: Component = () => {
  return (
    <div
      classList={{
        "flex flex-col items-center w-dvh h-dvh dark:text-white bg-white dark:bg-zinc-900": true,
        "pb-4": isLoggedIn() ? false : true,
      }}
    >
      <div class="flex w-full flex-col items-center bg-white dark:bg-zinc-900">
        <Header />
        <Login />
      </div>
      <div class="flex min-h-0 flex-1 justify-center overflow-auto px-5">
        <PostFeed />
      </div>
      <Show when={isLoggedIn()}>
        <div class="flex w-full justify-center bg-white dark:bg-zinc-900">
          <PostComposer />
        </div>
      </Show>
    </div>
  );
};

export default Layout;
