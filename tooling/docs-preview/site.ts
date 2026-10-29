import { DOCS_PREVIEW_POLICY } from '../../src/core/docs-preview-policy.js';
interface ReferenceEntry {
  name: string;
  source: string;
}

export function inspectReference(source: string, entry: ReferenceEntry): string[] {
  const requirements = [
    ['trusted template', 'template: preview.html'],
    [
      'bounded frame height',
      `reacd_preview_height: ${DOCS_PREVIEW_POLICY.frameHeight}`,
    ],
    ['registered component', `reacd_preview: ${entry.name}`],
    ['live preview marker', '<!-- reacd-live-preview -->'],
    ['matching runnable source', `--8<-- "${entry.source}"`],
  ] as const;
  return requirements.flatMap(([label, expected]) =>
    source.includes(expected) ? [] : [label],
  );
}

export function inspectBuiltReference(html: string, name: string): string[] {
  const requirements = [
    ['named live frame', `<iframe title="Live ${name} example"`],
    ['compiled preview entry', `docs-preview.html?component=${name}`],
    ['runnable TSX source', 'class="language-tsx"'],
  ] as const;
  return requirements.flatMap(([label, expected]) =>
    html.includes(expected) ? [] : [label],
  );
}
