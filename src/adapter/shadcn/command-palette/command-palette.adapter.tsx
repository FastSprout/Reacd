import { useState } from 'react';
import type { CommandPaletteProps } from
  '@fastsprout/reacd/adapter-runtime/components/command-palette/index.js';
import { COMMAND_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/command-policy.js';
import { filterCommandGroups } from
  '@fastsprout/reacd/adapter-runtime/core/command-search.js';
import { followHref } from
  '@fastsprout/reacd/adapter-runtime/renderer/navigation/native-navigation.js';
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '../vendor/ui/command.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Alert, AlertDescription } from '../vendor/ui/alert.js';
import { FieldDescription } from '../vendor/ui/field.js';

export type ShadcnCommandPaletteProps = CommandPaletteProps & {
  readonly onAccepted?: () => void;
};

export function ShadcnCommandPalette(props: ShadcnCommandPaletteProps) {
  const [failure, setFailure] = useState(false);
  const metadata = useNativeField({ disabled: props.disabled });
  const status = props.status ?? COMMAND_DEFAULTS.status;
  const blocked = metadata.blocked || status !== 'ready';
  const groups = filterCommandGroups(
    props.groups,
    props.query,
    props.filtering ?? COMMAND_DEFAULTS.filtering,
  );
  const message =
    status === 'loading'
      ? (props.loadingMessage ?? COMMAND_DEFAULTS.loadingMessage)
      : status === 'error'
        ? (props.errorMessage ?? COMMAND_DEFAULTS.errorMessage)
        : (props.emptyMessage ?? COMMAND_DEFAULTS.emptyMessage);
  return (
    <Command label={props.label} shouldFilter={false}>
      <CommandInput
        aria-label={props.label}
        placeholder={props.label}
        value={props.query}
        onValueChange={(value) => {
          if (!metadata.blocked) {
            setFailure(false);
            props.onQueryChange(value);
          }
        }}
        disabled={metadata.blocked}
      />
      <CommandList aria-busy={status === 'loading'}>
        {status === 'ready' ? (
          <CommandEmpty role="status">{message}</CommandEmpty>
        ) : (
          <FieldDescription role={status === 'error' ? 'alert' : 'status'}>
            {message}
          </FieldDescription>
        )}
        {!blocked &&
          groups.map((group) => (
            <CommandGroup key={group.key} heading={group.label}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.key}
                  value={item.key}
                  keywords={[
                    item.label,
                    item.description ?? '',
                    ...(item.keywords ?? []),
                  ]}
                  disabled={item.disabled === true}
                  className="min-w-0 whitespace-normal break-words"
                  onSelect={() => {
                    const target = item.href;
                    const action = item.onPress;
                    let accepted: unknown;
                    try {
                      accepted = props.onSelect?.(item.key);
                    } catch {
                      setFailure(true);
                      return;
                    }
                    if (accepted !== undefined && typeof accepted !== 'boolean') {
                      if (accepted instanceof Promise) {
                        void accepted.catch(() => undefined);
                      }
                      setFailure(true);
                      return;
                    }
                    if (accepted === false) return;
                    setFailure(false);
                    props.onAccepted?.();
                    action?.();
                    if (target) followHref(target);
                  }}
                >
                  {item.label}
                  {item.description && <span>{item.description}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
      </CommandList>
      {failure && (
        <Alert variant="destructive">
          <AlertDescription>{COMMAND_DEFAULTS.invalidSelection}</AlertDescription>
        </Alert>
      )}
    </Command>
  );
}
