import { useId } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import type {
  ProseBlock,
  ProseList,
} from '@fastsprout/reacd/adapter-runtime/core/prose.js';
import { PROSE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/prose-policy.js';

export function MuiProseList({
  node,
  renderContent,
}: {
  readonly node: ProseList;
  readonly renderContent: (nodes: readonly ProseBlock[]) => ReactNode;
}) {
  const id = useId();
  const inset =
    `min(${PROSE_POLICY.listInsetRem}rem, ` +
    `${PROSE_POLICY.maxInsetPercent}%)`;
  const items = node.items.map((item, index) => (
    <ListItem disableGutters key={index} sx={{ display: 'list-item' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
        {item.checked !== undefined && (
          <Checkbox
            checked={item.checked}
            disabled
            slotProps={{
              input: {
                'aria-label': PROSE_POLICY.taskLabel,
                'aria-describedby': `${id}-${index}`,
              },
            }}
          />
        )}
        <Box id={`${id}-${index}`} sx={{ minWidth: 0 }}>
          {renderContent(item.children)}
        </Box>
      </Box>
    </ListItem>
  ));
  return node.ordered ? (
    <List
      component="ol"
      start={node.start}
      sx={{ listStyleType: 'decimal', paddingInlineStart: inset }}
    >
      {items}
    </List>
  ) : (
    <List component="ul" sx={{ listStyleType: 'disc', paddingInlineStart: inset }}>
      {items}
    </List>
  );
}
