import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';
import {
  isSharedAdapterPath,
  nativeAdapterImportError,
  SHARED_UI_ERROR,
} from './native-adapter.js';

const QUOTED = String.raw`"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'`;
const IDENTIFIER = String.raw`(?:[\w-]|\\[\da-f]{1,6}\s?|\\[\s\S])+`;
const CSS_TOKENS = new RegExp(`${QUOTED}|@${IDENTIFIER}`, 'giu');
const IMPORT_VALUE = new RegExp(
  `^\\s*(?:${IDENTIFIER}\\(\\s*)?(?:${QUOTED}|[^\\s;)]+)`,
  'iu',
);

function decodeCssPath(value: string): string {
  return value.replace(
    /\\(?:([\da-f]{1,6})\s?|([\s\S]))/giu,
    (_match: string, hex: string | undefined, character: string = '') => {
      if (hex === undefined) return character;
      const code = Number.parseInt(hex, 16);
      return code === 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)
        ? '\ufffd'
        : String.fromCodePoint(code);
    },
  );
}

export function checkNativeStyles(
  file: string,
  source: string,
  root: string,
): PolicyDiagnostic[] {
  const issues: PolicyDiagnostic[] = [];
  if (isSharedAdapterPath(file, root)) {
    issues.push(diagnostic(file, source, 0, 'architecture', SHARED_UI_ERROR));
  }
  const css = source.replace(/\/\*[\s\S]*?\*\//g, (comment) =>
    comment.replace(/[^\r\n]/g, ' '),
  );
  for (const match of css.matchAll(CSS_TOKENS)) {
    if (decodeCssPath(match[0]).toLowerCase() !== '@import') continue;
    const argument = css.slice(match.index + match[0].length).match(IMPORT_VALUE)?.[0];
    if (argument === undefined) continue;
    const value = decodeCssPath(argument.trimStart())
      .replace(/^url\(\s*/iu, '')
      .replace(/^['"]|['"]$/g, '');
    const message = nativeAdapterImportError(file, value, root);
    if (message !== null) {
      issues.push(diagnostic(file, source, match.index, 'architecture', message));
    }
  }
  return issues;
}
