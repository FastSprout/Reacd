import { useAtom } from 'jotai';
import { useContext } from 'react';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { resolveColorMode } from '../../core/color-mode.js';
import type { ColorMode, ResolvedColorMode } from '../../core/color-mode-policy.js';
import { colorModeAtom } from './color-mode.atom.js';
import { ApplicationContext } from '../application-context.js';

export interface ColorModeState {
  readonly value: ColorMode;
  readonly resolvedMode: ResolvedColorMode;
  setValue: (value: ColorMode) => void;
}

export function useColorMode(systemMode: ResolvedColorMode): ColorModeState {
  const application = useContext(ApplicationContext);
  const [value, setValue] = useAtom(
    colorModeAtom,
    application === null ? {} : { store: application.store },
  );
  if (application === null) throw new Error(FRAMEWORK_ERRORS.missingProvider);
  return { value, resolvedMode: resolveColorMode(value, systemMode), setValue };
}
