import { Component, createSignal, Setter } from "solid-js";
import { loginState } from "./Login.jsx";
import { APP_NAME, CHARLIMIT } from "../utils/constants.js";
import { graphemeLen, isTouchDevice } from "../utils/lib.js";
import { RichText as RichTextAPI } from "../utils/rich-text/lib.js";
import { SocialPskyFeedPost } from "@atcute/client/lexicons";
import * as TID from "@atcute/tid";

export const [postInput, setPostInput] = createSignal("");

const PostComposer: Component<{ setUnreadCount: Setter<number> }> = ({
  setUnreadCount,
}) => {
  document.addEventListener("focus", () => {
    if (isTouchDevice) window.scroll(0, document.body.scrollHeight);
    document.getElementById("textInput")?.scroll(0, document.body.scrollHeight);
  });

  const sendPost = async (text: string) => {
    let rt = new RichTextAPI({ text });
    await rt.detectFacets();
    await loginState()
      .rpc!.call("com.atproto.repo.putRecord", {
        data: {
          repo: loginState().session!.did,
          collection: "social.psky.feed.post",
          rkey: TID.now(),
          record: {
            $type: "social.psky.feed.post",
            text: rt.text,
            facets: rt.facets,
          } as SocialPskyFeedPost.Record,
        },
      })
      .catch((err) => console.log(err));
    setUnreadCount(0);
    document.title = APP_NAME;
  };

  return (
    <div class="sticky bottom-0 flex w-full flex-col items-center bg-white pb-6 pt-4 dark:bg-zinc-900">
      <div class="flex w-80 items-center sm:w-[32rem]">
        <div
          classList={{
            "mr-2 text-sm select-none text-right w-10": true,
            "text-red-500": graphemeLen(postInput()) > CHARLIMIT,
          }}
        >
          {graphemeLen(postInput())}/{CHARLIMIT}
        </div>
        <form
          id="postForm"
          onsubmit={(e) => {
            e.currentTarget.reset();
            e.preventDefault();
          }}
        >
          <input
            type="text"
            id="textInput"
            placeholder="pico pico"
            required
            autocomplete="off"
            class="mr-2 w-56 border border-black px-2 py-1 dark:border-white dark:bg-neutral-700 sm:w-96"
            onInput={(e) => {
              const sendPostButton = document.getElementById(
                "sendButton",
              ) as HTMLButtonElement;
              if (graphemeLen(e.currentTarget.value) > CHARLIMIT)
                sendPostButton.disabled = true;
              else sendPostButton.disabled = false;
              setPostInput(e.currentTarget.value);
            }}
          />
          <button
            id="sendButton"
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
              sendPost(postInput());
              window.scroll(0, document.body.scrollHeight);
              setPostInput("");
            }}
          >
            pico
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostComposer;
