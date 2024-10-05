import { Component, createSignal, onMount, Setter } from "solid-js";
import { isLoggedIn, loginState } from "./Login.jsx";
import { SocialPskyFeedPost } from "@atcute/client/lexicons";
import * as TID from "@atcute/tid";
import { APP_NAME, CHARLIMIT, SERVER_URL } from "../utils/constants.js";

const PostComposer: Component<{ setUnreadCount: Setter<number> }> = ({
  setUnreadCount,
}) => {
  const [saveToggle, setSaveToggle] = createSignal(false);
  const [firstChar, setFirstChar] = createSignal("");
  let postInput = "";
  const segmenter = new Intl.Segmenter();

  onMount(() => {
    setSaveToggle(
      localStorage.getItem("saveFirstChar") === "true" ? true : false,
    );

    setFirstChar(localStorage.getItem("firstChar") ?? "");
    const textInputElem = document.getElementById(
      "textInput",
    ) as HTMLInputElement;
    if (saveToggle() && firstChar()) {
      textInputElem.setAttribute("value", firstChar());
      textInputElem.value = firstChar();
    }
  });

  const graphemeLen = (text: string): number => {
    let iterator = segmenter.segment(text)[Symbol.iterator]();
    let count = 0;

    while (!iterator.next().done) count++;

    return count;
  };

  const sendPost = async (post: string) => {
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
              text: post,
            } as SocialPskyFeedPost.Record,
          },
        })
        .catch((err) => console.log(err));
    } else {
      await fetch(`https://${SERVER_URL}/post`, {
        method: "POST",
        body: JSON.stringify({ post: post }),
        headers: { "Content-Type": "application/json" },
      });
    }
    setUnreadCount(0);
    document.title = APP_NAME;
  };

  return (
    <div class="mb-4 flex items-center justify-center">
      <input
        type="checkbox"
        id="saveChar"
        checked={saveToggle()}
        class="mr-2 accent-stone-600"
        onChange={(e) => {
          setSaveToggle(e.currentTarget.checked);
          localStorage.setItem(
            "saveFirstChar",
            saveToggle() ? "true" : "false",
          );
        }}
      />
      <label for="saveChar" class="w-10 text-xs">
        save char
      </label>
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
          placeholder="64 chars max"
          required
          autocomplete="off"
          class="mr-2 w-52 border border-black px-2 py-1 font-sans sm:w-64 dark:border-white dark:bg-neutral-700"
          onInput={(e) => (postInput = e.currentTarget.value)}
          onPaste={(e) => {
            if (
              graphemeLen(e.clipboardData?.getData("text") ?? "") >= CHARLIMIT
            )
              e.preventDefault();
          }}
          onBeforeInput={(e) => {
            if (e.data && graphemeLen(postInput) >= CHARLIMIT)
              e.preventDefault();
          }}
        />
        <button
          onclick={() => {
            if (!postInput.length) return;
            sendPost(postInput);
            if (saveToggle()) {
              setFirstChar([...segmenter.segment(postInput)][0].segment);
              const textInputElem = document.getElementById(
                "textInput",
              ) as HTMLInputElement;
              textInputElem.setAttribute("value", firstChar());
              textInputElem.value = firstChar();
              localStorage.setItem("firstChar", firstChar());
            }
            postInput = saveToggle() ? firstChar() : "";
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
