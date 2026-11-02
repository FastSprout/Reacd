import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import type { NavigationProps } from
  '@fastsprout/reacd/adapter-runtime/components/navigation/navigation.props.js';
import { useNativeField } from '../native-field.js';

export type MuiNavigationProps = NavigationProps;

export function MuiNavigation(props: MuiNavigationProps) {
  const field = useNativeField({});
  return (
    <List component="nav" aria-label={props.label}>
      {props.items.map((item) => (
        <ListItem key={item.value} disablePadding>
          <ListItemButton
            selected={item.value === props.value}
            disabled={field.disabled}
            aria-current={item.value === props.value ? 'page' : undefined}
            onClick={() => props.onValueChange(item.value)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
