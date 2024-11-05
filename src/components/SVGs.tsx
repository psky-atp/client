import { Component } from "solid-js";

const VsGear: Component<{ class?: string }> = (props) => {
  return (
    <div class={props.class}>
      <svg
        class="h-full w-full"
        fill="currentColor"
        stroke-width="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        style="overflow: visible; color: currentcolor; --darkreader-inline-fill: currentColor; --darkreader-inline-color: currentcolor;"
        height="1em"
        width="1em"
        data-darkreader-inline-fill=""
        data-darkreader-inline-color=""
      >
        <path d="M9.1 4.4 8.6 2H7.4l-.5 2.4-.7.3-2-1.3-.9.8 1.3 2-.2.7-2.4.5v1.2l2.4.5.3.8-1.3 2 .8.8 2-1.3.8.3.4 2.3h1.2l.5-2.4.8-.3 2 1.3.8-.8-1.3-2 .3-.8 2.3-.4V7.4l-2.4-.5-.3-.8 1.3-2-.8-.8-2 1.3-.7-.2zM9.4 1l.5 2.4L12 2.1l2 2-1.4 2.1 2.4.4v2.8l-2.4.5L14 12l-2 2-2.1-1.4-.5 2.4H6.6l-.5-2.4L4 13.9l-2-2 1.4-2.1L1 9.4V6.6l2.4-.5L2.1 4l2-2 2.1 1.4.4-2.4h2.8zm.6 7c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8 9c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"></path>
      </svg>
    </div>
  );
};

const FaSolidPencil: Component<{ class?: string }> = (props) => {
  return (
    <div class={`inline-flex items-center justify-center ${props.class}`}>
      <svg
        class="h-full w-full"
        fill="currentColor"
        stroke-width="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style="overflow: visible; color: currentcolor"
        height="1em"
        width="1em"
        data-darkreader-inline-fill=""
        data-darkreader-inline-color=""
      >
        <path d="m410.3 231 11.3-11.3-33.9-33.9-62.1-62.1-33.9-33.9-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2l199.2-199.2 22.6-22.7zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9l-78.2 23 23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7l-14.4 14.5-22.6 22.6-11.4 11.3 33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5l-39.3-39.4c-25-25-65.5-25-90.5 0zm-47.4 168-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
      </svg>
    </div>
  );
};

const FiTrash2: Component<{ class?: string }> = (props) => {
  return (
    <div class={`inline-flex items-center justify-center ${props.class}`}>
      <svg
        class="h-full w-full"
        fill="none"
        stroke-width="2"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        viewBox="0 0 24 24"
        style="overflow: visible; color: currentcolor; --darkreader-inline-stroke: currentColor; --darkreader-inline-color: currentcolor;"
        height="1em"
        width="1em"
        data-darkreader-inline-stroke=""
        data-darkreader-inline-color=""
      >
        <path d="M3 6 5 6 21 6"></path>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <path d="M10 11 10 17"></path>
        <path d="M14 11 14 17"></path>
      </svg>
    </div>
  );
};

const AiOutlineEllipsis: Component<{ class?: string }> = (props) => {
  return (
    <div
      class={`inline-flex h-fit w-fit items-center justify-center ${props.class ?? ""}`}
    >
      <svg
        class="my-[-3px] h-full w-full"
        fill="currentColor"
        stroke-width="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        style="overflow: visible; color: currentcolor"
        height="1em"
        width="1em"
        data-darkreader-inline-fill=""
        data-darkreader-inline-color=""
      >
        <path d="M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0zm160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"></path>
      </svg>
    </div>
  );
};

const IoWarningOutline: Component<{ class?: string }> = (props) => {
  return (
    <div class={`inline-flex items-center justify-center ${props.class}`}>
      <svg
        class="h-full w-full"
        fill="currentColor"
        stroke-width="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style="overflow: visible; color: currentcolor"
        height="1em"
        width="1em"
        data-darkreader-inline-fill=""
        data-darkreader-inline-color=""
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M85.57 446.25h340.86a32 32 0 0 0 28.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0 0 28.17 47.17Z"
          style="--darkreader-inline-stroke: currentColor;"
          data-darkreader-inline-stroke=""
        ></path>
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="m250.26 195.39 5.74 122 5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 5.95Z"
          style="--darkreader-inline-stroke: currentColor;"
          data-darkreader-inline-stroke=""
        ></path>
        <path d="M256 397.25a20 20 0 1 1 20-20 20 20 0 0 1-20 20Z"></path>
      </svg>
    </div>
  );
};

const AiOutlineFileText: Component<{ class?: string }> = (props) => {
  return (
    <div class={`inline-flex items-center justify-center ${props.class}`}>
      <svg
        class="h-full w-full"
        fill="currentColor"
        stroke-width="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        style="overflow: visible; color: currentcolor; --darkreader-inline-fill: currentColor; --darkreader-inline-color: currentcolor;"
        height="1em"
        width="1em"
        data-darkreader-inline-fill=""
        data-darkreader-inline-color=""
      >
        <path d="M854.6 288.6 639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z"></path>
      </svg>
    </div>
  );
};

const IoMailUnreadOutline: Component<{ class?: string }> = (props) => {
  return (
    <div class={`inline-flex items-center justify-center ${props.class}`}>
      <svg
        class="h-full w-full"
        fill="currentColor"
        stroke-width="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style="overflow: visible; color: currentcolor; --darkreader-inline-fill: currentColor; --darkreader-inline-color: currentcolor;"
        height="1em"
        width="1em"
        data-darkreader-inline-fill=""
        data-darkreader-inline-color=""
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M320 96H88a40 40 0 0 0-40 40v240a40 40 0 0 0 40 40h334.73a40 40 0 0 0 40-40V239"
          style="--darkreader-inline-stroke: currentColor;"
          data-darkreader-inline-stroke=""
        ></path>
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M112 160 256 272 343 206.33"
          style="--darkreader-inline-stroke: currentColor;"
          data-darkreader-inline-stroke=""
        ></path>
        <path d="M431.95 80.10000000000001A47.95 47.95 0 1 0 431.95 176 47.95 47.95 0 1 0 431.95 80.10000000000001z"></path>
        <path d="M432 192a63.95 63.95 0 1 1 63.95-63.95A64 64 0 0 1 432 192Zm0-95.9a32 32 0 1 0 31.95 32 32 32 0 0 0-31.95-32Z"></path>
      </svg>
    </div>
  );
};

const IconEmojiSmile: Component<{ class?: string }> = (props) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
      <path d="M4.285 9.567a.5.5 0 01.683.183A3.498 3.498 0 008 11.5a3.498 3.498 0 003.032-1.75.5.5 0 11.866.5A4.498 4.498 0 018 12.5a4.498 4.498 0 01-3.898-2.25.5.5 0 01.183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
    </svg>
  );
};

const TbMoonStar: Component<{ class?: string }> = (props) => {
  return (
    <div class={props.class}>
      <svg
        class="size-full"
        fill="none"
        stroke-width="2"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="overflow: visible; color: currentcolor;"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
        <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2"></path>
        <path d="M19 11h2m-1 -1v2"></path>
      </svg>
    </div>
  );
};

const TbSun: Component<{ class?: string }> = (props) => {
  return (
    <div class={props.class}>
      <svg
        class="size-full"
        fill="none"
        stroke-width="2"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="overflow: visible; color: currentcolor;"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
        <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
      </svg>
    </div>
  );
};

export {
  VsGear,
  FaSolidPencil,
  FiTrash2,
  AiOutlineEllipsis,
  IoWarningOutline,
  AiOutlineFileText,
  IoMailUnreadOutline,
  IconEmojiSmile,
  TbMoonStar,
  TbSun,
};
