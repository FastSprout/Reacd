import { expect, it } from 'vitest';
import { chatAttachmentSchema } from './chat-attachment.schema.js';
import { CHAT_POLICY } from '../../core/chat-policy.js';

it('accepts safe controlled file metadata and every upload state', () => {
  for (const status of ['idle', 'uploading', 'error'] as const) {
    expect(
      chatAttachmentSchema.safeParse({
        name: 'report.pdf',
        mediaType: 'application/pdf',
        description: 'Project reference',
        status,
        onRemove: () => undefined,
        disabled: true,
      }).success,
    ).toBe(true);
  }
  for (const url of ['/files/photo.png', 'https://example.com/photo.png']) {
    expect(
      chatAttachmentSchema.safeParse({ name: 'Photo', mediaType: 'image/png', url })
        .success,
    ).toBe(true);
  }
  expect(
    chatAttachmentSchema.parse({ name: 'Photo', mediaType: 'IMAGE/PNG' }).mediaType,
  ).toBe('image/png');
});

it('rejects dangerous URLs, invalid metadata and native escape hatches', () => {
  for (const change of [
    { name: '' },
    { name: 'x'.repeat(CHAT_POLICY.maxFileNameLength + 1) },
    { mediaType: 'not-a-media-type' },
    { url: 'javascript:alert(1)' },
    { url: 'data:image/svg+xml,<svg/>' },
    { url: '//external.test/file.png' },
    { url: 'https://user:secret@example.com/photo.png' },
    { status: 'complete' },
    { onRemove: 'remove' },
    { style: {} },
    { className: 'x' },
    { onClick: () => undefined },
  ]) {
    expect(
      chatAttachmentSchema.safeParse({
        name: 'report.pdf',
        mediaType: 'application/pdf',
        ...change,
      }).success,
    ).toBe(false);
  }
});
