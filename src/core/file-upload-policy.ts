import { CONTENT_POLICY } from './policy.js';
const MEBIBYTE = 1024 ** 2;
const MAX_FILE_BYTES = 8 * MEBIBYTE;
export const BASE64_POLICY = {
  bytesPerBlock: 3,
  charactersPerBlock: 4,
  bitsPerPadding: 2,
  uppercase: { start: 65, end: 90, offset: 0 },
  lowercase: { start: 97, end: 122, offset: 26 },
  digits: { start: 48, end: 57, offset: 52 },
  plusCode: 43,
  plusValue: 62,
  slashCode: 47,
  slashValue: 63,
  paddingCode: 61,
} as const;
export const FILE_ACCEPT_GROUPS = ['all', 'images', 'pdf', 'text'] as const;
export const FILE_UPLOAD_POLICY = {
  maxFiles: 10,
  singleFileCount: 1,
  maxFileBytes: MAX_FILE_BYTES,
  maxTotalBytes: 16 * MEBIBYTE,
  maxEncodedCharacters:
    Math.ceil(MAX_FILE_BYTES / BASE64_POLICY.bytesPerBlock) *
    BASE64_POLICY.charactersPerBlock,
  maxFilenameLength: 255,
  maxIdLength: CONTENT_POLICY.maxIdentifierLength,
  maxMediaTypeLength: 127,
  maximumTimestamp: Number.MAX_SAFE_INTEGER,
  idPrefix: 'file-',
  idAttempts: 10,
} as const;
export const FILE_UPLOAD_ERRORS = {
  count: 'File count exceeds the permitted limit.',
  metadata: 'File metadata or encoded length is invalid or exceeds its budget.',
  total: 'Total file bytes exceed the permitted limit.',
  inspect: 'File data cannot be inspected safely.',
  canonical: 'File content must use canonical base64 matching its byte size.',
  accept: 'The selected file type is not accepted.',
  read: 'Unable to read the selected files. Try choosing them again.',
  identity: 'Unable to allocate unique file identifiers.',
} as const;
export const FILE_ACCEPT_TYPES = {
  all: undefined,
  images: 'image/*',
  pdf: 'application/pdf',
  text: 'text/*',
} as const;
export const FILE_UPLOAD_DEFAULTS = {
  multiple: true,
  accept: 'all',
  mediaType: 'application/octet-stream',
  chooseLabel: 'Choose files',
  dropLabel: 'Choose files or drop them here.',
  cancelLabel: 'Cancel reading',
  emptyLabel: 'No files selected.',
  busyLabel: 'Reading files…',
  cancelledLabel: 'Reading canceled.',
  requiredLabel: 'Choose at least one file.',
} as const;
