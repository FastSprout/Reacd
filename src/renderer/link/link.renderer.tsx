import type { LinkProps } from '../../components/link/link.js';

export function LinkSurface({ label, href, active, disabled, newWindow }: LinkProps) {
  return (
    <a
      className="reacd-node reacd-link"
      href={disabled ? undefined : href}
      role={disabled ? 'link' : undefined}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      target={newWindow && !disabled ? '_blank' : undefined}
      rel={newWindow && !disabled ? 'noopener noreferrer' : undefined}
    >
      {label}
    </a>
  );
}
