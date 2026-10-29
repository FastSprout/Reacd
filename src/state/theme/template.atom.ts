import { atom } from 'jotai';
import { DESIGN_POLICY } from '../../core/policy.js';

export const templateAtom = atom<string>(DESIGN_POLICY.defaultTemplate);
