import type { CommandPaletteProps } from
  '@fastsprout/reacd/adapter-runtime/components/command-palette/index.js';
import { followHref } from
  '@fastsprout/reacd/adapter-runtime/renderer/navigation/native-navigation.js';

export type CommandItem = CommandPaletteProps['groups'][number]['items'][number];
export function activateCommand(
  item: CommandItem | null,
  select: CommandPaletteProps['onSelect'],
  blocked: boolean,
): 'accepted' | 'ignored' | 'invalid' {
  if (!item || blocked || item.disabled) return 'ignored';
  const target = item.href;
  const action = item.onPress;
  let result: unknown;
  try {
    result = select?.(item.key);
  } catch {
    return 'invalid';
  }
  if (result === false) return 'ignored';
  if (result !== undefined && typeof result !== 'boolean') {
    void Promise.resolve(result).catch(() => undefined);
    return 'invalid';
  }
  action?.();
  if (target !== undefined) followHref(target);
  return 'accepted';
}
