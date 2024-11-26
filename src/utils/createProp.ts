import { type Accessor, createSignal, type Signal } from "solid-js";

type Updatable<T> = T | ((prev: T) => T);
type Setter<T> = (updatable: Updatable<T>) => T;
interface Prop<T> {
  get: Accessor<T>;
  set: Setter<T>;
}
const createProp = <T>(
  initial: T | Signal<T>,
  setterOverrider?: (this: Signal<T>, value: T) => T,
  accessorOverrider?: (accessor: Accessor<T>) => Accessor<T>,
): Prop<T> => {
  // Type guard to check if initial is Signal<T>
  function isSignal<T>(value: any): value is Signal<T> {
    return (
      Array.isArray(value) && value.length === 2 && typeof value[0] === "function" && typeof value[1] === "function"
    );
  }
  const signal = isSignal(initial) ? (initial as Signal<T>) : createSignal<T>(initial as T);

  let setter: Setter<T>;
  if (setterOverrider) {
    const overrider = setterOverrider.bind(signal);
    setter = (updatable: Updatable<T>) =>
      overrider(typeof updatable === "function" ? (updatable as Function)(signal[0]()) : updatable);
  } else setter = signal[1];

  return {
    get: accessorOverrider ? accessorOverrider(signal[0]) : signal[0],
    set: setter,
  };
};
export default createProp;
