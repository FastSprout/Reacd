import { defineGenerativeDeclaration } from 'reacd/generative';
import { TABLE_STATE, TABLE_NODE } from './data-table-example.js';

export const GENERATIVE_EXAMPLE = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    ...TABLE_STATE,
    { key: 'note', kind: 'text', initial: '', access: 'readWrite' },
    { key: 'enabled', kind: 'boolean', initial: false, access: 'readWrite' },
    { key: 'amount', kind: 'number', initial: 25, access: 'readWrite' },
  ],
  root: {
    type: 'Card',
    children: [
      { type: 'Text', role: 'subheadline', content: 'Generated example' },
      {
        type: 'Input',
        label: 'Example note',
        value: { state: 'note', mode: 'readWrite' },
      },
      { type: 'Text', role: 'caption', content: 'The following display reads note:' },
      { type: 'Text', content: { state: 'note', mode: 'read' } },
      {
        type: 'Checkbox',
        label: 'Enabled',
        checked: { state: 'enabled', mode: 'readWrite' },
      },
      { type: 'Text', content: { state: 'enabled', mode: 'read' } },
      {
        type: 'Slider',
        label: 'Example amount',
        min: 0,
        max: 100,
        step: 5,
        value: { state: 'amount', mode: 'readWrite' },
      },
      {
        type: 'Progress',
        label: 'Shared amount',
        value: { state: 'amount', mode: 'read' },
      },
      { type: 'Button', label: 'Save note', action: 'saveExample' },
      TABLE_NODE,
    ],
  },
});

export const GENERATIVE_SOURCE = JSON.stringify(GENERATIVE_EXAMPLE, null, 2);
