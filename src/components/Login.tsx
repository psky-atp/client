import {
  BrowserOAuthClient,
  OAuthSession,
} from "@atproto/oauth-client-browser";
import { Component, createSignal, onMount, Show } from "solid-js";
import { resolveDid } from "../utils/api.js";
import { CredentialManager, XRPC } from "@atcute/client";
import { SocialPskyActorProfile } from "@atcute/client/lexicons";
import { PDS_URL } from "../utils/constants.js";

interface LoginState {
  session?: OAuthSession;
  handle?: string;
  manager?: CredentialManager;
  rpc?: XRPC;
}
const [loginState, setLoginState] = createSignal<LoginState>({});
const isLoggedIn = () => {
  const state = loginState();
  return ((state.session && state.session.sub) || state.manager) && state.rpc;
};

let manager: CredentialManager;
let client: BrowserOAuthClient;
export const logout = async () => {
  if (isLoggedIn()) await client.revoke(loginState().session!.sub);
};

const isLocal = () =>
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "0.0.0.0";
const Login: Component = () => {
  const [loginInput, setLoginInput] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [nickname, setNickname] = createSignal("");
  const [notice, setNotice] = createSignal("");

  onMount(async () => {
    setNotice("Loading...");
    client = await BrowserOAuthClient.load({
      clientId:
        isLocal() ?
          "http://localhost?redirect_uri=http%3A%2F%2F127.0.0.1%3A1313%2F&scope=atproto+transition%3Ageneric"
        : "https://psky.social/client-metadata.json",
      handleResolver: `https://${PDS_URL}`,
    });
    client.addEventListener("deleted", () => {
      setLoginState({});
    });

    const result = await client.init().catch(() => {});
    if (result) {
      const state = {
        session: result.session,
        handle: await resolveDid(result.session.did),
        rpc: new XRPC({
          handler: { handle: result.session.fetchHandler.bind(result.session) },
        }),
      };
      setLoginState(state);
    }
    setNotice("");
  });

  const login = async (handle: string) => {
    if (password().length) {
      manager = new CredentialManager({ service: "https://bsky.social" });
      setLoginState({
        manager: manager,
        rpc: new XRPC({ handler: manager }),
        handle: loginInput(),
      });
      await manager.login({ identifier: loginInput(), password: password() });
    } else {
      await loginState().manager?.login({
        identifier: loginInput(),
        password: password(),
      });
      setNotice("Redirecting...");
      try {
        await client.signIn(handle, {
          scope: "atproto transition:generic",
          signal: new AbortController().signal,
        });
      } catch (err) {
        setNotice("Error during OAuth redirection");
      }
    }
  };

  const updateNickname = async (nickname: string) => {
    await loginState()
      .rpc!.call("com.atproto.repo.putRecord", {
        data: {
          repo: loginState().session!.did,
          collection: "social.psky.actor.profile",
          rkey: "self",
          record: {
            $type: "social.psky.actor.profile",
            nickname: nickname,
          } as SocialPskyActorProfile.Record,
        },
      })
      .catch((err) => console.log(err));
    window.location.reload();
  };

  return (
    <div class="mb-3 flex flex-col items-center text-sm">
      <Show when={isLoggedIn() && loginState().handle}>
        <form
          class="mt-2 flex items-center"
          onsubmit={(e) => {
            e.currentTarget.reset();
            e.preventDefault();
          }}
        >
          <input
            type="text"
            id="nickname"
            placeholder="nickname"
            maxlength="32"
            class="mr-2 w-40 border border-black px-2 py-1 dark:border-white dark:bg-neutral-700"
            onInput={(e) => setNickname(e.currentTarget.value)}
          />
          <button
            onclick={() => updateNickname(nickname())}
            class="bg-stone-600 px-1 py-1 text-xs font-bold text-white hover:bg-stone-700"
          >
            update
          </button>
        </form>
      </Show>
      <Show when={!isLoggedIn() && !notice().includes("Loading")}>
        <form
          class="mt-3 flex flex-col items-center"
          onsubmit={(e) => e.preventDefault()}
        >
          <div>
            <label for="handle" class="ml-1 mr-2">
              Handle:
            </label>
            <input
              type="text"
              id="handle"
              placeholder="user.bsky.social"
              class="mr-2 w-44 border border-black px-2 py-1 dark:border-white dark:bg-neutral-700"
              onInput={(e) => setLoginInput(e.currentTarget.value)}
            />
          </div>
          <div class="mt-2">
            <label for="password" class="ml-1 mr-2">
              App Password:
            </label>
            <input
              type="text"
              id="password"
              placeholder="leave empty for oauth"
              class="mr-2 w-44 border border-black px-2 py-1 dark:border-white dark:bg-neutral-700"
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          <div class="mt-2">
            <button
              onclick={() => login(loginInput())}
              class="bg-stone-600 px-1 py-1 text-sm font-bold text-white hover:bg-stone-700"
            >
              Login
            </button>
          </div>
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
