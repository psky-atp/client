import { createSignal, onMount, type Component } from "solid-js";
import { APP_NAME } from "./utils/constants.js";
import createProp from "./utils/createProp.js";
import Layout from "./Layout.jsx";

export const [theme, setTheme] = createSignal(
  (
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches)
  ) ?
    "dark"
  : "light",
);

type UnreadState = {
  count: number;
  ignoreOnce?: boolean;
};
export const unreadState = createProp(
  { count: 0 },
  function (newState: UnreadState) {
    document.title =
      newState.count ? `(${newState.count}) ${APP_NAME}` : APP_NAME;
    this[1](newState);
    return newState;
  },
);

export const App: Component = () => {
  const resetUnreadOnBlur = () => {
    const state = unreadState.get();
    if (state.ignoreOnce) {
      unreadState.set({ ...state, ignoreOnce: false });
      return;
    }

    unreadState.set({ count: 0 });
  };

  onMount(() => window.addEventListener("blur", resetUnreadOnBlur));

  return <Layout />;
};

export default App;
