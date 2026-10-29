import type {
  ContentSearchButtonProps,
} from '../../../components/content-search-button/index.js';
import { CONTENT_SEARCH_DEFAULTS } from '../../../core/content-search-policy.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnContentSearchButton({
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
