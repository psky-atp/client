import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { loginState } from "./Login.jsx";
import { CHARLIMIT } from "../utils/constants.js";
import { graphemeLen, isTouchDevice } from "../utils/lib.js";
import { RichText as RichTextAPI } from "../utils/rich-text/lib.js";
import { SocialPskyFeedPost } from "@atcute/client/lexicons";
import * as TID from "@atcute/tid";
import { PostData } from "../utils/types.js";
import { UnreadState } from "../App.jsx";

const [textInput, setTextInput] = createSignal<HTMLInputElement>();
const [sendButton, setSendButton] = createSignal<HTMLButtonElement>();

const [postInput, setPostInputInternal] = createSignal("");
const setPostInput = (text: string) => {
  const sendPostButton = sendButton();
  if (!sendPostButton) return;
  if (graphemeLen(text) > CHARLIMIT) sendPostButton.disabled = true;
  else sendPostButton.disabled = false;
  setPostInputInternal(text);
};
export { postInput, setPostInput };

const [editRecord, setEditRecord] = createSignal<PostData>();
export const editPico = (record?: PostData) => {
  if (record) {
    setPostInput(record.post);
    setEditRecord(record);
    textInput()?.focus();
  } else {
    if (editRecord()) {
      setPostInput("");
    }
    setEditRecord(record);
  }
};

const PostComposer: Component<{
  setUnreadState: (state: UnreadState) => void;
}> = ({ setUnreadState }) => {
  document.addEventListener("focus", () => {
    if (isTouchDevice) window.scroll(0, document.body.scrollHeight);
    textInput()?.scroll(0, document.body.scrollHeight);
  });

  const putPost = async (text: string, rkey?: string) => {
    let rt = new RichTextAPI({ text });
    await rt.detectFacets();
    await loginState()
      .rpc!.call("com.atproto.repo.putRecord", {
        data: {
          repo: loginState().session?.did ?? loginState().did!,
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
    setUnreadState({ count: 0 });
  };

  let keyEvent = (event: KeyboardEvent) => {
    const input = textInput();
    if (input && event.key == "Escape") {
      input.blur();
      editPico(undefined);
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
      class="sticky bottom-0 z-[2] flex w-screen max-w-80 items-center justify-center gap-2 bg-white px-2 pb-6 pt-4 sm:max-w-[32rem] dark:bg-zinc-900"
      onsubmit={(e) => {
        e.currentTarget.reset();
        e.preventDefault();
      }}
    >
      <div
        classList={{
          "text-sm select-none min-w-7 w-fit": true,
          "text-red-500": graphemeLen(postInput()) > CHARLIMIT,
        }}
      >
        {CHARLIMIT - graphemeLen(postInput())}
      </div>
      <input
        type="text"
        ref={setTextInput}
        placeholder={!!editRecord() ? "edit pico" : "pico pico"}
        value={postInput() ?? ""}
        autocomplete="off"
        class="min-w-0 flex-1 border border-black px-2 py-1 dark:border-white dark:bg-neutral-700"
        onInput={(e) => setPostInput(e.currentTarget.value)}
      />
      <button
        ref={setSendButton}
        classList={{
          "px-1 py-1 text-xs font-bold text-white": true,
          "bg-stone-600 hover:bg-stone-700":
            graphemeLen(postInput()) <= CHARLIMIT,
          "bg-stone-200 dark:bg-stone-800 dark:text-gray-400":
            graphemeLen(postInput()) > CHARLIMIT,
        }}
        onclick={(e) => {
          if (!postInput().length || graphemeLen(postInput()) > CHARLIMIT) {
            e.preventDefault();
            return;
          }

          let rkey = editRecord()?.rkey;
          if (rkey) {
            putPost(postInput(), rkey);
            editPico(undefined);
          } else {
            putPost(postInput());
            window.scroll(0, document.body.scrollHeight);
          }

          setPostInput("");
        }}
      >
        {!!editRecord() ? "edit" : "pico"}
      </button>
      <Show when={!!editRecord()}>
        <button
          class="bg-stone-600 px-1 py-1 text-xs font-bold text-white hover:bg-stone-700"
          onclick={() => editPico(undefined)}
        >
          cancel
        </button>
      </Show>
    </form>
  );
};

export default PostComposer;
