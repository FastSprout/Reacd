import type { CodeBlockProps } from
  '@fastsprout/reacd/adapter-runtime/components/code-block/code-block.props.js';
import { ShadcnProseCode } from '../prose/code.js';

export type ShadcnCodeBlockProps = CodeBlockProps;

export function ShadcnCodeBlock({ label, content }: ShadcnCodeBlockProps) {
  return <ShadcnProseCode node={{ type: 'code', language: label, content }} />;
}
