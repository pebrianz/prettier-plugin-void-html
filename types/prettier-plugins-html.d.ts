import type { Printer, Parser } from "prettier";

interface HtmlNode {
  namespace: string;
  isSelfClosing: boolean;
  tagDefinition?: {
    isVoid: boolean;
  };
  isLeadingSpaceSensitive?: boolean;
  hasLeadingSpaces?: boolean;
}

export declare module "prettier/plugins/html" {
  export declare const parsers: {
    html: Parser<HtmlNode>;
  };

  export declare const printers: {
    html: Printer<HtmlNode>;
  };
}
