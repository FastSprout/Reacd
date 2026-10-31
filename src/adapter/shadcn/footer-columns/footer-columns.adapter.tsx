import { useId } from 'react';
import type { FooterColumnsProps } from
  '@fastsprout/reacd/adapter-runtime/components/footer-columns/index.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnFooterColumns({
  label,
  columns,
  left,
  right,
}: FooterColumnsProps) {
  const id = useId();
  return (
    <nav className="reacd-node reacd-footer-columns" aria-label={label}>
      {left !== undefined && <div className="reacd-footer-slot">{left}</div>}
      <div className="reacd-footer-column-groups">
        {columns.map((column, index) => (
          <section className="reacd-footer-column" key={column.key}>
            <h3 id={`${id}-${index}`} className="reacd-footer-column-label">
              {column.label}
            </h3>
            <ul aria-labelledby={`${id}-${index}`}>
              {column.children.map((item) => (
                <li key={item.key}>
                  {item.onPress !== undefined ? (
                    <Button
                      type="button"
                      variant="link"
                      className="reacd-node reacd-button reacd-navigation-target"
                      disabled={item.disabled}
                      onClick={pressHandler(item.onPress)}
                    >
                      {item.label}
                    </Button>
                  ) : item.href !== undefined && !item.disabled ? (
                    <a
                      className="reacd-node reacd-link reacd-navigation-target"
                      href={item.href}
                      aria-current={item.active ? 'page' : undefined}
                      target={item.newWindow ? '_blank' : undefined}
                      rel={item.newWindow ? 'noopener noreferrer' : undefined}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span aria-disabled={item.disabled || undefined}>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {right !== undefined && <div className="reacd-footer-slot">{right}</div>}
    </nav>
  );
}
import { pressHandler } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/press-handler.js';
