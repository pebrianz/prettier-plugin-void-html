import { expect, it, describe } from "vitest";
import prettier from "prettier";

/**
 * The list of all void elements can be found here:
 * https://developer.mozilla.org/en-US/docs/Glossary/Void_element
 *
 * Additionally, Prettier has some opaque logic to determine whether they will force a trailing line
 * break after printing each of these elements. The `hasTrailingNewline` values here were determined
 * experimentally.
 */
const voidElements = [
  { el: "area", hasTrailingNewline: false },
  { el: "base", hasTrailingNewline: false },
  { el: "br", hasTrailingNewline: false },
  { el: "col", hasTrailingNewline: true },
  { el: "embed", hasTrailingNewline: false },
  { el: "hr", hasTrailingNewline: true },
  { el: "img", hasTrailingNewline: false },
  { el: "input", hasTrailingNewline: false },
  { el: "link", hasTrailingNewline: false },
  { el: "meta", hasTrailingNewline: false },
  { el: "param", hasTrailingNewline: true },
  { el: "source", hasTrailingNewline: true },
  { el: "track", hasTrailingNewline: true },
  { el: "wbr", hasTrailingNewline: false },
];

async function format(code: string) {
  return prettier.format(code, {
    parser: "html",
    plugins: ["./dist/index.js"],
  });
}

describe("Prettier", async () => {
  it("should preserve void syntax on all void elements", async () => {
    const results = await Promise.all(
      voidElements.map(({ el }) => format(`<${el}>`)),
    );
    results.forEach((formatted, i) => {
      expect(formatted).toBe(`<${voidElements[i].el}>\n`);
    });
  });

  it("should preserve void syntax on all void elements with following text", async () => {
    const results = await Promise.all(
      voidElements.map(({ el }) => format(`<${el}>text`)),
    );
    results.forEach((formatted, index) => {
      const { el, hasTrailingNewline } = voidElements[index];
      expect(formatted).toBe(`<${el}>${hasTrailingNewline ? "\n" : ""}text\n`);
    });
  });

  it("should preserve void syntax on all void elements with following inline element", async () => {
    const results = await Promise.all(
      voidElements.map(({ el }) => format(`<${el}><span></span>`)),
    );
    results.forEach((formatted, index) => {
      const { el, hasTrailingNewline } = voidElements[index];
      expect(formatted).toBe(
        `<${el}>${hasTrailingNewline ? "\n" : ""}<span></span>\n`,
      );
    });
  });

  it("should preserve void syntax on all void elements with following block element", async () => {
    const results = await Promise.all(
      voidElements.map(({ el }) => format(`<${el}><div></div>`)),
    );
    results.forEach((formatted, index) => {
      const { el } = voidElements[index];
      expect(formatted).toBe(`<${el}>\n<div></div>\n`);
    });
  });

  it("should preserve void syntax on all void elements with following void element", async () => {
    const results = await Promise.all(
      voidElements.map(({ el }) => format(`<${el}><br>`)),
    );
    results.forEach((formatted, index) => {
      const { el, hasTrailingNewline } = voidElements[index];
      expect(formatted).toBe(`<${el}>${hasTrailingNewline ? "\n" : ""}<br>\n`);
    });
  });

  describe("avoid self-closing syntax on empty elements", async () => {
    it("<div></div>", async () => {
      const formatted = await format("<div></div>");
      expect(formatted).toBe("<div></div>\n");
    });
  });

  describe("Undo invalid self-closing syntax", async () => {
    it("void elements", async () => {
      const results = await Promise.all(
        voidElements.map(({ el }) => format(`<${el} />`)),
      );
      results.forEach((formatted, index) => {
        const { el } = voidElements[index];
        expect(formatted).toBe(`<${el}>\n`);
      });
    });

    it("div", async () => {
      const formatted = await format("<div />");
      expect(formatted).toBe("<div></div>\n");
    });
  });

  it("should preserve self-closing in SVG", async () => {
    const formatted = await format(
      `<svg><circle cx="50" cy="50" r="50" /></svg>`,
    );
    expect(formatted).toBe(`<svg><circle cx="50" cy="50" r="50" /></svg>\n`);
  });

  it("should preserve self-closing in MathML", async () => {
    const formatted = await format(
      `<math><mspace depth="40px" height="20px" width="100px" /></math>`,
    );
    expect(formatted).toBe(
      `<math><mspace depth="40px" height="20px" width="100px" /></math>\n`,
    );
  });
});
