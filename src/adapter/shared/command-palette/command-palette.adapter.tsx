import { useId, useState } from 'react';
import { Autocomplete } from '@base-ui/react/autocomplete';
import type { CommandPaletteProps } from
  '@fastsprout/reacd/adapter-runtime/components/command-palette/index.js';
import { COMMAND_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/command-policy.js';
import { filterCommandGroups } from
  '@fastsprout/reacd/adapter-runtime/core/command-search.js';
import { followHref } from
  '@fastsprout/reacd/adapter-runtime/renderer/navigation/native-navigation.js';
import { Input } from '../primitives/input.js';

export function SharedCommandPalette({
  label,
  query,
  onQueryChange,
  groups,
  onSelect,
  disabled,
  filtering = COMMAND_DEFAULTS.filtering,
  status = COMMAND_DEFAULTS.status,
  emptyMessage = COMMAND_DEFAULTS.emptyMessage,
  loadingMessage = COMMAND_DEFAULTS.loadingMessage,
  errorMessage = COMMAND_DEFAULTS.errorMessage,
}: CommandPaletteProps) {
  const id = useId();
  const [selectionFailure, setSelectionFailure] = useState(false);
  const visible = filterCommandGroups(groups, query, filtering);
  const keys = visible.flatMap((group) => group.items.map((item) => item.key));
  function select(item: CommandPaletteProps['groups'][number]['items'][number]) {
    const href = item.href;
    const action = item.onPress;
    const accepted: unknown = onSelect?.(item.key);
    if (accepted === false) return;
    if (accepted !== undefined && accepted !== true) {
      setSelectionFailure(true);
      return;
    }
    setSelectionFailure(false);
    if (action !== undefined) action();
    else if (href !== undefined) followHref(href);
  }
  return (
    <section className="reacd-node reacd-command-palette" aria-label={label}>
      <Autocomplete.Root<string>
        inline
        open
        mode="none"
        autoHighlight="always"
        items={keys}
        value={query}
        disabled={disabled}
        onValueChange={(value) => {
          setSelectionFailure(false);
          onQueryChange(value);
        }}
      >
        <label htmlFor={id}>{label}</label>
        <Autocomplete.Input
          id={id}
          onKeyDownCapture={(event) => {
            if (event.key === 'Enter' && event.nativeEvent.isComposing) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          className="reacd-node reacd-input"
          aria-describedby={`${id}-status`}
          render={<Input />}
        />
        {selectionFailure && <p role="alert">{COMMAND_DEFAULTS.invalidSelection}</p>}
        <p id={`${id}-status`} role={status === 'error' ? 'alert' : 'status'}>
          {status === 'loading'
            ? loadingMessage
            : status === 'error'
              ? errorMessage
              : keys.length === 0
                ? emptyMessage
                : `${keys.length} commands available.`}
        </p>
        <Autocomplete.List
          className="reacd-command-list"
          aria-label={label}
          aria-busy={status === 'loading'}
        >
          {visible.map((group) => (
            <Autocomplete.Group key={group.key} className="reacd-command-group">
              <Autocomplete.GroupLabel>{group.label}</Autocomplete.GroupLabel>
              {group.items.map((item) => (
                <Autocomplete.Item
                  key={item.key}
                  value={item.key}
                  className="reacd-command-item"
                  disabled={item.disabled || status !== 'ready'}
                  onClick={() => select(item)}
                >
                  <span>{item.label}</span>
                  {item.description !== undefined && (
                    <span className="reacd-command-description">
                      {item.description}
                    </span>
                  )}
                </Autocomplete.Item>
              ))}
            </Autocomplete.Group>
          ))}
        </Autocomplete.List>
      </Autocomplete.Root>
    </section>
  );
}
