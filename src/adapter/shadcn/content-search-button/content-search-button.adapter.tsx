import { SearchIcon } from 'lucide-react';
import type { ContentSearchButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-search-button/index.js';
import { CONTENT_SEARCH_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/content-search-policy.js';
import { Button } from '../vendor/ui/button.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnContentSearchButtonProps = ContentSearchButtonProps;

export function ShadcnContentSearchButton({
  label = CONTENT_SEARCH_DEFAULTS.buttonLabel,
  open,
  onOpenChange,
  disabled,
}: ContentSearchButtonProps) {
  const metadata = useNativeField({ disabled });
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={open}
      disabled={metadata.blocked}
      onClick={(event) => {
        event.currentTarget.focus();
        onOpenChange(!open);
      }}
    >
      <SearchIcon aria-hidden />
    </Button>
  );
}
