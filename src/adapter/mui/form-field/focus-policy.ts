export const MATERIAL_FIELD_FOCUS_POLICY = {
  controls: [
    'input',
    'select',
    'textarea',
    'button',
    'div[role="combobox"]',
    'span[role="combobox"]',
    'div[role="slider"]',
    'span[role="slider"]',
    'div[role="spinbutton"]',
    'span[role="spinbutton"]',
  ].join(','),
  excluded: '[hidden],[inert],[aria-hidden="true"]',
  disabled: ':disabled,[aria-disabled="true"]',
} as const;
