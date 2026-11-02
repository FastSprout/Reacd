import { useContext } from 'react';
import type { CollapsibleProps } from
  '@fastsprout/reacd/adapter-runtime/components/collapsible/collapsible.props.js';
import { COLLAPSIBLE_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/collapsible-policy.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { requestNativeChange } from '../form-field/request-native-change.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { LAYOUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/policy.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../vendor/ui/collapsible.js';

export function ShadcnCollapsible(props: CollapsibleProps) {
  const active = useContext(PortalActiveContext);
  const field = useNativeField(props);
  const retained = props.retainContent ?? COLLAPSIBLE_DEFAULTS.retainContent;
  return (
    <Collapsible
      open={props.open}
      disabled={field.blocked}
      onOpenChange={(open) =>
        requestNativeChange(field.blocked, () => props.onOpenChange(open))
      }
    >
      {(props.showTrigger ?? COLLAPSIBLE_DEFAULTS.showTrigger) && (
        <CollapsibleTrigger asChild>
          <Button type="button" variant="outline"
            className={WRAPPING_BUTTON_CLASSES}
            style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}>
            {props.label}
          </Button>
        </CollapsibleTrigger>
      )}
      <CollapsibleContent
        forceMount={retained ? true : undefined}
        hidden={retained && !props.open}
        role="region"
        aria-label={props.label}
      >
        <PortalActiveContext value={active && props.open}>
          {props.children}
        </PortalActiveContext>
      </CollapsibleContent>
    </Collapsible>
  );
}
