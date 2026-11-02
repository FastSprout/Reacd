import type { LinkProps } from
  '@fastsprout/reacd/adapter-runtime/components/link/link.props.js';
import { Button } from '../vendor/ui/button.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';

export type ShadcnLinkProps = LinkProps;
export function ShadcnLink({ label, href, active, disabled, newWindow }: LinkProps) {
  const opensWindow = !disabled && newWindow;
  return (
    <Button
      asChild
      variant="link"
      disabled={disabled}
      className="min-w-0 max-w-full whitespace-normal break-words"
      style={{
        height: 'auto',
        minBlockSize: LAYOUT_POLICY.controlTargetPx,
        overflowWrap: 'anywhere',
      }}
    >
      <a
        role="link"
        href={disabled ? undefined : href}
        aria-disabled={disabled}
        aria-current={active ? 'page' : undefined}
        target={opensWindow ? '_blank' : undefined}
        rel={opensWindow ? 'noopener noreferrer' : undefined}
      >
        {label}
      </a>
    </Button>
  );
}
