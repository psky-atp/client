async function* chrono(
  msDuration: number,
  msInterval: number,
): AsyncGenerator<number, number, unknown> {
  const start = Date.now();
  const getDiff = () => Date.now() - start;

  while (getDiff() < msDuration) {
    yield new Promise<number>((resolve) => {
      setTimeout(() => resolve(getDiff()), msInterval);
    });
  }

  return getDiff();
}

async function tryFor<T>(
  msDuration: number,
  msInterval: number,
  intervalCallback: (timeLeft: number) => void,
  tryBlock: () => Promise<T>,
) {
  let finished = false;

  const countdown = async () => {
    intervalCallback(msDuration);
    for await (const diff of chrono(msDuration, msInterval)) {
      if (finished) return;
      intervalCallback(msDuration - diff);
    }
    throw new Error("Timed out.");
  };

  return await Promise.race([tryBlock(), countdown()]).then(
    () => (finished = true),
  );
}

export { chrono, tryFor };
