import {
  BrowserOAuthClient,
  OAuthSession,
} from "@atproto/oauth-client-browser";
import { Component, createSignal, onMount, Show } from "solid-js";
import { resolveDid, resolveHandle } from "../utils/api.js";
import { CredentialManager, XRPC } from "@atcute/client";
import { SocialPskyActorProfile } from "@atcute/client/lexicons";
import { PDS_URL } from "../utils/constants.js";
import createProp from "../utils/createProp.js";

const stateIsLoggedIn = (state: LoginState) =>
  ((state.session && state.session.sub) || state.manager) && state.rpc;
interface LoginState {
  session?: OAuthSession;
  handle?: string;
  did?: string;
  manager?: CredentialManager;
  rpc?: XRPC;
}
export const loginState = createProp<LoginState>(
  {},
  function (newState: LoginState) {
    const curr = this[0]();

    // If is logged in through OAuth
    if (
      !Object.keys(newState).length &&
      stateIsLoggedIn(curr) &&
      curr.session
    ) {
      client.revoke(curr.session.sub);
    }

    this[1](newState);
    return newState;
  },
);

export const isLoggedIn = () => stateIsLoggedIn(loginState.get());

let manager: CredentialManager;
let client: BrowserOAuthClient;
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
      loginState.set({});
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
      loginState.set(state);
    }
    setNotice("");
  });

  const fetchService = async (handle: string) => {
    const did = await resolveHandle(handle);
    if (!did) return;

    const res = await fetch(
      did.startsWith("did:web") ?
        "https://" + did.split(":")[2] + "/.well-known/did.json"
      : "https://plc.directory/" + did,
    );

    return res.json().then((doc) => {
      for (const service of doc.service) {
        if (service.id.includes("#atproto_pds")) {
          return service.serviceEndpoint;
        }
      }
    });
  };

  const login = async (handle: string) => {
    if (password().length) {
      const service = await fetchService(handle);
      manager = new CredentialManager({ service: service });
      loginState.set({
        manager: manager,
        rpc: new XRPC({ handler: manager }),
        handle: loginInput(),
        did: await resolveHandle(loginInput()),
      });
      await manager.login({ identifier: loginInput(), password: password() });
    } else {
      await loginState.get().manager?.login({
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
    await loginState
      .get()
      .rpc!.call("com.atproto.repo.putRecord", {
        data: {
          repo: loginState.get().session!.did,
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
      <Show when={isLoggedIn() && loginState.get().handle}>
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
