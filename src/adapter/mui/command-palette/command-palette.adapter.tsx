import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import useAutocomplete from '@mui/material/useAutocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import type { CommandPaletteProps } from
  '@fastsprout/reacd/adapter-runtime/components/command-palette/index.js';
import {
  COMMAND_DEFAULTS,
  COMMAND_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/command-policy.js';
import { filterCommandGroups } from
  '@fastsprout/reacd/adapter-runtime/core/command-search.js';
import { useNativeField } from '../native-field.js';
import { activateCommand } from './activate-command.js';
import type { CommandItem } from './activate-command.js';

export type MuiCommandPaletteProps = CommandPaletteProps;
export function MuiCommandPalette(props: CommandPaletteProps) {
  const id = useId();
  const field = useNativeField({ disabled: props.disabled });
  const [failure, setFailure] = useState(false);
  const status = props.status ?? COMMAND_DEFAULTS.status;
  const ready = status === 'ready';
  const blocked = field.blocked || !ready;
  const groups = ready
    ? filterCommandGroups(
        props.groups,
        props.query,
        props.filtering ?? COMMAND_DEFAULTS.filtering,
      )
    : [];
  const options = groups.flatMap((group) => group.items);
  const sdk = useAutocomplete<CommandItem>({
    id,
    options,
    value: null,
    inputValue: props.query,
    disabled: field.blocked,
    open: ready && !field.blocked,
    clearOnBlur: false,
    disableCloseOnSelect: true,
    filterOptions: (values) => values,
    getOptionLabel: (item) => item.label,
    getOptionKey: (item) => item.key,
    getOptionDisabled: (item) => blocked || Boolean(item.disabled),
    onInputChange: (_event, value, reason) => {
      if (!field.blocked && reason === 'input') {
        setFailure(false);
        props.onQueryChange(value);
      }
    },
    onChange: (_event, item) => {
      setFailure(activateCommand(item, props.onSelect, blocked) === 'invalid');
    },
  });
  const composition = (
    event: KeyboardEvent<HTMLDivElement> & {
      defaultMuiPrevented?: boolean;
    },
  ) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing) {
      event.defaultMuiPrevented = true;
    }
  };
  const message =
    status === 'loading'
      ? (props.loadingMessage ?? COMMAND_DEFAULTS.loadingMessage)
      : status === 'error'
        ? (props.errorMessage ?? COMMAND_DEFAULTS.errorMessage)
        : (props.emptyMessage ?? COMMAND_DEFAULTS.emptyMessage);
  return (
    <Box {...sdk.getRootProps({ onKeyDown: composition })} sx={{ minWidth: 0 }}>
      <TextField
        id={id}
        label={props.label}
        fullWidth
        slotProps={{ htmlInput: { ...sdk.getInputProps(), 'aria-label': props.label } }}
      />
      {(!ready || options.length === 0) && (
        <Typography role={status === 'error' ? 'alert' : 'status'}>
          {message}
        </Typography>
      )}
      <List
        {...sdk.getListboxProps()}
        disablePadding
        sx={{
          minWidth: 0,
          maxBlockSize: `${COMMAND_POLICY.listBlockRem}rem`,
          overflowY: 'auto',
        }}
      >
        {groups.map((group) => (
          <Box key={group.key} component="li" role="group" aria-label={group.label}>
            <ListSubheader component="div">{group.label}</ListSubheader>
            <List disablePadding>
              {group.items.map((item) => {
                const { key, ...option } = sdk.getOptionProps({
                  option: item,
                  index: options.indexOf(item),
                });
                return (
                  <ListItemButton
                    component="li"
                    key={key}
                    {...option}
                    disabled={blocked || item.disabled}
                    sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}
                  >
                    <ListItemText primary={item.label} secondary={item.description} />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </List>
      {failure && <Alert severity="error">{COMMAND_DEFAULTS.invalidSelection}</Alert>}
    </Box>
  );
}
