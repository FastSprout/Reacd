import { CONTENT_POLICY, LAYOUT_POLICY } from './policy.js';

export const CHAT_ROLES = ['user', 'assistant', 'system', 'tool'] as const;
export const CHAT_MESSAGE_STATUSES = ['ready', 'streaming', 'error'] as const;
export const CHAT_STATUSES = ['ready', 'submitted', 'streaming', 'error'] as const;
export const CHAT_ATTACHMENT_STATUSES = ['idle', 'uploading', 'error'] as const;

export const CHAT_POLICY = {
  maxMessages: 200,
  maxAttachments: 10,
  maxActions: 8,
  maxFileNameLength: CONTENT_POLICY.maxLabelLength,
  maxMessageLength: CONTENT_POLICY.maxTextLength,
  maxMediaTypeLength: 160,
  viewportRem: 28,
  imageRem: 4,
  metadataTrackRem: 8,
  bottomDistancePx: LAYOUT_POLICY.controlTargetPx,
} as const;

export const CHAT_DEFAULTS = {
  attachmentStatus: 'idle',
  messageStatus: 'ready',
  status: 'ready',
  followLatest: true,
  emptyLabel: 'No messages yet.',
  submittedLabel: 'Waiting for a response.',
  streamingLabel: 'Receiving response.',
  errorLabel: 'The response could not be completed.',
  retryLabel: 'Retry response',
  latestLabel: 'Jump to latest message',
  uploadingLabel: 'Uploading',
  uploadErrorLabel: 'Upload failed',
  fileLabel: 'File',
  removePrefix: 'Remove',
} as const;
