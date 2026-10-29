import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import {
  commandPaletteSchema,
} from '../../../schema/command-palette/command-palette.schema.js';
import { ShadcnCommandPalette } from '../command-palette/command-palette.adapter.js';
export const commandPaletteEntries = {
  CommandPalette: renderEntry(
    'CommandPalette',
    commandPaletteSchema,
    ShadcnCommandPalette,
  ),
};
