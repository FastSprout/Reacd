import type { LocaleSelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/locale-select/locale-select.props.js';
import { ShadcnSelect } from '../select/select.adapter.js';

export type ShadcnLocaleSelectProps = LocaleSelectProps;

export function ShadcnLocaleSelect({ locales, ...props }: ShadcnLocaleSelectProps) {
  return (
    <ShadcnSelect
      {...props}
      items={locales.map(({ code, label }) => ({ value: code, label }))}
    />
  );
}
