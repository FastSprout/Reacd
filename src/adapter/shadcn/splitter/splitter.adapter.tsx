import { Fragment, useContext, useId } from 'react';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import type { BoundaryDefinition } from '../dashboard-group/handle-context.js';
import type { SplitterProps } from
  '@fastsprout/reacd/adapter-runtime/components/splitter/index.js';
import {
  SPLITTER_DEFAULTS,
  SPLITTER_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/splitter-policy.js';
import { CardContent } from '../vendor/ui/card.js';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../vendor/ui/resizable.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { usePageWidth } from '../page/use-page-width.js';
import { useControlledLayout } from './use-controlled-layout.js';
import { sdkLayout } from './layout.js';

export type ShadcnSplitterProps = SplitterProps & {
  readonly narrow?: boolean;
  readonly resizeLabel?: string | undefined;
  readonly boundaryDefinitions?: ReadonlyMap<string, readonly BoundaryDefinition[]>;
};
export function ShadcnSplitter({
  narrow: override,
  boundaryDefinitions,
  resizeLabel,
  ...properties
}: ShadcnSplitterProps) {
  const {
    label,
    panels,
    value,
    orientation = SPLITTER_DEFAULTS.orientation,
    disabled,
  } = properties;
  const prefix = useId();
  const active = useContext(PortalActiveContext);
  const metadata = useNativeField({ disabled });
  const { setElement, measured, widthRem } = usePageWidth();
  const narrow =
    override ??
    (measured &&
      orientation === 'horizontal' &&
      widthRem < panels.length * SPLITTER_POLICY.panelTrackRem);
  const blocked = metadata.blocked || narrow;
  const control = useControlledLayout(prefix, properties, blocked);
  return (
    <CardContent ref={setElement} className="min-w-0 p-0">
      {narrow ? (
        <CardContent
          role="group"
          aria-label={label}
          className="flex min-w-0 flex-col gap-4 p-0"
        >
          {panels.map((panel) => (
            <CardContent
              key={panel.id}
              role="region"
              aria-label={panel.label}
              className="min-w-0 p-0"
              style={{ overflowWrap: 'anywhere' }}
            >
              {panel.content}
            </CardContent>
          ))}
        </CardContent>
      ) : (
        <ResizablePanelGroup
          {...control}
          role="group"
          aria-label={label}
          orientation={orientation}
          disabled={blocked}
          defaultLayout={sdkLayout(prefix, value)}
          style={{
            height:
              orientation === 'vertical'
                ? `${SPLITTER_POLICY.verticalExtentRem}rem`
                : 'auto',
            overflow: 'visible',
          }}
        >
          {panels.map((panel, index) => {
            const collapsed =
              panel.collapsedShare !== undefined &&
              value[index]?.share === panel.collapsedShare;
            return (
              <Fragment key={panel.id}>
                <ResizablePanel
                  id={`${prefix}-${panel.id}`}
                  minSize={`${panel.minShare ?? SPLITTER_POLICY.minShare}%`}
                  maxSize={`${panel.maxShare ?? SPLITTER_POLICY.maxShare}%`}
                  collapsible={panel.collapsedShare !== undefined}
                  collapsedSize={
                    panel.collapsedShare === undefined
                      ? undefined
                      : `${panel.collapsedShare}%`
                  }
                  inert={collapsed}
                >
                  <PortalActiveContext value={active && !collapsed}>
                    <CardContent
                      role="region"
                      aria-label={panel.label}
                      className="min-w-0 p-0"
                      style={{ overflowWrap: 'anywhere' }}
                    >
                      {panel.content}
                    </CardContent>
                  </PortalActiveContext>
                </ResizablePanel>
                {index < panels.length - 1 && (
                  <ResizableHandle
                    withHandle
                    aria-label={
                      boundaryDefinitions?.get(panel.id)?.[0]?.label ??
                      resizeLabel ??
                      `${panel.label} / ${panels[index + 1]?.label}`
                    }
                    disabled={
                      blocked ||
                      boundaryDefinitions?.get(panel.id)?.[0]?.disabled ||
                      (boundaryDefinitions?.get(panel.id)?.length ?? 0) > 1
                    }
                  />
                )}
              </Fragment>
            );
          })}
        </ResizablePanelGroup>
      )}
    </CardContent>
  );
}
