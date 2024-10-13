import "./styles.css";

import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { VsGear } from "../SVGs.js";
import createProp from "../../utils/createProp.js";

interface Configs {
  lineSeparator?: boolean;
}
export const configs = createProp(
  (() => {
    let stored = localStorage.configs;
    return !!stored ? JSON.parse(stored) : {};
  })(),
  function (newConfigs: Configs) {
    newConfigs = { ...this[0](), ...newConfigs };
    this[1](newConfigs);
    localStorage.configs = JSON.stringify(newConfigs);
    return newConfigs;
  },
);

const Settings = () => {
  const [modal, setModal] = createSignal<HTMLDialogElement>();
  const [open, setOpen] = createSignal(false);

  let clickEvent = (event: MouseEvent) => {
    if (modal() && event.target == modal()) setOpen(false);
  };
  let keyEvent = (event: KeyboardEvent) => {
    if (modal() && event.key == "Escape") setOpen(false);
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
      <button class="btn" onClick={() => setOpen(true)}>
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
          </div>
        </dialog>
      </Show>
    </>
  );
};

export default Settings;
