import { isAdapterEntry, isConcreteAdapterPackage } from './adapter-package.js';
import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';
import { importVisitor } from './imports.js';
import { inspectSource } from './parse.js';
import { isTrustedUiDependency } from './ui-dependencies.js';

const STYLING_PROPS = new Set([
  'class',
  'className',
  'style',
  'css',
  'sx',
  'as',
  'asChild',
  'component',
  'dangerouslySetInnerHTML',
]);
const DOM_GLOBALS = new Set([
  'document',
  'window',
  'globalThis',
  'HTMLElement',
  'customElements',
]);
const PRIVATE_PATH = /(?:^|\/)(?:core|schema|renderer|adapter|internal)(?:\/|$)/;
const ADAPTER_RUNTIME = '@fastsprout/reacd/adapter-runtime';
const RAW_RUNTIME = /(?:react(?:-dom)?(?:\/|$)|jsx(?:-dev)?-runtime)/;

export function checkApplication(file: string, source: string): PolicyDiagnostic[] {
  const issues: PolicyDiagnostic[] = [];
  const add = (offset: number, message: string) => {
    issues.push(diagnostic(file, source, offset, 'application', message));
  };
  const imports = importVisitor(({ value, offset }) => {
    if (value === null) {
      add(offset, 'Computed imports are not allowed in application views.');
    } else if (/\.(?:css|scss|sass|less)(?:\?|$)/.test(value)) {
      add(offset, 'Styles belong to the renderer or adapter.');
    } else if (isTrustedUiDependency(value)) {
      add(offset, 'Vendor UI and styling integrations belong to renderer or adapter.');
    } else if (
      value === ADAPTER_RUNTIME ||
      value.startsWith(`${ADAPTER_RUNTIME}/`) ||
      (isConcreteAdapterPackage(value) && !isAdapterEntry(value))
    ) {
      add(offset, 'Trusted adapter internals are not application APIs.');
    } else if (PRIVATE_PATH.test(value)) {
      add(offset, 'Private framework paths are not application APIs.');
    } else if (RAW_RUNTIME.test(value) && value !== 'react') {
      add(offset, 'Applications use the reacd JSX runtime.');
    }
  });
  const syntax = inspectSource(file, source, {
    ...imports,
    ImportDeclaration(node) {
      imports.ImportDeclaration?.(node);
      for (const specifier of node.specifiers) {
        if (
          node.source.value === 'react' &&
          (specifier.type !== 'ImportSpecifier' ||
            (specifier.imported.type === 'Identifier'
              ? specifier.imported.name === 'createElement'
              : specifier.imported.value === 'createElement'))
        ) {
          add(specifier.start, 'Import named React hooks and types only.');
        }
      }
    },
    JSXOpeningElement(node) {
      if (
        node.name.type === 'JSXNamespacedName' ||
        (node.name.type === 'JSXIdentifier' && /^[a-z]/.test(node.name.name))
      ) {
        add(node.start, 'Native JSX elements are forbidden.');
      }
    },
    JSXAttribute(node) {
      if (node.name.type === 'JSXIdentifier' && STYLING_PROPS.has(node.name.name)) {
        add(node.start, `Forbidden application prop: ${node.name.name}.`);
      }
    },
    JSXSpreadAttribute(node) {
      add(node.start, 'Spread props can bypass closed component contracts.');
    },
    Identifier(node) {
      if (DOM_GLOBALS.has(node.name)) {
        add(node.start, `Browser internals are forbidden: ${node.name}.`);
      }
    },
  });
  return [...issues, ...syntax];
}
