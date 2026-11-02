export interface ProseText {
  readonly type: 'text' | 'code';
  readonly text: string;
}

export interface ProseFormatting {
  readonly type: 'strong' | 'emphasis' | 'delete';
  readonly children: readonly ProseInline[];
}

export interface ProseLink {
  readonly type: 'link';
  readonly href: string;
  readonly children: readonly ProseInline[];
}

export type ProseInline =
  | ProseText
  | ProseFormatting
  | ProseLink
  | { readonly type: 'break' };

export interface ProseToken {
  readonly text: string;
  readonly light: string;
  readonly dark: string;
}

export interface ProseHeading {
  readonly type: 'heading';
  readonly level: 1 | 2 | 3 | 4 | 5 | 6;
  readonly id: string;
  readonly children: readonly ProseInline[];
}

export interface ProseParagraph {
  readonly type: 'paragraph';
  readonly children: readonly ProseInline[];
}

export interface ProseList {
  readonly type: 'list';
  readonly ordered: boolean;
  readonly start?: number;
  readonly items: readonly {
    readonly children: readonly ProseBlock[];
    readonly checked?: boolean;
  }[];
}

export interface ProseCode {
  readonly type: 'code';
  readonly language: string;
  readonly content: string;
  readonly tokens?: readonly (readonly ProseToken[])[];
}

export interface ProseTable {
  readonly type: 'table';
  readonly header: readonly (readonly ProseInline[])[];
  readonly rows: readonly (readonly (readonly ProseInline[])[])[];
}

export type ProseBlock =
  | ProseHeading
  | ProseParagraph
  | ProseList
  | ProseCode
  | ProseTable
  | { readonly type: 'quote'; readonly children: readonly ProseBlock[] }
  | { readonly type: 'thematicBreak' }
  | {
      readonly type: 'image';
      readonly src: string;
      readonly alt: string;
      readonly title?: string;
    };

export type ProseDocument = readonly ProseBlock[];
