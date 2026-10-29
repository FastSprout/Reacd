import { CONTENT_POLICY, LAYOUT_POLICY } from './policy.js';

export const CHAT_TOOL_STATUSES = [
  'pending',
  'running',
  'approval',
  'success',
  'error',
] as const;

export const CHAT_FEEDBACK_DEFAULTS = {
  active: true,
  streaming: false,
  autoOpen: false,
  autoClose: false,
  disabled: false,
  reasoningLabel: 'Reasoning summary',
  emptyReasoning: 'No reasoning summary is available.',
  emptyTool: 'No tool details are available.',
  approveLabel: 'Approve tool request',
  rejectLabel: 'Reject tool request',
  retryLabel: 'Retry tool request',
} as const;

export const CHAT_FEEDBACK_POLICY = {
  maxSummaryLength: CONTENT_POLICY.maxTextLength,
  maxToolInputLength: CONTENT_POLICY.maxTextLength,
  maxToolOutputLength: CONTENT_POLICY.maxCodeLength,
  detailsRem: 16,
  pulseDurationMs: 1500,
  pulseIterations: 3,
  decorationBlockPx: LAYOUT_POLICY.borderWidthPx,
  decorationOpacity: { rest: 0.25, peak: 0.75 },
} as const;

export const CHAT_TOOL_LABELS = {
  pending: 'Pending',
  running: 'Running',
  approval: 'Awaiting approval',
  success: 'Completed',
  error: 'Failed',
} as const;

export function validToolActions(
  status: string,
  approve: boolean,
  reject: boolean,
  retry: boolean,
): boolean {
  if (approve !== reject) return false;
  if (approve && status !== 'approval') return false;
  return !retry || status === 'error';
}
