import { Component, createSignal, Setter } from "solid-js";
import { isLoggedIn, loginState } from "./Login.jsx";
import { SocialPskyFeedPost } from "@atcute/client/lexicons";
import * as TID from "@atcute/tid";
import { APP_NAME, CHARLIMIT, SERVER_URL } from "../utils/constants.js";
import detectFacets from "../utils/rich-text/lib.js";
import { graphemeLen } from "../utils/lib.js";

export const [postInput, setPostInput] = createSignal("");

const PostComposer: Component<{ setUnreadCount: Setter<number> }> = ({
  setUnreadCount,
}) => {
  const sendPost = async (text: string) => {
    let facets = await detectFacets(text);
    if (isLoggedIn()) {
      let currLoginState = loginState();
      await currLoginState
        .rpc!.call("com.atproto.repo.putRecord", {
          data: {
            repo: currLoginState.session!.did,
            collection: "social.psky.feed.post",
            rkey: TID.now(),
            record: {
              $type: "social.psky.feed.post",
              text,
              facets,
            } as SocialPskyFeedPost.Record,
          },
        })
        .catch((err) => console.log(err));
    } else {
      await fetch(`https://${SERVER_URL}/post`, {
        method: "POST",
        body: JSON.stringify({
          text: text,
          facets: facets,
        }),
        headers: { "Content-Type": "application/json" },
      });
    }
    setUnreadCount(0);
    document.title = APP_NAME;
  };

  return (
    <div class="mb-4 flex items-center justify-center">
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
          class="mr-2 w-56 border border-black px-2 py-1 sm:w-96 dark:border-white dark:bg-neutral-700"
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
            "bg-stone-300 dark:bg-stone-800 dark:text-gray-400":
              graphemeLen(postInput()) > CHARLIMIT,
          }}
          onclick={(e) => {
            if (!postInput().length || graphemeLen(postInput()) > CHARLIMIT) {
              e.preventDefault();
              return;
            }
            sendPost(postInput());
            setPostInput("");
          }}
          class="bg-stone-600 px-1 py-1 text-xs font-bold text-white hover:bg-stone-700"
        >
          pico
        </button>
      </form>
    </div>
  );
};

export default PostComposer;
