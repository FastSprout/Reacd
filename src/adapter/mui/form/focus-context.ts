import { createContext } from 'react';

export interface MaterialFormFocusMetadata {
  readonly register: (id: string, focus: () => void) => () => void;
}

export const MuiFormFocusContext = createContext<MaterialFormFocusMetadata | null>(
  null,
);
