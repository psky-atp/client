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
          "mr-2 select-none w-14 text-right": true,
          "text-red-500": postInput().length > CHARLIMIT,
        }}
      >
        {postInput().length}/{CHARLIMIT}
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
          class="mr-2 w-52 border border-black px-2 py-1 dark:border-white dark:bg-neutral-700 sm:w-64"
          onInput={(e) => setPostInput(e.currentTarget.value)}
          onPaste={(e) => {
            if (graphemeLen(e.clipboardData?.getData("text") ?? "") > CHARLIMIT)
              e.preventDefault();
          }}
          onBeforeInput={(e) => {
            if (e.data && graphemeLen(postInput()) >= CHARLIMIT)
              e.preventDefault();
          }}
        />
        <button
          onclick={() => {
            if (!postInput().length || graphemeLen(postInput()) > CHARLIMIT)
              return;
            sendPost(postInput());
            setPostInput("");
          }}
          class="bg-stone-600 px-1 py-1 text-sm font-bold text-white hover:bg-stone-700"
        >
          pico
        </button>
      </form>
    </div>
  );
};

export default PostComposer;
