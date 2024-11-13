import { Component, createSignal, onMount, Show } from "solid-js";
import { resolveDid } from "../utils/api.js";
import { CredentialManager, XRPC } from "@atcute/client";
import { At, SocialPskyActorProfile } from "@atcute/client/lexicons";
import {
  configureOAuth,
  createAuthorizationUrl,
  finalizeAuthorization,
  getSession,
  OAuthUserAgent,
  resolveFromIdentity,
  type Session,
} from "@atcute/oauth-browser-client";
import createProp from "../utils/createProp.js";
import { tryFor } from "../utils/chrono.js";

configureOAuth({
  metadata: {
    client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URL,
  },
});

const stateIsLoggedIn = (state: LoginState) =>
  ((state.session && state.session.sub) || state.manager) && state.rpc;
interface LoginState {
  pendingInit?: boolean;
  session?: OAuthUserAgent;
  handle?: string;
  did?: string;
  manager?: CredentialManager;
  rpc?: XRPC;
}
export const loginState = createProp<LoginState>(
  { pendingInit: true },
  function (newState: LoginState) {
    const curr = this[0]();

    // If is logged in through OAuth
    if (
      !Object.keys(newState).length &&
      stateIsLoggedIn(curr) &&
      curr.session
    ) {
      curr.session.signOut();
    }

    this[1](newState);
    return newState;
  },
);

export const isLoggedIn = () => stateIsLoggedIn(loginState.get());
export const getSessionDid = () =>
  loginState.get().session?.sub ?? loginState.get().did!;

const Login: Component = () => {
  const [loginInput, setLoginInput] = createSignal("");
  const [nickname, setNickname] = createSignal("");
  const [notice, setNotice] = createSignal("");

  onMount(() =>
    tryFor(
      15000, // Try for 15 seconds
      1000, // Update UI every second
      (timeLeft) =>
        setNotice(`Loading... (max. ${Math.ceil(timeLeft / 1000)}s)`),
      async () => {
        const init = async (): Promise<Session | undefined> => {
          const params = new URLSearchParams(location.hash.slice(1));

          if (
            params.has("state") &&
            (params.has("code") || params.has("error"))
          ) {
            history.replaceState(null, "", location.pathname + location.search);

            const session = await finalizeAuthorization(params);
            const did = session.info.sub;

            localStorage.setItem("lastSignedIn", did);
            return session;
          } else {
            const lastSignedIn = localStorage.getItem("lastSignedIn");

            if (lastSignedIn) {
              try {
                const session = await getSession(lastSignedIn as At.DID);
                return session;
              } catch (err) {
                localStorage.removeItem("lastSignedIn");
                throw err;
              }
            }
          }
        };

        const session = await init().catch(() => {});
        if (session) {
          const agent = new OAuthUserAgent(session);
          loginState.set({
            session: new OAuthUserAgent(session),
            handle: await resolveDid(session.info.sub),
            rpc: new XRPC({ handler: agent }),
          });
        } else {
          loginState.set({});
        }
        setNotice("");
      },
    ).catch((e) => {
      console.log(e);
      loginState.set({});
      setNotice("Failed to initialize.");
    }),
  );

  const login = async (handle: string) => {
    try {
      setNotice(`Resolving your identity...`);
      const resolved = await resolveFromIdentity(handle);

      setNotice(`Contacting your data server...`);
      const authUrl = await createAuthorizationUrl({
        scope: import.meta.env.VITE_OAUTH_SCOPE,
        ...resolved,
      });

      setNotice(`Redirecting...`);
      await new Promise((resolve) => setTimeout(resolve, 250));

      location.assign(authUrl);
    } catch (err) {
      setNotice("Error during OAuth login");
    }
  };

  const updateNickname = async (nickname: string) => {
    await loginState
      .get()
      .rpc!.call("com.atproto.repo.putRecord", {
        data: {
          repo: getSessionDid(),
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
          class="mt-3 flex items-center"
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
          <div>
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
