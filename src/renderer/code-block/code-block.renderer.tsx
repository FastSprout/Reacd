import type { CodeBlockProps } from '../../components/code-block/code-block.js';

export function CodeBlockSurface({ label, content }: CodeBlockProps) {
  return (
    <figure className="reacd-node reacd-code">
      <figcaption>{label}</figcaption>
      <pre>
        <code>{content}</code>
      </pre>
    </figure>
  );
}
