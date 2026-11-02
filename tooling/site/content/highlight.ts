import { codeToTokens, getSingletonHighlighter } from 'shiki';
import { z } from 'zod';
import type { ProseCode } from '../../../src/core/prose.js';

const languageSchema = z.enum([
  'tsx',
  'ts',
  'typescript',
  'json',
  'sh',
  'shell',
  'bash',
  'text',
  'plaintext',
]);
const paletteSchema = z.object({
  '--shiki-light': z.string().regex(/^#[\da-f]{6,8}$/i),
  '--shiki-dark': z.string().regex(/^#[\da-f]{6,8}$/i),
});
const themes = { light: 'github-light', dark: 'github-dark' } as const;

export async function highlightCode(
  content: string,
  language: string,
): Promise<ProseCode> {
  const lang = languageSchema.parse(language);
  const highlighter = await getSingletonHighlighter({
    themes: Object.values(themes),
    langs: [],
  });
  const defaults = {
    '--shiki-light': highlighter.getTheme(themes.light).fg,
    '--shiki-dark': highlighter.getTheme(themes.dark).fg,
  };
  const result = await codeToTokens(content, { lang, themes, defaultColor: false });
  return {
    type: 'code',
    language,
    content,
    tokens: result.tokens.map((line) =>
      line.map((token) => {
        const colors = paletteSchema.parse({ ...defaults, ...token.htmlStyle });
        return {
          text: token.content,
          light: colors['--shiki-light'],
          dark: colors['--shiki-dark'],
        };
      }),
    ),
  };
}
