import type { SelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/select/select.props.js';

export type MultipleSelectProps = Extract<SelectProps, { mode: 'multiple' }> & {
  readonly id: string;
};
