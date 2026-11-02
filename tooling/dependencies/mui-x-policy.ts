const localeCorrection = {
  before: 'localeText?: PickersInputComponentLocaleText;\n}> = Omit',
  after: 'localeText?: PickersInputComponentLocaleText | undefined;\n}> = Omit',
} as const;

export const MUI_X_DECLARATION_POLICY = {
  version: '9.17.0',
  files: [
    {
      ...localeCorrection,
      name: 'locales/utils/pickersLocaleTextApi.d.mts',
      original: '1562ca724fa17fabd74ccb369b6cd314876514e8ab0c71cadd907207c46cac61',
      patched: '9898b718a07c201aee37ba7a9c09526a9ab891d49f6f46e5dd80019810122db2',
    },
    {
      ...localeCorrection,
      name: 'locales/utils/pickersLocaleTextApi.d.ts',
      original: 'fb155d92f2691f2040535263a4728e9483d2178dc4dadbb21d212b556a910312',
      patched: 'fbb783dca33b335cc657135cd728b2adf1c3542393cd419052c97827d2d9823e',
    },
    {
      name: 'DateCalendar/PickersSlideTransition.d.mts',
      before: "'react-transition-group/CSSTransition'",
      after: "'react-transition-group/CSSTransition.js'",
      original: '44f7324142515764eb56b1da852c63e0947d81a825404f7c7f80b6b7e12fe266',
      patched: 'f16762ee4b8d658dbad364ff45a675b934f0f1167953dc009fa1a6bb4fd6a8e3',
    },
  ],
} as const;
