import { Fragment, useId, useRef } from 'react';
import type { z } from 'zod';
import { useDirection } from '@base-ui/react/direction-provider';
import type { splitterSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/splitter/splitter.schema.js';
import {
  SPLITTER_DEFAULTS,
  SPLITTER_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/splitter-policy.js';
import { pairBounds } from '@fastsprout/reacd/adapter-runtime/core/splitter.js';
import { useSplitterReflow } from
  '@fastsprout/reacd/adapter-runtime/renderer/splitter/use-splitter-reflow.js';
import { useSplitterDrag } from
  '@fastsprout/reacd/adapter-runtime/renderer/splitter/use-splitter-drag.js';
import { splitterKey } from
  '@fastsprout/reacd/adapter-runtime/renderer/splitter/splitter-key.js';

export function ShadcnSplitter({
  label,
  panels,
  value,
  onValueChange,
  orientation = SPLITTER_DEFAULTS.orientation,
  disabled = SPLITTER_DEFAULTS.disabled,
}: z.output<typeof splitterSchema>) {
  const reference = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const id = useId();
  const expanded = useRef(new Map<string, number>());
  const direction = useDirection();
  const narrow = useSplitterReflow(reference, track, panels.length);
  const reflow = orientation === 'horizontal' && narrow;
  const inert = disabled || reflow;
  const drag = useSplitterDrag({
    reference,
    panels,
    value,
    orientation,
    direction,
    onValueChange,
    disabled: inert,
  });
  return (
    <div
      ref={reference}
      role="group"
      aria-label={label}
      className="reacd-node reacd-splitter"
      data-orientation={orientation}
      data-reflow={reflow}
      data-dragging={drag.dragging}
      data-direction={direction}
    >
      <span ref={track} aria-hidden="true" className="reacd-splitter-track" />
      {panels.map((panel, index) => {
        const current = value[index];
        const next = panels[index + 1];
        const bounds = pairBounds(panels, value, index);
        return (
          <Fragment key={panel.id}>
            <section
              id={`${id}-${panel.id}`}
              aria-label={panel.label}
              hidden={current?.share === SPLITTER_POLICY.zero}
              className="reacd-splitter-panel"
              style={{ flexGrow: current?.share }}
            >
              {panel.content}
            </section>
            {next && bounds && current && (
              <div
                role="separator"
                aria-label={panel.label}
                aria-controls={`${id}-${panel.id} ${id}-${next.id}`}
                aria-orientation={
                  orientation === 'horizontal' ? 'vertical' : 'horizontal'
                }
                aria-valuemin={panel.collapsedShare ?? bounds.min}
                aria-valuemax={bounds.max}
                aria-valuenow={current.share}
                aria-disabled={inert}
                tabIndex={inert ? -1 : 0}
                className="reacd-splitter-handle"
                hidden={reflow}
                onKeyDown={(event) => {
                  if (inert) return;
                  const result = splitterKey({
                    key: event.key,
                    shift: event.shiftKey,
                    index,
                    panels,
                    value,
                    orientation,
                    direction,
                    expanded: expanded.current,
                  });
                  if (result) {
                    event.preventDefault();
                    onValueChange(result);
                  }
                }}
                onPointerDown={(event) => drag.start(event, index)}
                onPointerMove={drag.move}
                onPointerUp={drag.finish}
                onPointerCancel={drag.cancel}
                onLostPointerCapture={drag.cancel}
                onBlur={drag.cancel}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
