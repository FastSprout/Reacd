import { expect, it } from 'vitest';
import { EDITOR_LAYOUT } from '../../core/editor-layout.js';
import { editorVariables } from './editor-variables.js';

it('reserves editor and menu extents through the named layout policy', () => {
  const variables = editorVariables();
  expect(variables['--reacd-editor-min-block']).toBe(`${EDITOR_LAYOUT.minBlockRem}rem`);
  expect(variables['--reacd-editor-menu-block']).toBe(
    `${EDITOR_LAYOUT.menuMaxBlockRem}rem`,
  );
  expect(variables['--reacd-editor-indent']).toBe(
    `${EDITOR_LAYOUT.nestedIndentPercent}%`,
  );
});
