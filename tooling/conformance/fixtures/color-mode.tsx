import { atom, useAtom } from 'jotai';
import {
  ColorModeAvatar,
  ColorModeButton,
  ColorModeImage,
  ColorModeSelect,
  ColorModeSwitch,
  App,
  darkTemplateVariants,
  HStack,
  Input,
  Text,
  Theme,
  Toggle,
  useColorMode,
  useDesignTemplate,
  useSystemColorMode,
  VStack,
  templates,
} from '@fastsprout/reacd';

const draftAtom = atom('A draft survives palette changes.');
const readOnlyAtom = atom(false);
const rtlAtom = atom(false);
const LIGHT_SOURCE = '/color-mode-light.svg';
const DARK_SOURCE = '/color-mode-dark.svg';

export function ColorModeExample() {
  const system = useSystemColorMode('light');
  const { value, resolvedMode, setValue } = useColorMode(system);
  const [profile] = useDesignTemplate();
  const [draft, setDraft] = useAtom(draftAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const key = profile === 'erp-compact' ? 'erp-compact' : 'saas-modern-light';
  const template = resolvedMode === 'dark' ? darkTemplateVariants[key] : templates[key];
  return (
    <App direction={rtl ? 'rtl' : 'ltr'}>
      <Theme template={template}>
        <VStack>
          <HStack>
            <ColorModeButton
              label="Dark appearance button"
              value={value}
              resolvedMode={resolvedMode}
              onValueChange={setValue}
              readOnly={readOnly}
            />
            <ColorModeSwitch
              label="Dark appearance switch"
              value={value}
              resolvedMode={resolvedMode}
              onValueChange={setValue}
              readOnly={readOnly}
            />
          </HStack>
          <ColorModeSelect
            label="Color preference"
            description="System follows your device; explicit choices stay local."
            value={value}
            resolvedMode={resolvedMode}
            onValueChange={setValue}
            readOnly={readOnly}
          />
          <ColorModeAvatar
            name="Reacd illustration avatar"
            mode={resolvedMode}
            light={LIGHT_SOURCE}
            dark={DARK_SOURCE}
          />
          <ColorModeImage
            alt="Illustrated workspace preview"
            mode={resolvedMode}
            light={LIGHT_SOURCE}
            dark={DARK_SOURCE}
          />
          <Input label="Palette draft" value={draft} onValueChange={setDraft} />
          <Toggle
            label="Read-only appearance"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Right to left appearance"
            checked={rtl}
            onCheckedChange={setRtl}
          />
          <Text>{`Color preference: ${value}; resolved: ${resolvedMode}`}</Text>
        </VStack>
      </Theme>
    </App>
  );
}
