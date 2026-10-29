export const ACTION_MENU_POLICY = {
  maximumItems: 64,
  maximumSubmenuItems: 64,
  maximumTotalItems: 256,
  maximumRadioOptions: 32,
  minimumRadioOptions: 1,
  minimumSubmenuItems: 1,
  widthRem: 18,
  maximumBlockViewportPercent: 85,
  offsetPx: 4,
  collisionPaddingPx: 8,
  indicatorWidthEm: 1.25,
} as const;
export const ACTION_MENU_DEFAULTS = {
  closeAction: true,
  closeChoice: false,
  modal: false,
  rejectedResult: 'The menu change was rejected.',
  invalidRadioValue: 'The radio value is not declared.',
  invalidResult: 'Menu callbacks must return a boolean or no value.',
} as const;
export const ACTION_MENU_INTENTS = ['neutral', 'danger'] as const;

export function menuDecision(value: unknown): 'accept' | 'veto' | 'invalid' {
  if (value === false) return 'veto';
  return value === undefined || value === true ? 'accept' : 'invalid';
}

export function invokeMenuRadio(
  item: {
    options: readonly { value: string }[];
    onValueChange: (value: string) => boolean | void;
  },
  value: unknown,
): unknown {
  if (
    typeof value !== 'string' ||
    !item.options.some((option) => option.value === value)
  ) {
    return ACTION_MENU_DEFAULTS.invalidRadioValue;
  }
  return item.onValueChange(value);
}
