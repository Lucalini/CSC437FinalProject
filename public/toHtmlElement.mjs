/**
 * Convert an HTML string into a single HTMLElement.
 *
 * Usage:
 *   import { toHtmlElement } from "./toHtmlElement.mjs";
 *   const el = toHtmlElement(`<div class="box"><p>Hello</p></div>`);
 *
 * Notes:
 * - The string must have exactly ONE top-level element.
 * - Script tags inside the HTML string will not execute (as expected).
 */
export function toHtmlElement(htmlString) {
  if (typeof htmlString !== "string") {
    throw new TypeError("toHtmlElement(htmlString) expects a string");
  }

  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();

  const nodes = template.content.childNodes;
  const elementNodes = Array.from(nodes).filter((n) => n.nodeType === Node.ELEMENT_NODE);

  if (elementNodes.length !== 1) {
    throw new Error(
      `toHtmlElement(htmlString) expects exactly 1 root element, got ${elementNodes.length}.`
    );
  }

  return elementNodes[0];
}

