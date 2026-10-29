import type { ReactNode } from 'react';
import type { CommandPaletteProps } from './command-palette.props.js';
import {
  commandPaletteSchema,
} from '../../schema/command-palette/command-palette.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { CommandPaletteProps } from './command-palette.props.js';
export function CommandPalette(props: CommandPaletteProps): ReactNode {
  return useDeclaration('CommandPalette', commandPaletteSchema, props);
}
