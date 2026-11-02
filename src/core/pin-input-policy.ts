export const PIN_INPUT_TYPES = ['numeric', 'alphanumeric'] as const;
export const PIN_INPUT_POLICY = {
  minLength: 1,
  maxLength: 12,
  length: 6,
  inputType: 'numeric',
  maskCharacter: '•',
  placeholder: '○',
  separator: '–',
  formatLabel: 'Code format',
  numericPattern: '^[0-9]*$',
  alphanumericPattern: '^[a-zA-Z0-9]*$',
  incompleteMessage: 'Enter the complete code.',
} as const;
