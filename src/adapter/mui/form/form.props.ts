import type { FormProps } from
  '@fastsprout/reacd/adapter-runtime/components/form/form.props.js';

export interface MuiFormProps extends FormProps {
  readonly announcePending?: boolean;
}
