import { Show, type Component } from "solid-js";

import Login, { isLoggedIn } from "./components/Login.jsx";
import PostComposer from "./components/PostComposer/component.jsx";
import PostFeed from "./components/PostFeed.jsx";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar/component.jsx";

export interface UnreadState {
  count: number;
  ignoreOnce?: boolean;
}

const Layout: Component = () => {
  return (
    <Sidebar
      id="sidebar"
      barClass="flex h-full w-fit flex-col p-4 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
      barChildren={
        <>
          <h1 class="mx-auto text-xl font-bold uppercase tracking-widest">
            Picosky
          </h1>
          <div class="whitespace-nowrap text-xl font-medium">
            <ul>
              <li>Example</li>
            </ul>
          </div>
          <div class="mt-auto flex flex-col justify-center">
            <ul class="py-1.5 font-medium">
              <li>Example</li>
            </ul>
          </div>
        </>
      }
      class="flex h-full w-full flex-col items-center md:min-h-0"
    >
      <div class="flex w-full flex-col items-center bg-white dark:bg-zinc-900">
        <Header />
        <Login />
      </div>
      <div class="flex min-h-0 flex-1 justify-center overflow-auto px-5">
        <PostFeed />
      </div>
      <Show when={isLoggedIn()}>
        <div class="flex w-full max-w-80 justify-center bg-white sm:max-w-[32rem] dark:bg-zinc-900">
          <PostComposer />
        </div>
      </Show>
    </Sidebar>
  );
};

export default Layout;
