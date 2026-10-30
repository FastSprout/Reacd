import { z } from 'zod';
import type { ReacdDocument, ReacdNode } from '@fastsprout/reacd';

export const scenarioSchema = z.enum(['standard', 'long', 'empty', 'loading', 'error']);
export type Scenario = z.infer<typeof scenarioSchema>;
export const scenarioLabels: Record<Scenario, string> = {
  standard: 'Standard data',
  long: 'Long text',
  empty: 'Empty data',
  loading: 'Loading',
  error: 'Data error',
};

export function createExample(scenario: Scenario): ReacdDocument {
  const rows = [
    ['ORDER-001', 'Material delivery', 'In progress'],
    ['ORDER-002', 'Regional transport', 'Ready'],
    ['ORDER-003', 'Inventory replenishment', 'Needs review'],
  ];
  const long = scenario === 'long';
  const metric = (title: string, value: string): ReacdNode => ({
    type: 'Card',
    spacing: 'small',
    children: [
      { type: 'Text', content: title, role: 'caption' },
      { type: 'Text', content: value, role: 'display' },
    ],
  });
  return {
    schemaVersion: '0.1',
    templateId: 'saas-modern-light',
    root: {
      type: 'VStack',
      spacing: 'large',
      children: [
        {
          type: 'Text',
          role: 'caption',
          content: 'Sample data · no server connection',
        },
        {
          type: 'Text',
          role: 'headline',
          lineLimit: 2,
          content: long
            ? 'Order management across all branches and logistics processes. ' +
              'VeryLongIdentifierWithoutSpaces'.repeat(12)
            : 'Order overview',
        },
        {
          type: 'Text',
          content:
            'The same structure uses both templates. Resize the preview ' +
            'to inspect the layout.',
        },
        {
          type: 'Grid',
          columns: 3,
          spacing: 'medium',
          children: [
            metric('Sample orders', '3'),
            metric('In progress', '1'),
            metric('Ready for collection', '1'),
          ],
        },
        {
          type: 'Card',
          children: [
            { type: 'Text', role: 'subheadline', content: 'Order note' },
            {
              type: 'Text',
              role: 'caption',
              content: 'Saving only affects this preview in memory.',
            },
            {
              type: 'HStack',
              children: [
                {
                  type: 'Input',
                  id: 'note',
                  label: 'Note content',
                  placeholder: 'For example, deliver after noon',
                  required: true,
                },
                {
                  type: 'Button',
                  label: 'Save note',
                  action: 'save-note',
                  intent: 'primary',
                },
              ],
            },
          ],
        },
        {
          type: 'Table',
          caption: 'Sample orders',
          columns: ['Number', 'Description', 'Status'],
          rows: scenario === 'empty' ? [] : rows,
          state:
            scenario === 'loading'
              ? 'loading'
              : scenario === 'error'
                ? 'error'
                : 'ready',
          emptyMessage: 'The list is empty. Select Standard data to show the table.',
          errorMessage:
            'Sample read failure. Choose another state to restore the table.',
        },
        ...(long
          ? [
              {
                type: 'Text',
                content: 'https://example.com/' + 'unbroken-identifier'.repeat(20),
              } satisfies ReacdNode,
            ]
          : []),
      ],
    },
  };
}
