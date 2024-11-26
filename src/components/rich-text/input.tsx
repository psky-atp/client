import {
	type JSX,
	type Signal,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";

interface RichTextInputProps {
	ref?: Signal<HTMLDivElement | undefined>;
	valueRef?: Signal<string>;
	autocomplete?: "list" | "none" | "inline" | "both";
	class?: string;
	placeholder?: string;
	type?: string;
	maxLength?: number;
	onInput?: JSX.InputEventHandlerUnion<HTMLDivElement, InputEvent>;
}
const RichInput = (props: RichTextInputProps) => {
	const { ref, valueRef, autocomplete, class: htmlClass, placeholder } = props;
	const [self, setSelf] = ref ?? createSignal<HTMLDivElement>();
	const [value, setValue] = valueRef ?? createSignal<string>("");

	const keyEvent = (e: KeyboardEvent) => {
		if (e.key !== "Enter" || e.shiftKey) return;
		e.preventDefault();

		const form = self()?.closest("form");
		if (!form) return;

		const submitButton = form.querySelector(
			'button[type="submit"]',
		) as HTMLButtonElement | null;
		if (submitButton) submitButton.click();
	};
	onMount(() => self()?.addEventListener("keydown", keyEvent));
	onCleanup(() => self()?.removeEventListener("keydown", keyEvent));

	return (
		<div class={htmlClass}>
			<div class="relative h-full w-full">
				<div class="pointer-events-none absolute left-0 right-0 select-none truncate px-2 py-1 text-[#9ca3af]">
					{value() ? "" : placeholder}
				</div>
				<div class="min-w-0 flex-1">
					<div
						ref={setSelf}
						aria-autocomplete={autocomplete}
						aria-label={placeholder}
						aria-multiline="true"
						aria-placeholder={placeholder}
						contenteditable={true}
						spellcheck={true}
						tabindex="0"
						data-placeholder={placeholder}
						class="z-[-1] overflow-hidden whitespace-pre-wrap break-words px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 rounded"
						onInput={(e) => setValue(e.currentTarget.textContent ?? "")}
					/>
				</div>
			</div>
		</div>
	);
};

export default RichInput;
