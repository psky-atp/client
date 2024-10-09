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

export { VsGear, FaSolidPencil, FiTrash2, AiOutlineEllipsis, IoWarningOutline };