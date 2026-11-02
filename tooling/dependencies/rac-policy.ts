export const RAC_DECLARATION_POLICY = {
  version: '1.22.1',
  files: [
    {
      name: 'dist/types/src/Group.d.ts',
      originalHash: 'fadcd569f1365cf57b1b73f67ec942f68ecfe5011ad2a363d5893a3187f5e87b',
      patchedHash: '0eda597a34cb7c2eedd84b19a4c40e461bb6d281b24908360e19e1aad159a856',
      before: "'role' | 'slot'>",
      after: "'role' | 'slot' | keyof AriaLabelingProps | keyof DOMProps>",
    },
    {
      name: 'dist/types/src/OverlayArrow.d.ts',
      originalHash: '5d9693f910f7bba52615c22427cf7d419e99d7ec03618e71c9df2d2cf55bf1c7',
      patchedHash: 'ee1bafa19a9b6b8839e430583e6cff652835cb672e36fef48a36211ebac55ee9',
      before: "'render' | 'children'>",
      after: "'render' | 'children' | keyof DOMProps>",
    },
  ],
} as const;
