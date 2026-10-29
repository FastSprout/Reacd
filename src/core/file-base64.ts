import { BASE64_POLICY as P, FILE_UPLOAD_POLICY } from './file-upload-policy.js';
function sextet(code: number): number | undefined {
  if (code >= P.uppercase.start && code <= P.uppercase.end)
    return code - P.uppercase.start + P.uppercase.offset;
  if (code >= P.lowercase.start && code <= P.lowercase.end)
    return code - P.lowercase.start + P.lowercase.offset;
  if (code >= P.digits.start && code <= P.digits.end)
    return code - P.digits.start + P.digits.offset;
  if (code === P.plusCode) return P.plusValue;
  if (code === P.slashCode) return P.slashValue;
  return undefined;
}
export function encodedBase64Length(bytes: number): number {
  return Math.ceil(bytes / P.bytesPerBlock) * P.charactersPerBlock;
}
export function isCanonicalBase64(data: string, bytes: number): boolean {
  if (!Number.isInteger(bytes) || bytes < 0 || bytes > FILE_UPLOAD_POLICY.maxFileBytes)
    return false;
  if (data.length !== encodedBase64Length(bytes)) return false;
  const remainder = bytes % P.bytesPerBlock;
  const padding = remainder === 0 ? 0 : P.bytesPerBlock - remainder;
  const end = data.length - padding;
  let lastDigit = 0;
  for (let index = 0; index < end; index += 1) {
    const digit = sextet(data.charCodeAt(index));
    if (digit === undefined) return false;
    lastDigit = digit;
  }
  const mask = (1 << (padding * P.bitsPerPadding)) - 1;
  if ((lastDigit & mask) !== 0) return false;
  for (let index = end; index < data.length; index += 1)
    if (data.charCodeAt(index) !== P.paddingCode) return false;
  return true;
}
