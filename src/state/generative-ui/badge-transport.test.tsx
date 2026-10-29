import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { compileJsonSchema } from '../../../test-support/compile-json-schema.js';
import { GenerativeUI, validateGenerativeDocument } from '../../generative.js';

const ROOT = {
  type: 'Badge', label: 'Queued', intent: 'primary',
  leadingIcon: 'info', size: 'small',
};
function document(root: unknown) {
  return { schemaVersion: '0.2', state: [], root };
}

it('renders a literal Badge through the public whole-document boundary', () => {
  render(<GenerativeUI document={document(ROOT)} />);
  expect(screen.getByText('Queued')).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.queryByRole('img')).toBeNull();
});

it('matches the strict portable literal Badge shape without state or escapes', () => {
  const schema: unknown = JSON.parse(
    readFileSync('schema/generative.schema.json', 'utf8'),
  );
  const portable = compileJsonSchema(schema);
  expect(portable(document(ROOT))).toBe(true);
  expect(validateGenerativeDocument(document(ROOT)).success).toBe(true);
  for (const extra of [
    { className: 'custom' }, { style: {} }, { html: '<b>Queued</b>' },
    { children: [] }, { onPress: 'host' }, { size: 'huge' },
    { leadingIcon: 'unknown-icon' }, { label: { state: 'name', mode: 'read' } },
  ]) {
    const input = document({ ...ROOT, ...extra });
    expect(portable(input)).toBe(false);
    expect(validateGenerativeDocument(input).success).toBe(false);
  }
});
