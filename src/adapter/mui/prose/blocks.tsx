import type { ReactNode } from 'react';
import { Fragment } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { materialSpacing } from '../layout/spacing.js';
import Typography from '@mui/material/Typography';
import type { ProseBlock } from '@fastsprout/reacd/adapter-runtime/core/prose.js';
import { PROSE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/prose-policy.js';
import { headingTag } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-tag.js';
import { MuiProseInline } from './inline.js';
import { MuiProseCode } from './code.js';
import { MuiProseList } from './list.js';
import { MuiProseTable } from './table.js';

export function MuiProseBlocks({ nodes }: { readonly nodes: readonly ProseBlock[] }) {
  const theme = useTheme();
  return (
    <Stack spacing={materialSpacing(theme)} sx={{ minWidth: 0 }}>
      {nodes.map((node, index) => (
        <Fragment key={index}>{renderBlock(node)}</Fragment>
      ))}
    </Stack>
  );
}
function renderBlock(node: ProseBlock): ReactNode {
  switch (node.type) {
    case 'heading':
      return (
        <Typography
          component={headingTag(node.level)}
          variant={headingTag(node.level)}
          id={node.id}
          tabIndex={PROSE_POLICY.headingTabIndex}
        >
          <MuiProseInline nodes={node.children} />
        </Typography>
      );
    case 'paragraph':
      return (
        <Typography component="p">
          <MuiProseInline nodes={node.children} />
        </Typography>
      );
    case 'list':
      return (
        <MuiProseList
          node={node}
          renderContent={(nodes) => <MuiProseBlocks nodes={nodes} />}
        />
      );
    case 'code':
      return <MuiProseCode node={node} />;
    case 'table':
      return <MuiProseTable node={node} />;
    case 'quote':
      return (
        <Box
          component="blockquote"
          sx={{
            m: 0,
            paddingInlineStart:
              `min(${PROSE_POLICY.quoteInsetRem}rem, ` +
              `${PROSE_POLICY.maxInsetPercent}%)`,
          }}
        >
          <MuiProseBlocks nodes={node.children} />
        </Box>
      );
    case 'thematicBreak':
      return <Divider />;
    case 'image':
      return (
        <Box
          component="img"
          src={node.src}
          alt={node.alt}
          title={node.title}
          sx={{ maxWidth: '100%', height: 'auto' }}
        />
      );
  }
}
