import { LocaleSelect } from '../../../components/locale-select/index.js';

export const LOCALE_EXAMPLES = {
  LocaleSelect: (
    <LocaleSelect
      label="Language example"
      value="en-US"
      locales={[{ code: 'en-US', label: 'English' }]}
      onValueChange={() => undefined}
    />
  ),
};
