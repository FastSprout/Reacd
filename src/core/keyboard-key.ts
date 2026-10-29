import type { KeyboardPlatform } from './kbd-policy.js';

export interface KeyPresentation {
  readonly display: string;
  readonly label: string;
}
const FIXED: ReadonlyMap<string, KeyPresentation> = new Map([
  ['win', { display: '⊞', label: 'Windows' }],
  ['command', { display: '⌘', label: 'Command' }],
  ['shift', { display: '⇧', label: 'Shift' }],
  ['control', { display: '⌃', label: 'Control' }],
  ['option', { display: '⌥', label: 'Option' }],
  ['enter', { display: '↵', label: 'Enter' }],
  ['delete', { display: '⌦', label: 'Delete' }],
  ['backspace', { display: '⌫', label: 'Backspace' }],
  ['escape', { display: 'Esc', label: 'Escape' }],
  ['tab', { display: '⇥', label: 'Tab' }],
  ['capslock', { display: '⇪', label: 'Caps Lock' }],
  ['arrowup', { display: '↑', label: 'Arrow Up' }],
  ['arrowright', { display: '→', label: 'Arrow Right' }],
  ['arrowdown', { display: '↓', label: 'Arrow Down' }],
  ['arrowleft', { display: '←', label: 'Arrow Left' }],
  ['pageup', { display: '⇞', label: 'Page Up' }],
  ['pagedown', { display: '⇟', label: 'Page Down' }],
  ['home', { display: '↖', label: 'Home' }],
  ['end', { display: '↘', label: 'End' }],
]);
const PLATFORM: ReadonlyMap<
  string,
  Record<KeyboardPlatform, KeyPresentation>
> = new Map([
  [
    'meta',
    {
      apple: { display: '⌘', label: 'Command' },
      other: { display: 'Ctrl', label: 'Control' },
    },
  ],
  [
    'ctrl',
    {
      apple: { display: '⌃', label: 'Control' },
      other: { display: 'Ctrl', label: 'Control' },
    },
  ],
  [
    'alt',
    {
      apple: { display: '⌥', label: 'Option' },
      other: { display: 'Alt', label: 'Alt' },
    },
  ],
]);
export function keyboardKey(
  value: string,
  platform: KeyboardPlatform,
): KeyPresentation {
  const specific = PLATFORM.get(value);
  if (specific !== undefined) return specific[platform];
  return FIXED.get(value) ?? { display: value, label: value };
}
