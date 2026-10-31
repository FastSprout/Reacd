import type { BreadcrumbProps } from
  '@fastsprout/reacd/adapter-runtime/components/breadcrumb/breadcrumb.js';
import { BREADCRUMB_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/breadcrumb-policy.js';
import { Button } from '../primitives/button.js';
import { useDirection } from '@radix-ui/react-direction';

export function SharedBreadcrumb({
  label,
  items,
  separator = BREADCRUMB_DEFAULTS.separator,
}: BreadcrumbProps) {
  const direction = useDirection();
  return (
    <nav
      className="reacd-node reacd-breadcrumb"
      aria-label={label}
      data-slot="breadcrumb"
      data-separator={separator}
      data-direction={direction}
    >
      <ol className="reacd-breadcrumb-list" data-slot="breadcrumb-list">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          const activePage = current ? 'page' : undefined;
          return (
            <li className="reacd-breadcrumb-item" key={item.key}>
              {index > 0 && (
                <span aria-hidden="true" className="reacd-breadcrumb-separator">
                  {separator === 'slash' ? '/' : '›'}
                </span>
              )}
              {item.onPress !== undefined ? (
                <Button
                  type="button"
                  variant="link"
                  className="reacd-node reacd-button reacd-breadcrumb-action"
                  onClick={pressHandler(item.onPress)}
                  disabled={item.disabled}
                  aria-current={activePage}
                >
                  {item.label}
                </Button>
              ) : item.href !== undefined && !item.disabled ? (
                <a
                  className="reacd-node reacd-link"
                  href={item.href}
                  aria-current={activePage}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className="reacd-breadcrumb-label"
                  aria-current={activePage}
                  aria-disabled={item.disabled || undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
import { pressHandler } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/press-handler.js';
