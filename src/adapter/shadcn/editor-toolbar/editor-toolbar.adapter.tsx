import { useContext } from 'react';
import { Toolbar } from '@base-ui/react/toolbar';
import type {
  EditorToolbarProps,
  EditorToolbarItem,
} from '../../../components/editor-toolbar/index.js';
import type {
  EditorCommand,
  EditorCommandType,
} from '../../../core/editor-commands.js';
import {
  EDITOR_COMMAND_LABELS,
  EDITOR_DEFAULT_COMMANDS,
} from '../../../core/editor-commands.js';
import {
  EDITOR_BEHAVIOR,
  EDITOR_DEFAULTS,
  EDITOR_ERRORS,
} from '../../../core/editor-policy.js';
import { EditorScopeContext } from '../../../renderer/editor/editor-context.js';
import { Issues } from '../../../renderer/issues/issues.renderer.js';
import { Button } from '../vendor/ui/button.js';

const DEFAULT_ITEMS: readonly EditorToolbarItem[] = EDITOR_DEFAULT_COMMANDS.map(
  (command) => ({ command }),
);
const ACTIONS: ReadonlySet<EditorCommandType> = new Set([
  'undo',
  'redo',
  'separator',
  'removeLink',
]);

function commandValue(item: EditorToolbarItem): EditorCommand {
  return item.command === 'link'
    ? { command: 'link', href: item.href }
    : { command: item.command };
}

export function ShadcnEditorToolbar({
  label = EDITOR_DEFAULTS.toolbarLabel,
  items = DEFAULT_ITEMS,
  disabled,
}: EditorToolbarProps) {
  const port = useContext(EditorScopeContext);
  if (port === null)
    return (
      <Issues
        issues={[
          {
            path: 'EditorToolbar',
            message: EDITOR_ERRORS.toolbarScope,
          },
        ]}
      />
    );
  return (
    <Toolbar.Root
      className="reacd-node reacd-editor-toolbar"
      aria-label={label}
      disabled={disabled === true || port.disabled}
      loopFocus={EDITOR_BEHAVIOR.loopToolbarFocus}
    >
      {items.map((item) => {
        const command = commandValue(item);
        const active = port.active(command);
        return (
          <Toolbar.Button
            key={item.command}
            type="button"
            aria-label={item.label ?? EDITOR_COMMAND_LABELS[item.command]}
            aria-pressed={ACTIONS.has(item.command) ? undefined : active}
            disabled={
              disabled === true ||
              port.disabled ||
              item.disabled === true ||
              !port.available(command)
            }
            focusableWhenDisabled={EDITOR_BEHAVIOR.toolbarDisabledFocusable}
            render={
              <Button
                className="reacd-button"
                variant={active ? 'default' : 'outline'}
              />
            }
            onClick={() => port.execute(command)}
          >
            {item.label ?? EDITOR_COMMAND_LABELS[item.command]}
          </Toolbar.Button>
        );
      })}
    </Toolbar.Root>
  );
}
