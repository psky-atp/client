import { Component, createSignal, onMount, Show } from "solid-js";
import { isLoggedIn, loginState } from "./Login.jsx";
import { registerCallback } from "../utils/socket.js";
import { ServerState } from "../utils/types.js";
import { theme } from "../App.jsx";
import Settings from "./Settings/component.jsx";
import { SidebarArrow } from "./SVGs.jsx";

const Header: Component = () => {
  const [sessionCount, setSessionCount] = createSignal(0);
  onMount(() => {
    registerCallback("serverState", (data: ServerState) =>
      setSessionCount(data.sessionCount),
    );
  });

  return (
    <div class="flex w-full">
      <div class="flex basis-1/3 items-center gap-2 text-sm">
        <label
          for="sidebar"
          tabIndex={0}
          class="sidebar-expand-btn btn btn-ghost btn-circle"
        >
          <SidebarArrow class="h-3.5" />
        </label>
        <Settings />
        <button
          class="text-left"
          onclick={() => theme.set(theme.get() === "light" ? "dark" : "light")}
        >
          {theme.get()}
        </button>
      </div>
      <div class="flex basis-1/3 flex-col text-center text-xs">
        <a class="text-sky-500" href="https://bsky.app/profile/psky.social">
          psky.social
        </a>
        <span>{sessionCount()} online</span>
      </div>
      <Show when={isLoggedIn()}>
        <div class="basis-1/3 text-right text-sm">
          <a href="" class="text-red-500" onclick={() => loginState.set({})}>
            Logout
          </a>
        </div>
      </Show>
    </div>
  );
};

export default Header;
