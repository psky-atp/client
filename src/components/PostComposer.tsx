import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { getSessionDid, loginState } from "./Login.jsx";
import { feed, posts } from "./PostFeed.jsx";
import { CHARLIMIT } from "../utils/constants.js";
import { graphemeLen, isTouchDevice } from "../utils/lib.js";
import { RichText as RichTextAPI } from "../utils/rich-text/lib.js";
import { SocialPskyFeedPost } from "@atcute/client/lexicons";
import * as TID from "@atcute/tid";
import { Emoji, PostData, PostRecord } from "../utils/types.js";
import { theme, unreadState } from "../App.jsx";
import createProp from "../utils/createProp.js";
import { deletePico } from "../utils/api.js";
import RichInput from "./RichText/input.jsx";
import { IconEmojiSmile } from "./SVGs.jsx";
import { Picker } from "emoji-mart";

const [sendButton, setSendButton] = createSignal<HTMLButtonElement>();
const composerInputSignal = createSignal<HTMLDivElement>();
const [composerInput] = composerInputSignal;
const [showPicker, setShowPicker] = createSignal(false);

const composerValueSignal = createSignal<string>("");
const composerValue = createProp(composerValueSignal, function (text: string) {
  const sendPostButton = sendButton();
  if (sendPostButton) {
    if (graphemeLen(text) > CHARLIMIT) sendPostButton.disabled = true;
    else sendPostButton.disabled = false;
  }

  const input = composerInput();
  if (input) input.textContent = text;
  return this[1](text);
});

export { composerInput, composerValue };

let lastScrollTop: number | undefined = undefined;
export const editPico = createProp(undefined, function (record?: PostData) {
  if (record) {
    let input: HTMLDivElement | undefined = composerInput();
    composerValue.set(record.post);
    input?.focus();
    // input?.setSelectionRange(record.post.length, record.post.length);
  } else if (this[0]()) {
    let scrollBox = feed()?.parentElement!;
    if (lastScrollTop && scrollBox) {
      scrollBox.scrollTop = lastScrollTop;
      lastScrollTop = undefined;
    }

    for (const elem of document.getElementsByClassName("editing")) {
      elem.classList.remove("editing");
    }

    composerValue.set("");
  }
  return this[1](record);
});

const EmojiPicker: Component = () => {
  let pickerDiv: HTMLDivElement | undefined;
  let shiftHeld = false;

  const keyEvent = (e: KeyboardEvent) => (shiftHeld = e.shiftKey);
  const emojiEvent = (emoji: Emoji) => {
    composerValue.set(composerValue.get() + emoji.native);
    composerInput()?.focus();
    if (!shiftHeld) setShowPicker(false);
  };

  onMount(() => {
    const picker = new Picker({
      onEmojiSelect: emojiEvent,
      onClickOutside: () => setShowPicker(false),
      autoFocus: true,
      theme: theme.get() === "dark" ? "dark" : "light",
      data: async () => {
        return (await import("../assets/emoji-picker-data.json")).default;
      },
    });
    // NOTE: emoji-mart doesnt have proper typescript support
    // https://github.com/missive/emoji-mart/issues/576
    // ignore LSP type errors
    pickerDiv?.appendChild(picker);
    window.addEventListener("keyup", keyEvent, true);
    window.addEventListener("keydown", keyEvent, true);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", keyEvent, true);
    window.removeEventListener("keyup", keyEvent, true);
  });

  return <div class="absolute bottom-20" ref={pickerDiv}></div>;
};

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
      if (!!editPico.get()) editPico.set(undefined);
      else input.blur();
    }

    if (input && event.key === "ArrowUp" && !composerValue.get().length) {
      let allPosts = posts().toSorted(
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
          "text-red-500": graphemeLen(composerValue.get()) > CHARLIMIT,
        }}
      >
        {CHARLIMIT - graphemeLen(composerValue.get())}
      </div>
      <Show when={!isTouchDevice}>
        <button
          class="rounded p-1 hover:bg-neutral-300 hover:dark:bg-neutral-700"
          onclick={() => setShowPicker((v) => !v)}
        >
          <IconEmojiSmile></IconEmojiSmile>
        </button>
      </Show>
      <Show when={showPicker()}>
        <EmojiPicker></EmojiPicker>
      </Show>
      <RichInput
        type="text"
        ref={composerInputSignal}
        valueRef={composerValueSignal}
        placeholder={!!editPico.get() ? "edit pico" : "pico pico"}
        autocomplete="list"
        class="flex min-w-0 flex-1 border border-black dark:border-white dark:bg-neutral-700"
      />
      <button
        ref={setSendButton}
        type="submit"
        classList={{
          "px-1 py-1 text-xs font-bold text-white": true,
          "bg-stone-600 hover:bg-stone-700":
            graphemeLen(composerValue.get()) <= CHARLIMIT,
          "bg-stone-200 dark:bg-stone-800 dark:text-gray-400":
            graphemeLen(composerValue.get()) > CHARLIMIT,
        }}
        onclick={(e) => {
          let input = composerValue.get();
          let editRkey = editPico.get()?.rkey;
          if (!input && !!editRkey) {
            deletePico(editRkey);
            editPico.set(undefined);
            return;
          }

          if (!input.length || graphemeLen(input) > CHARLIMIT) {
            e.preventDefault();
            return;
          }

          if (editRkey) {
            putPost(input, editRkey);
            editPico.set(undefined);
          } else {
            putPost(input);
          }

          composerValue.set("");
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
