import { useContext } from 'react';
import type { ChatPromptSubmitProps } from
  '@fastsprout/reacd/adapter-runtime/components/index.js';
import { PromptScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-prompt/prompt-context.js';
import { Issues } from
  '@fastsprout/reacd/adapter-runtime/renderer/issues/issues.renderer.js';
import { Button } from '../primitives/button.js';
import { resolvePromptAction } from './prompt-action.js';

export function SharedChatPromptSubmit(properties: ChatPromptSubmitProps) {
  const scope = useContext(PromptScopeContext);
  const result = resolvePromptAction(properties, scope);
  if (!result.success) return <Issues issues={result.issues} />;
  const { label, disabled, run, status } = result.data;
  return (
    <Button
      type="button"
      className="reacd-node reacd-button reacd-chat-prompt-submit"
      aria-label={label}
      disabled={disabled}
      data-status={status}
      variant={status === 'ready' ? 'default' : 'secondary'}
      onClick={run === undefined ? undefined : () => run()}
    >
      {label}
    </Button>
  );
}
