import { onMount, type Component } from "solid-js";
import { APP_NAME, SERVER_URL } from "./utils/constants.js";
import createProp from "./utils/createProp.js";
import Layout from "./Layout.jsx";
import { WebSocket } from "partysocket";

type Theme = "light" | "dark";
export const theme = createProp<Theme>(
  localStorage?.theme || "light",
  function (newState: Theme) {
    if (newState === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.theme = newState;
    this[1](newState);
    return newState;
  },
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

export const socket = new WebSocket(`wss://${SERVER_URL}/subscribe`);

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
