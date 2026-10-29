import type { MouseEvent } from 'react';
import { followHref } from '../navigation/native-navigation.js';
import { CONTENT_OUTLINE_DEFAULTS } from '../../core/content-outline.js';

interface OutlineLinkProps {
  label: string;
  itemKey: string;
  href: string;
  disabled: boolean;
  current: boolean;
  newWindow?: boolean | undefined;
  onCurrentChange?: ((key: string) => boolean | void) | undefined;
  report: (message: string) => void;
}

export function OutlineLink({
  label,
  itemKey,
  href,
  disabled,
  current,
  newWindow,
  onCurrentChange,
  report,
}: OutlineLinkProps) {
  function activate(event: MouseEvent<HTMLAnchorElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      newWindow
    )
      return;
    if (onCurrentChange === undefined) return;
    const target = event.currentTarget.href;
    event.preventDefault();
    const decision: unknown = onCurrentChange(itemKey);
    if (decision !== undefined && typeof decision !== 'boolean') {
      report(CONTENT_OUTLINE_DEFAULTS.invalidSelection);
      return;
    }
    report('');
    if (decision !== false) followHref(target);
  }
  return (
    <a
      className="reacd-content-outline-link"
      role="link"
      href={disabled ? undefined : href}
      target={newWindow ? '_blank' : undefined}
      rel={newWindow ? 'noopener noreferrer' : undefined}
      aria-disabled={disabled || undefined}
      aria-current={current ? 'location' : undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={activate}
    >
      {label}
    </a>
  );
}
