import { useImperativeHandle } from 'react';
import {
  DateInput,
  DateSegment,
  Label,
  Text,
  FieldError,
  useLocale,
} from 'react-aria-components';
import type { DateFieldRenderProps } from 'react-aria-components';
import { InputGroup } from '../vendor/ui/base-input-group.js';
import { Button } from '../vendor/ui/button.js';
import { FieldError as NativeFieldError } from '../vendor/ui/field.js';
import { INPUT_DATE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-date-policy.js';
import type { TemporalFieldProps } from './field.props.js';

export function TemporalContents({
  state,
  props,
  blocked,
}: {
  readonly state: DateFieldRenderProps['state'];
  readonly props: TemporalFieldProps;
  readonly blocked: boolean;
}) {
  useImperativeHandle(props.stateRef, () => state, [state]);
  const { direction } = useLocale();
  const focus =
    state.segments.find(
      (segment) => segment.type !== 'literal' && segment.isPlaceholder,
    ) ?? state.segments.find((segment) => segment.type !== 'literal');
  return (
    <>
      <Label className="text-sm font-medium">{props.label}</Label>
      <InputGroup className="h-auto min-w-0 flex-wrap">
        <DateInput
          dir={direction}
          className="flex min-w-0 flex-1 flex-wrap px-3 py-2 tabular-nums"
        >
          {(segment) => (
            <DateSegment
              segment={segment}
              ref={segment.type === focus?.type ? props.inputRef : undefined}
              className="rounded-sm outline-none data-focused:bg-accent"
            />
          )}
        </DateInput>
        <Button
          type="button"
          variant="ghost"
          disabled={blocked}
          aria-label={`${INPUT_DATE_POLICY.clearLabel} ${props.label}`}
          onClick={() => state.setValue(null)}
        >
          {INPUT_DATE_POLICY.clearLabel}
        </Button>
      </InputGroup>
      {props.description && (
        <Text slot="description" className="text-muted-foreground">
          {props.description}
        </Text>
      )}
      <FieldError elementType="div">
        {({ validationErrors }) => (
          <NativeFieldError>
            {props.validationError || validationErrors.join(' ')}
          </NativeFieldError>
        )}
      </FieldError>
    </>
  );
}
