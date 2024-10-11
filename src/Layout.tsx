import { Show, type Component } from "solid-js";

import Login, { isLoggedIn } from "./components/Login.jsx";
import PostComposer from "./components/PostComposer.jsx";
import PostFeed from "./components/PostFeed.jsx";
import Header from "./components/Header.jsx";

export interface UnreadState {
  count: number;
  ignoreOnce?: boolean;
}

const Layout: Component = () => {
  return (
    <div
      classList={{
        "flex flex-col items-center w-screen h-screen dark:text-white bg-white dark:bg-zinc-900":
          true,
        "pb-4": isLoggedIn() ? false : true,
      }}
    >
      <div class="flex w-full flex-col items-center bg-white dark:bg-zinc-900">
        <Header />
        <Login />
      </div>
      <div class="hide-scroll flex min-h-0 flex-1 justify-center overflow-auto px-2">
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
