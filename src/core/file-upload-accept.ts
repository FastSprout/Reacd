import type { FILE_ACCEPT_GROUPS } from './file-upload-policy.js';
export type FileAcceptGroup = (typeof FILE_ACCEPT_GROUPS)[number];
export function acceptsUpload(group: FileAcceptGroup, mediaType: string): boolean {
  if (group === 'all') return true;
  if (group === 'pdf') return mediaType === 'application/pdf';
  return mediaType.startsWith(group === 'images' ? 'image/' : 'text/');
}
