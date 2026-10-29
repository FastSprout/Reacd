import type { NavigationProps } from '../../../components/navigation/navigation.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnNavigation({
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
