const isOverflowing = (element?: Element | null) => {
  return (
    element &&
    (element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight)
  );
};

export default isOverflowing;
