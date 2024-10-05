import {
  BrowserOAuthClient,
  OAuthSession,
} from "@atproto/oauth-client-browser";
import { Component, createSignal, onMount, Show } from "solid-js";
import resolveDid from "../utils/api.js";
import { XRPC } from "@atcute/client";

interface LoginState {
  session?: OAuthSession;
  rpc?: XRPC;
}
const [loginState, setLoginState] = createSignal<LoginState>({});
const isLoggedIn = () => {
  const state = loginState();
  return state.session && state.session.sub && state.rpc;
};
const isLocal = () =>
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "0.0.0.0";
const Login: Component = () => {
  const [loginInput, setLoginInput] = createSignal("");
  const [handle, setHandle] = createSignal("");
  const [notice, setNotice] = createSignal("");
  let client: BrowserOAuthClient;

  onMount(async () => {
    setNotice("Loading...");
    client = await BrowserOAuthClient.load({
      clientId:
        isLocal() ?
          "http://localhost?redirect_uri=http%3A%2F%2F127.0.0.1%3A1313%2F&scope=atproto+transition%3Ageneric"
        : "https://psky.social/client-metadata.json",
      handleResolver: "https://boletus.us-west.host.bsky.network",
    });
    client.addEventListener("deleted", () => {
      setLoginState({});
    });

    const result = await client.init().catch(() => {});
    if (result) {
      const state = {
        session: result.session,
        rpc: new XRPC({
          handler: { handle: result.session.fetchHandler.bind(result.session) },
        }),
      };
      setLoginState(state);
      setHandle(await resolveDid(state.session.did));
    }
    setNotice("");
  });

  const loginBsky = async (handle: string) => {
    setNotice("Redirecting...");
    try {
      await client.signIn(handle, {
        scope: "atproto transition:generic",
        signal: new AbortController().signal,
      });
    } catch (err) {
      setNotice("Error during OAuth redirection");
    }
  };

  const logoutBsky = async () => {
    if (isLoggedIn()) await client.revoke(loginState().session!.sub);
  };

  return (
    <div class="mb-4 flex flex-col items-center text-sm">
      <Show when={isLoggedIn() && handle()}>
        <div class="text-xs">
          Logged in as @{handle()} (
          <a href="" class="text-red-500" onclick={() => logoutBsky()}>
            Logout
          </a>
          )
        </div>
      </Show>
      <Show when={!isLoggedIn() && !notice().includes("Loading")}>
        <form class="flex items-center" onsubmit={(e) => e.preventDefault()}>
          <label for="handle" class="ml-1 mr-2">
            Handle:
          </label>
          <input
            type="text"
            id="handle"
            placeholder="user.bsky.social"
            class="mr-2 w-52 border border-black px-2 py-1 sm:w-64 dark:border-white dark:bg-neutral-700"
            onInput={(e) => setLoginInput(e.currentTarget.value)}
          />
          <button
            onclick={() => loginBsky(loginInput())}
            class="bg-stone-600 px-1 py-1 text-sm font-bold text-white hover:bg-stone-700"
          >
            Login
          </button>
        </form>
      </Show>
      <Show when={notice()}>
        <div class="mt-3 text-xs">{notice()}</div>
      </Show>
    </div>
  );
};

export default Login;
export { loginState, isLoggedIn };
