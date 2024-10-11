import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { loginState } from "./Login.jsx";
import { CHARLIMIT } from "../utils/constants.js";
import { graphemeLen, isTouchDevice } from "../utils/lib.js";
import { RichText as RichTextAPI } from "../utils/rich-text/lib.js";
import { SocialPskyFeedPost } from "@atcute/client/lexicons";
import * as TID from "@atcute/tid";
import { PostData } from "../utils/types.js";
import { unreadState } from "../App.jsx";
import createProp from "../utils/createProp.js";

const [textInput, setTextInput] = createSignal<HTMLInputElement>();
const [sendButton, setSendButton] = createSignal<HTMLButtonElement>();

export const postInput = createProp("", function (text: string) {
  const sendPostButton = sendButton();
  if (!sendPostButton) {
    return this[0]();
  }

  if (graphemeLen(text) > CHARLIMIT) sendPostButton.disabled = true;
  else sendPostButton.disabled = false;

  return this[1](text);
});

export const editPico = createProp(undefined, function (record?: PostData) {
  if (record) {
    postInput.set(record.post);
    this[1](record);
    textInput()?.focus();
  } else {
    if (this[0]()) {
      postInput.set("");
    }
    this[1](record);
  }
  return record;
});

const PostComposer: Component = () => {
  document.addEventListener("focus", () => {
    if (isTouchDevice) window.scroll(0, document.body.scrollHeight);
    textInput()?.scroll(0, document.body.scrollHeight);
  });

  const putPost = async (text: string, rkey?: string) => {
    let rt = new RichTextAPI({ text });
    await rt.detectFacets();
    await loginState
      .get()
      .rpc!.call("com.atproto.repo.putRecord", {
        data: {
          repo: loginState.get().session?.did ?? loginState.get().did!,
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
    const input = textInput();
    if (input && event.key == "Escape") {
      input.blur();
      editPico.set(undefined);
    }
  };
  onMount(() => {
    window.addEventListener("keydown", keyEvent);
  });
  onCleanup(() => {
    window.removeEventListener("keydown", keyEvent);
  });

  return (
    <form
      id="postForm"
      class="flex w-screen max-w-80 items-center gap-2 px-2 pb-6 pt-4 sm:max-w-[32rem]"
      onsubmit={(e) => {
        e.currentTarget.reset();
        e.preventDefault();
      }}
    >
      <div
        classList={{
          "text-sm select-none min-w-7 w-fit": true,
          "text-red-500": graphemeLen(postInput.get()) > CHARLIMIT,
        }}
      >
        {CHARLIMIT - graphemeLen(postInput.get())}
      </div>
      <input
        type="text"
        ref={setTextInput}
        placeholder={!!editPico.get() ? "edit pico" : "pico pico"}
        value={postInput.get() ?? ""}
        autocomplete="off"
        class="min-w-0 flex-1 border border-black px-2 py-1 dark:border-white dark:bg-neutral-700"
        onInput={(e) => postInput.set(e.currentTarget.value)}
      />
      <button
        ref={setSendButton}
        classList={{
          "px-1 py-1 text-xs font-bold text-white": true,
          "bg-stone-600 hover:bg-stone-700":
            graphemeLen(postInput.get()) <= CHARLIMIT,
          "bg-stone-200 dark:bg-stone-800 dark:text-gray-400":
            graphemeLen(postInput.get()) > CHARLIMIT,
        }}
        onclick={(e) => {
          if (
            !postInput.get().length ||
            graphemeLen(postInput.get()) > CHARLIMIT
          ) {
            e.preventDefault();
            return;
          }

          let rkey = editPico.get()?.rkey;
          if (rkey) {
            putPost(postInput.get(), rkey);
            editPico.set(undefined);
          } else {
            putPost(postInput.get());
            window.scroll(0, document.body.scrollHeight);
          }

          postInput.set("");
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
