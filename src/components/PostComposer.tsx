import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { getSessionDid, loginState } from "./Login.jsx";
import { feed, posts } from "./PostFeed.jsx";
import { CHARLIMIT } from "../utils/constants.js";
import { graphemeLen, isTouchDevice } from "../utils/lib.js";
import { RichText as RichTextAPI } from "../utils/rich-text/lib.js";
import { SocialPskyFeedPost } from "@atcute/client/lexicons";
import * as TID from "@atcute/tid";
import { PostData, PostRecord } from "../utils/types.js";
import { unreadState } from "../App.jsx";
import createProp from "../utils/createProp.js";

const [sendButton, setSendButton] = createSignal<HTMLButtonElement>();
const [composerInput, setComposerInput] = createSignal<HTMLInputElement>();
export const composerInputValue = createProp("", function (text: string) {
  const sendPostButton = sendButton();
  if (!sendPostButton) {
    return this[0]();
  }

  if (graphemeLen(text) > CHARLIMIT) sendPostButton.disabled = true;
  else sendPostButton.disabled = false;

  return this[1](text);
});

let lastScrollTop: number | undefined = undefined;
export const editPico = createProp(undefined, function (record?: PostData) {
  if (record) {
    let input: HTMLInputElement | undefined = composerInput();
    composerInputValue.set(record.post);
    input?.focus();
    input?.setSelectionRange(0, record.post.length);
  } else if (this[0]()) {
    let scrollBox = feed()?.parentElement!;
    if (lastScrollTop && scrollBox) {
      scrollBox.scrollTop = lastScrollTop;
      lastScrollTop = undefined;
    }

    for (const elem of document.getElementsByClassName("editing")) {
      elem.classList.remove("editing");
    }

    composerInputValue.set("");
  }
  return this[1](record);
});

const PostComposer: Component = () => {
  const putPost = async (text: string, rkey?: string) => {
    let rt = new RichTextAPI({ text });
    await rt.detectFacets();
    await loginState
      .get()
      .rpc!.call("com.atproto.repo.putRecord", {
        data: {
          repo: getSessionDid(),
          collection: "social.psky.feed.post",
          rkey: rkey ?? TID.now(),
          record: {
            $type: "social.psky.feed.post",
            text: rt.text,
            facets: rt.facets,
          } as SocialPskyFeedPost.Record,
        },
      })
      .catch((err) => console.log(err));
    unreadState.set({ count: 0 });
  };

  const keyEvent = (event: KeyboardEvent) => {
    const input = composerInput();

    if (input && event.key == "Escape") {
      input.blur();
      editPico.set(undefined);
    }

    if (input && event.key === "ArrowUp" && !composerInputValue.get().length) {
      let allPosts = posts().sort(
        (a, b) => a[0]().indexedAt - b[0]().indexedAt,
      );
      let post: PostRecord | undefined = undefined;
      for (let i = allPosts.length - 1; i >= 0; i--) {
        let p = allPosts[i][0]();
        if (p.did === getSessionDid()) {
          post = p;
          break;
        }
      }

      /*
        If we don't do this, default text box behaviour will kick in and send the cursor to the beginning
        this would cancel out setting the cursor pos to the end of the message
      */
      event.preventDefault();
      if (post) {
        editPico.set(post);
        const postDiv = document.getElementById(`${post.did}_${post.rkey}`);
        if (postDiv) {
          lastScrollTop = feed()!.parentElement!.scrollTop;
          postDiv.scrollIntoView();
          postDiv.classList.add("editing");
        }
      }
    }
  };
  onMount(() => {
    composerInput()?.addEventListener("keydown", keyEvent);
  });
  onCleanup(() => {
    composerInput()?.removeEventListener("keydown", keyEvent);
  });

  return (
    <form
      id="postForm"
      class="flex w-full max-w-80 items-center gap-2 px-2 pb-6 pt-4 sm:max-w-[32rem]"
      onsubmit={(e) => {
        e.currentTarget.reset();
        e.preventDefault();
      }}
    >
      <div
        classList={{
          "text-sm select-none min-w-7 w-fit": true,
          "text-red-500": graphemeLen(composerInputValue.get()) > CHARLIMIT,
        }}
      >
        {CHARLIMIT - graphemeLen(composerInputValue.get())}
      </div>
      <input
        type="text"
        ref={setComposerInput}
        placeholder={!!editPico.get() ? "edit pico" : "pico pico"}
        value={composerInputValue.get() ?? ""}
        autocomplete="off"
        class="min-w-0 flex-1 border border-black px-2 py-1 dark:border-white dark:bg-neutral-700"
        onInput={(e) => composerInputValue.set(e.currentTarget.value)}
      />
      <button
        ref={setSendButton}
        classList={{
          "px-1 py-1 text-xs font-bold text-white": true,
          "bg-stone-600 hover:bg-stone-700":
            graphemeLen(composerInputValue.get()) <= CHARLIMIT,
          "bg-stone-200 dark:bg-stone-800 dark:text-gray-400":
            graphemeLen(composerInputValue.get()) > CHARLIMIT,
        }}
        onclick={(e) => {
          if (
            !composerInputValue.get().length ||
            graphemeLen(composerInputValue.get()) > CHARLIMIT
          ) {
            e.preventDefault();
            return;
          }

          let rkey = editPico.get()?.rkey;
          if (rkey) {
            putPost(composerInputValue.get(), rkey);
            editPico.set(undefined);
          } else {
            putPost(composerInputValue.get());
          }

          composerInputValue.set("");
        }}
      >
        {!!editPico.get() ? "edit" : "pico"}
      </button>
      <Show when={!!editPico.get()}>
        <button
          class="bg-stone-600 px-1 py-1 text-xs font-bold text-white hover:bg-stone-700"
          onclick={() => editPico.set(undefined)}
        >
          cancel
        </button>
      </Show>
    </form>
  );
};

export default PostComposer;
