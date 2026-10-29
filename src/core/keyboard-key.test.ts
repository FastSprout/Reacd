import { describe, expect, it } from 'vitest';
import { keyboardKey } from './keyboard-key.js';

describe('keyboard key notation', () => {
  it('resolves explicit platform modifiers without browser inference', () => {
    for (const [value, apple, other] of [
      ['meta', '⌘', 'Ctrl'],
      ['ctrl', '⌃', 'Ctrl'],
      ['alt', '⌥', 'Alt'],
    ]) {
      if (value === undefined) throw new Error('Missing key fixture.');
      expect(keyboardKey(value, 'apple').display).toBe(apple);
      expect(keyboardKey(value, 'other').display).toBe(other);
    }
  });
  it('preserves supported aliases and unknown literal keys safely', () => {
    for (const [value, display] of [
      ['win', '⊞'],
      ['command', '⌘'],
      ['shift', '⇧'],
      ['control', '⌃'],
      ['option', '⌥'],
      ['enter', '↵'],
      ['delete', '⌦'],
      ['backspace', '⌫'],
      ['escape', 'Esc'],
      ['tab', '⇥'],
      ['capslock', '⇪'],
      ['arrowup', '↑'],
      ['arrowright', '→'],
      ['arrowdown', '↓'],
      ['arrowleft', '←'],
      ['pageup', '⇞'],
      ['pagedown', '⇟'],
      ['home', '↖'],
      ['end', '↘'],
    ]) {
      if (value === undefined) throw new Error('Missing key fixture.');
      expect(keyboardKey(value, 'other').display).toBe(display);
      expect(keyboardKey(value, 'other').label.length).toBeGreaterThan(0);
    }
    for (const value of ['K', 'Control', '__proto__', 'constructor', 'F12'])
      expect(keyboardKey(value, 'other')).toEqual({ display: value, label: value });
  });
});
