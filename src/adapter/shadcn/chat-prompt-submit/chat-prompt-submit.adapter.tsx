import { useContext } from 'react';
import type { ChatPromptSubmitProps } from '../../../components/index.js';
import { PromptScopeContext } from '../../../renderer/chat-prompt/prompt-context.js';
import { Issues } from '../../../renderer/issues/issues.renderer.js';
import { Button } from '../vendor/ui/button.js';
import { resolvePromptAction } from './prompt-action.js';

export function ShadcnChatPromptSubmit(properties: ChatPromptSubmitProps) {
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
