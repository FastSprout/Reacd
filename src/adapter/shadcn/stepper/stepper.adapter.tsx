import { useId } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { useDirection } from '@radix-ui/react-direction';
import type { StepperProps } from
  '@fastsprout/reacd/adapter-runtime/components/stepper/stepper.props.js';
import { reachableStepKeys } from
  '@fastsprout/reacd/adapter-runtime/core/stepper-navigation.js';
import { NAVIGATION_COMPOSITION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/navigation-composition-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Button } from '../vendor/ui/button.js';
import { CardContent, CardDescription } from '../vendor/ui/card.js';
import { useNativeField } from '../form-field/use-native-field.js';

export function ShadcnStepper({
  label,
  items,
  value,
  onValueChange,
  orientation = NAVIGATION_COMPOSITION_DEFAULTS.orientation,
  linear = NAVIGATION_COMPOSITION_DEFAULTS.linear,
  disabled,
}: StepperProps) {
  const id = useId();
  const direction = useDirection();
  const field = useNativeField({ disabled });
  const reachable = new Set(reachableStepKeys(items, value, linear));
  return (
    <>
      <Toolbar.Root
        aria-label={label}
        orientation={orientation}
        dir={direction}
        loop={false}
        aria-disabled={field.blocked || undefined}
        asChild
      >
        <CardContent
          className={
            orientation === 'vertical'
              ? 'flex min-w-0 flex-col items-start gap-4 p-0'
              : 'flex min-w-0 flex-wrap items-start gap-4 p-0'
          }
        >
          {items.map((item, index) => (
            <CardContent key={item.key} className="grid min-w-0 max-w-full gap-1 p-0">
              <Toolbar.Button
                asChild
                id={`${id}-${item.key}`}
                aria-label={item.title}
                aria-current={item.key === value ? 'step' : undefined}
                aria-controls={`${id}-content`}
                aria-describedby={
                  item.description ? `${id}-${item.key}-hint` : undefined
                }
                disabled={field.blocked || !reachable.has(item.key)}
                onClick={() => onValueChange(item.key)}
                className={
                  'min-w-0 max-w-full whitespace-normal [overflow-wrap:anywhere]'
                }
                style={{ height: 'auto', minBlockSize: LAYOUT_POLICY.controlTargetPx }}
              >
                <Button variant={item.key === value ? 'default' : 'outline'}>
                  <span aria-hidden="true">{index + 1}.</span>
                  {item.title}
                </Button>
              </Toolbar.Button>
              {item.description && (
                <CardDescription id={`${id}-${item.key}-hint`}>
                  {item.description}
                </CardDescription>
              )}
            </CardContent>
          ))}
        </CardContent>
      </Toolbar.Root>
      {items.map(
        (item) =>
          item.key === value && (
            <CardContent
              key={item.key}
              role="region"
              id={`${id}-content`}
              aria-labelledby={`${id}-${item.key}`}
              className="min-w-0 p-0"
            >
              {item.content}
            </CardContent>
          ),
      )}
    </>
  );
}
