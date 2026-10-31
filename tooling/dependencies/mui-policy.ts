export const MUI_DECLARATION_POLICY = {
  version: '9.5.0',
  files: ['types.d.mts', 'types.d.ts'],
  originalHash: 'f50575b0f86abe96639d451557adcc7d8768ec7e3de930b47e063e3fcf81ad22',
  patchedHash: 'c931057cca91c89514bb49e2c134086c059ea2e9789f5ca39b211e7217dc5891',
  before: [
    'export interface EasingProps {',
    '  easing: string | {',
    '    enter?: string | undefined;',
    '    exit?: string | undefined;',
    '  };',
    '}',
  ].join('\n'),
  after: [
    'export interface EasingProps {',
    '  easing: string | {',
    '    enter?: string | undefined;',
    '    exit?: string | undefined;',
    '  } | undefined;',
    '}',
  ].join('\n'),
} as const;
