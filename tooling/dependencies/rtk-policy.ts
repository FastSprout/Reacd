export const RTK_DECLARATION_POLICY = {
  version: '2.13.0',
  files: ['dist/index.d.ts', 'dist/index.d.mts'],
  originalHash: '4ebd4061b84c620b21e519842bab9f1a42b3c48e17ba7742ee172492e81a518d',
  patchedHash: '48ad2a80e59d7e4f807ec1c2b735a684be620e1d873c27266cfcca390745315b',
  edits: [
    {
      before: [
        'interface SerializedError {',
        '  name?: string;',
        '  message?: string;',
        '  stack?: string;',
        '  code?: string;',
        '}',
      ].join('\n'),
      after: [
        'interface SerializedError {',
        '  name?: string;',
        '  message?: string;',
        '  stack?: string;',
        '  code?: string | undefined;',
        '}',
      ].join('\n'),
    },
    {
      before: '  dispatch?: ThunkDispatch$1<unknown, unknown, UnknownAction>;',
      after: '  dispatch?: ThunkDispatch$1<unknown, unknown, UnknownAction>' +
        ' | undefined;',
    },
    {
      before: [
        'type PreventCircular<ThunkApiConfig> = { [K in keyof ThunkApiConfig]: ',
        "K extends 'state' | 'dispatch' ? never : ThunkApiConfig[K]; };",
      ].join(''),
      after: [
        'type PreventCircular<ThunkApiConfig> = { [K in keyof ThunkApiConfig]: ',
        "K extends 'state' | 'dispatch' ? undefined : ThunkApiConfig[K]; };",
      ].join(''),
    },
  ],
} as const;
