import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { VsGear } from "./SVGs.jsx";

interface Configs {
  lineSeparator?: boolean;
}
const [configs, setConfigs] = createSignal<Configs>(
  (() => {
    let stored = localStorage.configs;
    return !!stored ? JSON.parse(stored) : {};
  })() as Configs,
);
const updateConfigs = (newConfigs: Configs) => {
  newConfigs = { ...configs(), ...newConfigs };
  setConfigs(newConfigs);
  localStorage.configs = JSON.stringify(newConfigs);
  return newConfigs;
};

const Settings = () => {
  const [open, setOpen] = createSignal(false);

  let clickEvent = (event: MouseEvent) => {
    const modal = document.getElementById("settings_modal");
    if (modal && event.target == modal) setOpen(false);
  };
  let keyEvent = (event: KeyboardEvent) => {
    const modal = document.getElementById("settings_modal");
    if (modal && event.key == "Escape") setOpen(false);
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
          id="settings_modal"
          class="modal absolute left-0 top-0 z-[2] flex h-screen w-screen items-center justify-center bg-transparent"
        >
          <div class="modal-box m-4 max-w-lg overflow-y-auto overscroll-contain rounded-md border border-black bg-stone-800 p-4 dark:border-white dark:text-white">
            <h3 class="text-lg font-bold">Settings</h3>
            <div class="mt-2 inline-flex gap-2">
              <input
                type="checkbox"
                id="lineSeparator"
                checked={!!configs().lineSeparator}
                class="accent-stone-600"
                onChange={(e) => {
                  updateConfigs({ lineSeparator: e.currentTarget.checked });
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
export { configs };
