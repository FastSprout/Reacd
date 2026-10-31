import type { ContentSearchButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-search-button/index.js';
import { CONTENT_SEARCH_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/content-search-policy.js';
import { Button } from '../primitives/button.js';

export function SharedContentSearchButton({
  label = CONTENT_SEARCH_DEFAULTS.buttonLabel,
  open,
  onOpenChange,
  disabled,
}: ContentSearchButtonProps) {
  return (
    <Button
      className="reacd-node reacd-button reacd-search-button"
      type="button"
      variant="outline"
      aria-haspopup="dialog"
      aria-expanded={open}
      disabled={disabled}
      onClick={() => onOpenChange(true)}
    >
      {label}
    </Button>
  );
}
