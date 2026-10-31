import { useId, useRef, useState } from 'react';
import { useDirection } from '@radix-ui/react-direction';
import type { StepperProps } from
  '@fastsprout/reacd/adapter-runtime/components/stepper/index.js';
import { NAVIGATION_COMPOSITION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/navigation-composition-policy.js';
import {
  reachableStepKeys,
  stepFocusTarget,
} from '@fastsprout/reacd/adapter-runtime/core/stepper-navigation.js';
import { Button } from '../primitives/button.js';

export function SharedStepper({
  label,
  items,
  value,
  onValueChange,
  disabled,
  linear = NAVIGATION_COMPOSITION_DEFAULTS.linear,
  orientation = NAVIGATION_COMPOSITION_DEFAULTS.orientation,
}: StepperProps) {
  const id = useId();
  const direction = useDirection();
  const targets = useRef(new Map<string, HTMLButtonElement>());
  const [focused, setFocused] = useState(value);
  const reachable = reachableStepKeys(items, value, linear);
  const focusKey = reachable.includes(focused) ? focused : value;
  const active = items.findIndex((item) => item.key === value);
  return (
    <section
      className="reacd-node reacd-stepper"
      aria-label={label}
      data-orientation={orientation}
    >
      <ol className="reacd-stepper-list">
        {items.map((item, index) => (
          <li key={item.key} data-complete={index < active}>
            <Button
              type="button"
              variant={item.key === value ? 'secondary' : 'ghost'}
              className="reacd-node reacd-button reacd-step-trigger"
              id={`${id}-step-${index}`}
              aria-current={item.key === value ? 'step' : undefined}
              aria-controls={`${id}-content`}
              disabled={disabled || !reachable.includes(item.key)}
              tabIndex={!disabled && item.key === focusKey ? 0 : -1}
              ref={(element) => {
                if (element === null) targets.current.delete(item.key);
                else targets.current.set(item.key, element);
              }}
              onFocus={() => setFocused(item.key)}
              onClick={() => {
                if (item.key !== value) onValueChange(item.key);
              }}
              onKeyDown={(event) => {
                const key = stepFocusTarget(
                  reachable,
                  item.key,
                  event.key,
                  orientation,
                  direction,
                );
                if (key !== undefined) {
                  event.preventDefault();
                  targets.current.get(key)?.focus();
                }
              }}
            >
              <span className="reacd-step-indicator" aria-hidden="true">
                {index + 1}
              </span>
              <span className="reacd-step-copy">
                <span>{item.title}</span>
                {item.description !== undefined && (
                  <span className="reacd-step-description">{item.description}</span>
                )}
              </span>
            </Button>
          </li>
        ))}
      </ol>
      <div
        className="reacd-step-content"
        role="region"
        id={`${id}-content`}
        aria-labelledby={`${id}-step-${active}`}
      >
        {items[active]?.content}
      </div>
    </section>
  );
}
