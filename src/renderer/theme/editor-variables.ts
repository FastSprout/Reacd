import { EDITOR_LAYOUT } from '../../core/editor-layout.js';

export function editorVariables() {
  return {
    '--reacd-editor-min-block': `${EDITOR_LAYOUT.minBlockRem}rem`,
    '--reacd-editor-menu-block': `${EDITOR_LAYOUT.menuMaxBlockRem}rem`,
    '--reacd-editor-indent': `${EDITOR_LAYOUT.nestedIndentPercent}%`,
  };
}
