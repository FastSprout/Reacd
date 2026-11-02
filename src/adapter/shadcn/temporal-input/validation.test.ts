import { expect, it, vi } from 'vitest';
import { temporalIssue, temporalDraftIssue } from './validation.js';
import type { TemporalFieldProps } from './field.props.js';

it('checks canonical inclusive bounds and cross-endpoint order', () => {
  const base: TemporalFieldProps = {
    kind: 'date',
    referenceDate: '2024-02-28',
    label: 'Date',
    value: null,
    onValueChange: vi.fn(),
    min: '2024-02-28',
    max: '2024-03-01',
  };
  expect(temporalIssue(base, null)).toBeUndefined();
  expect(temporalIssue(base, '2024-02-28')).toBeUndefined();
  expect(temporalIssue(base, '2024-03-02')).toContain('allowed limits');
  expect(
    temporalIssue({ ...base, endpoint: 'start', peer: '2024-02-28' }, '2024-03-01'),
  ).toContain('ordered');
  expect(
    temporalIssue({ ...base, endpoint: 'end', peer: '2024-03-01' }, '2024-02-28'),
  ).toContain('ordered');
  expect(
    temporalIssue({ ...base, endpoint: 'end', peer: '2024-02-28' }, '2024-03-01'),
  ).toBeUndefined();
  expect(
    temporalIssue({ ...base, endpoint: 'start', peer: '2024-03-01' }, '2024-02-28'),
  ).toBeUndefined();
  expect(
    temporalIssue(
      { ...base, kind: 'time', min: '09:00:00', max: '17:00:00' },
      '08:00:00',
    ),
  ).toContain('allowed limits');
  expect(temporalDraftIssue(base, null)).toBeUndefined();
});
