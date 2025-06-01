import type { Parser, Plugin, Printer, SupportLanguage } from "prettier";
import type { builders } from "prettier/doc.js";
import type { HtmlNode } from "types/prettier-plugins-html.js";
import * as htmlPlugin from "prettier/plugins/html";

export const languages: SupportLanguage[] = [
  {
    name: "HTML5",
    extensions: [".html"],
    parsers: ["html"],
    vscodeLanguageIds: ["html"],
  },
];

const htmlParser: Parser<HtmlNode> = {
  ...htmlPlugin.parsers.html,
  astFormat: "html",
};

export const parsers: Plugin["parsers"] = {
  html: htmlParser,
};

function isGroup(doc: builders.Doc): boolean {
  return typeof doc === "object" && "type" in doc && doc.type === "group";
}

const htmlPrinter: Printer = {
  ...htmlPlugin.printers.html,
  print(path, options, print) {
    const node = path.node;

    // Self-closing syntax is allowed in SVG and MathML.
    if (!["svg", "math"].includes(node.namespace)) {
      node.isSelfClosing = false;
    }

    // Prevent forward slash in void tag borrowed end marker
    if (path.previous?.tagDefinition?.isVoid) {
      path.previous.isSelfClosing = false;
    }

    // Element is not void - use default printer
    if (!node.tagDefinition?.isVoid) {
      return htmlPlugin.printers.html.print(path, options, print);
    }

    // Pass element along to the default printer. Since it is no
    // longer marked as self-closing, the printer will give it a
    // closing tag. For example, `<input>` will become `<input></input>`.
    const printed = htmlPlugin.printers.html.print(
      path,
      options,
      print,
    ) as builders.Group;

    // Prevent unwanted linebreaks
    node.isSelfClosing = true;

    if (!isGroup(printed) || !Array.isArray(printed.contents)) return printed;

    // The last item in the contents is the new closing tag.
    // Remove it.
    printed.contents.pop();

    const openingTag = printed.contents[0] as builders.Group;

    // If the next element has borrowed the end marker from the new (removed) closing tag
    // Remove the opening tag end marker
    if (!path.next?.isLeadingSpaceSensitive || path.next.hasLeadingSpaces)
      return printed;

    if (isGroup(openingTag) && Array.isArray(openingTag.contents)) {
      openingTag.contents.pop();
    }

    return printed;
  },
};

export const printers: Plugin["printers"] = { html: htmlPrinter };
