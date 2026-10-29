import { atom, useAtom } from 'jotai';
import { App, LocaleSelect, Text, Toggle, VStack } from 'reacd';

const localeAtom = atom('en-US');
const readOnlyAtom = atom(false);
const disabledAtom = atom(false);
const LOCALES = [
  { code: 'en-US', label: 'English (United States)' },
  { code: 'pl-PL', label: 'Polish (Poland)' },
  { code: 'ar', label: 'Arabic' },
];

export function LocaleSelectExample() {
  const [locale, setLocale] = useAtom(localeAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  return (
    <App language={locale} direction={locale === 'ar' ? 'rtl' : 'ltr'}>
      <VStack>
        <LocaleSelect
          label="Application language"
          description="The host controls language resources and direction."
          value={locale}
          locales={LOCALES}
          onValueChange={setLocale}
          name="locale"
          readOnly={readOnly}
          disabled={disabled}
        />
        <Toggle
          label="Read-only language"
          checked={readOnly}
          onCheckedChange={setReadOnly}
        />
        <Toggle
          label="Disable language"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Text>{`Selected locale: ${locale}`}</Text>
      </VStack>
    </App>
  );
}
