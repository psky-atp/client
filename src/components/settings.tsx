import { Show, createSignal, onCleanup, onMount } from "solid-js";
import createProp from "../utils/createProp.js";
import { VsGear } from "./svg.jsx";

interface Configs {
  lineSeparator?: boolean;
}
export const configs = createProp(
  (() => {
    const stored = localStorage.configs;
    return stored
      ? JSON.parse(stored)
      : {
          focusOnOpen: false,
        };
  })(),
  function (configs: Configs) {
    const updatedConfigs = { ...this[0](), ...configs };
    this[1](updatedConfigs);
    localStorage.configs = JSON.stringify(updatedConfigs);
    return updatedConfigs;
  },
);

const Settings = () => {
  const [modal, setModal] = createSignal<HTMLDialogElement>();
  const [open, setOpen] = createSignal(false);

  const clickEvent = (event: MouseEvent) => {
    if (modal() && event.target === modal()) setOpen(false);
  };
  const keyEvent = (event: KeyboardEvent) => {
    if (modal() && event.key === "Escape") setOpen(false);
  };

  onMount(() => {
    window.addEventListener("click", clickEvent);
    window.addEventListener("keydown", keyEvent);
  });
  onCleanup(() => {
    window.removeEventListener("click", clickEvent);
    window.removeEventListener("keydown", keyEvent);
  });

  return (
    <>
      <button type="button" class="btn" onClick={() => setOpen(true)}>
        <VsGear class="h-5 w-5" />
      </button>
      <Show when={open()}>
        <dialog
          ref={setModal}
          class="modal absolute left-0 top-0 z-[2] flex h-screen w-screen items-center justify-center bg-transparent"
        >
          <div class="modal-box m-4 max-w-lg overflow-y-auto overscroll-contain rounded-md border border-black bg-stone-200 p-4 dark:border-white dark:bg-stone-800 dark:text-white">
            <h3 class="text-lg font-bold">Settings</h3>
            <div class="mt-2 inline-flex gap-2">
              <input
                type="checkbox"
                id="lineSeparator"
                checked={!!configs.get().lineSeparator}
                class="accent-stone-600"
                onChange={(e) => {
                  configs.set({ lineSeparator: e.currentTarget.checked });
                }}
              />
              <label for="lineSeparator" class="text-sm">
                Add a line separator between messages
              </label>
            </div>
            <div class="inline-flex gap-2">
              <input
                type="checkbox"
                id="focusOnOpen"
                checked={!!configs.get().focusOnOpen}
                class="accent-stone-600"
                onChange={(e) => {
                  configs.set({ focusOnOpen: e.currentTarget.checked });
                }}
              />
              <label for="focusOnOpen" class="text-sm">
                Focus input when opening the app
              </label>
            </div>
          </div>
        </dialog>
      </Show>
    </>
  );
};

export default Settings;
