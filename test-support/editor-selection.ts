import { fireEvent } from '@testing-library/react';

export function selectEditorText(element: HTMLElement, mode: 'end' | 'all' = 'end') {
  const paragraph = element.querySelector('p');
  if (paragraph === null) throw new Error('Expected a native paragraph fixture.');
  element.focus();
  const range = document.createRange();
  range.selectNodeContents(paragraph);
  if (mode === 'end') range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  fireEvent(document, new Event('selectionchange'));
}
