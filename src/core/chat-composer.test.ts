import { expect, it } from 'vitest';
import { canSendPrompt, promptKeyIntent } from './chat-composer.js';
import { CHAT_COMPOSER_POLICY } from './chat-composer-policy.js';

it('gates sends by capability, status and meaningful draft content', () => {
  expect(canSendPrompt('Message', 0, 'ready', false, false)).toBe(true);
  expect(canSendPrompt('  ', 1, 'ready', false, false)).toBe(true);
  expect(canSendPrompt(' \n ', 0, 'ready', false, false)).toBe(false);
  expect(canSendPrompt('Message', 0, 'ready', true, false)).toBe(false);
  expect(canSendPrompt('Message', 0, 'ready', false, true)).toBe(false);
  for (const status of ['submitted', 'streaming', 'error'] as const)
    expect(canSendPrompt('Message', 1, status, false, false)).toBe(false);
});

it('preserves composition/newlines and makes Enter policy explicit', () => {
  const key = {
    key: 'Enter',
    composing: false,
    keyCode: 0,
    shift: false,
    control: false,
    meta: false,
    alt: false,
  };
  expect(promptKeyIntent(key, true)).toBe('submit');
  expect(promptKeyIntent(key, false)).toBe('none');
  expect(promptKeyIntent({ ...key, control: true }, false)).toBe('submit');
  expect(promptKeyIntent({ ...key, meta: true }, false)).toBe('submit');
  expect(promptKeyIntent({ ...key, shift: true }, true)).toBe('none');
  expect(promptKeyIntent({ ...key, alt: true }, true)).toBe('none');
  expect(promptKeyIntent({ ...key, composing: true }, true)).toBe('none');
  expect(
    promptKeyIntent({ ...key, keyCode: CHAT_COMPOSER_POLICY.compositionKeyCode }, true),
  ).toBe('none');
  expect(promptKeyIntent({ ...key, key: 'Escape' }, true)).toBe('close');
  expect(promptKeyIntent({ ...key, key: 'Tab' }, true)).toBe('none');
});
