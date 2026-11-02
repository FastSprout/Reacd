import type { ReactNode } from 'react';
import type { PopoverProps } from
  '@fastsprout/reacd/adapter-runtime/components/popover/popover.props.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import {
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from '../vendor/ui/popover.js';

export function ShadcnPopoverBody({
  props,
  host,
  visible,
  titleId,
  descriptionId,
  close,
}: {
  readonly props: PopoverProps;
  readonly host: HTMLElement | null;
  readonly visible: boolean;
  readonly titleId: string;
  readonly descriptionId: string;
  readonly close: ReactNode;
}) {
  return (
    <PortalHostContext value={host}>
      <PortalActiveContext value={visible}>
        <FormScopeContext value={false}>
          <PopoverHeader>
            <PopoverTitle id={titleId}>{props.title}</PopoverTitle>
            {props.description && (
              <PopoverDescription id={descriptionId}>
                {props.description}
              </PopoverDescription>
            )}
          </PopoverHeader>
          {props.children}
          {props.footer}
          {close}
        </FormScopeContext>
      </PortalActiveContext>
    </PortalHostContext>
  );
}
