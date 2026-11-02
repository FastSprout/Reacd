import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { treeSchema } from '../../src/schema/tree/tree.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { TreeExample } from './tree.js';

it(
  'reports native unavailability and retains independent host expansion/selection',
  () => {
  expectUnsupportedExample(<TreeExample />, 'Tree');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <TreeExample />
    </probe.Surface>,
  );
  const read = () => probe.read('Tree', treeSchema, 'Project documents');
  expect(read().value).toEqual([]);
  expect(read().expanded).toEqual([]);
  act(() => read().onExpandedChange(['documents']));
  expect(read().expanded).toEqual(['documents']);
  expect(read().value).toEqual([]);
  act(() => read().onValueChange(['brief']));
  expect(read().value).toEqual(['brief']);
  expect(read().expanded).toEqual(['documents']);
});
