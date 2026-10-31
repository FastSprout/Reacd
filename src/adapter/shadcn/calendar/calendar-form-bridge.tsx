import type { RefObject } from 'react';
import type { CalendarProps } from
  '@fastsprout/reacd/adapter-runtime/components/calendar/index.js';

export function CalendarFormBridge({
  properties,
  region,
}: {
  properties: CalendarProps;
  region: RefObject<HTMLDivElement | null>;
}) {
  const { name, disabled, required } = properties;
  const complete =
    properties.mode === 'range'
      ? properties.value.start !== null && properties.value.end !== null
      : properties.value !== null;
  return (
    <>
      {properties.mode === 'range' ? (
        <>
          <input
            type="hidden"
            name={name === undefined ? undefined : `${name}.start`}
            value={properties.value.start ?? ''}
            disabled={disabled}
          />
          <input
            type="hidden"
            name={name === undefined ? undefined : `${name}.end`}
            value={properties.value.end ?? ''}
            disabled={disabled}
          />
        </>
      ) : (
        <input
          type="hidden"
          name={name}
          value={properties.value ?? ''}
          disabled={disabled}
        />
      )}
      <input
        key={String(complete)}
        className="reacd-calendar-validation"
        tabIndex={-1}
        aria-hidden="true"
        defaultValue={complete ? 'selected' : ''}
        required={required}
        disabled={disabled}
        onInvalid={(event) => {
          event.preventDefault();
          region.current?.focus();
        }}
      />
    </>
  );
}
