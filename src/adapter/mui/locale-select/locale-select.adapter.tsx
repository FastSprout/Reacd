import type { LocaleSelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/locale-select/locale-select.props.js';
import { MuiSelect } from '../select/select.adapter.js';

export type MuiLocaleSelectProps = LocaleSelectProps;

export function MuiLocaleSelect({ locales, ...props }: MuiLocaleSelectProps) {
  return (
    <MuiSelect
      {...props}
      items={locales.map(({ code, label }) => ({ value: code, label }))}
    />
  );
}
