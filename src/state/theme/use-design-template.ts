import { useAtom } from 'jotai';
import { templateAtom } from './template.atom.js';

export function useDesignTemplate() {
  return useAtom(templateAtom);
}
