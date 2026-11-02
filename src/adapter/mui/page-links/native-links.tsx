import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import type { PageAnchorsProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-anchors/page-anchors.props.js';
import { PAGE_LINK_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-navigation-policy.js';

export function MuiPageNativeLinks(props: PageAnchorsProps) {
  return (
    <List component="nav" aria-label={props.label}>
      {(props.links ?? PAGE_LINK_DEFAULTS.links).map((item) => (
        <ListItem key={item.key}>
          <ListItemButton
            sx={{ minWidth: 0, maxWidth: '100%', flexWrap: 'wrap',
              overflowWrap: 'anywhere' }}
            component={Link}
            href={item.href}
            selected={props.activeKey === item.key}
            aria-current={props.activeKey === item.key ? 'page' : undefined}
            target={item.newWindow ? '_blank' : undefined}
            rel={item.newWindow ? 'noopener noreferrer' : undefined}
          >
            {item.leading && (
              <ListItemIcon sx={{ minWidth: 0, maxWidth: '100%' }}>
                {item.leading}
              </ListItemIcon>
            )}
            <ListItemText primary={item.label}
              sx={{ minWidth: 0, maxWidth: '100%' }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
