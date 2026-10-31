import type { NavigationProps } from
  '@fastsprout/reacd/adapter-runtime/components/navigation/navigation.js';
import { Button } from '../primitives/button.js';

export function SharedNavigation({
  label,
  value,
  items,
  onValueChange,
}: NavigationProps) {
  return (
    <nav className="reacd-node reacd-navigation" aria-label={label}>
      {items.map((item) => (
        <Button
          type="button"
          className="reacd-node reacd-button"
          key={item.value}
          aria-current={item.value === value ? 'page' : undefined}
          variant={item.value === value ? 'secondary' : 'ghost'}
          onClick={() => onValueChange(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
