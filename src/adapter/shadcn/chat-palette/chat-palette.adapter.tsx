import type { ChatPaletteProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-palette/index.js';

export function ShadcnChatPalette({ label, children, prompt }: ChatPaletteProps) {
  return (
    <section className="reacd-node reacd-chat-palette" aria-label={label}>
      <div className="reacd-chat-palette-content">{children}</div>
      {prompt !== undefined && (
        <footer className="reacd-chat-palette-prompt">{prompt}</footer>
      )}
    </section>
  );
}
