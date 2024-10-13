/// HACK:
/// This function is used to convert a string CSS size to a number size in pixels
/// -prf (joking, Elaina <3)
function convertToPx(parent: HTMLElement, size: string) {
  const tempElement = document.createElement("div");
  // Set to absolute so it doesn't get affected by the layout
  tempElement.style.position = "absolute";
  tempElement.style.width = size;

  parent.appendChild(tempElement);
  const computedWidth = getComputedStyle(tempElement).width;
  parent.removeChild(tempElement);

  return parseFloat(computedWidth);
}

export default convertToPx;
