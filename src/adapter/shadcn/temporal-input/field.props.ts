import type { Ref, RefCallback } from 'react';

import type { DateFieldRenderProps } from 'react-aria-components';

interface TemporalFieldProperties {
  readonly label: string;
  readonly value: string | null;
  readonly onValueChange: (value: string | null) => void;
  readonly min?: string | undefined;
  readonly max?: string | undefined;
  readonly locale?: string | undefined;
  readonly name?: string | undefined;
  readonly required?: boolean | undefined;
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
  readonly description?: string | undefined;
  readonly peer?: string | null | undefined;
  readonly endpoint?: 'start' | 'end' | undefined;
  readonly inputRef?: RefCallback<HTMLElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly stateRef?: Ref<DateFieldRenderProps['state']> | undefined;
  readonly validationError?: string | undefined;
}

export type TemporalFieldProps = TemporalFieldProperties &
  (
    | { readonly kind: 'date'; readonly referenceDate: string }
    | { readonly kind: 'time'; readonly referenceDate?: string | undefined }
  );
