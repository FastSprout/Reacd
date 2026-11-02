import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { ProseInline } from '@fastsprout/reacd/adapter-runtime/core/prose.js';
import { PROSE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/prose-policy.js';

export function MuiProseInline({ nodes }: { readonly nodes: readonly ProseInline[] }) {
  return nodes.map((node, index) => (
    <Box key={index} component="span">
      {renderInline(node)}
    </Box>
  ));
}
function renderInline(node: ProseInline): ReactNode {
  switch (node.type) {
    case 'text':
      return node.text;
    case 'code':
      return (
        <Typography
          component="code"
          variant="inherit"
          sx={{ fontFamily: PROSE_POLICY.codeFont }}
        >
          {node.text}
        </Typography>
      );
    case 'strong':
    case 'emphasis':
    case 'delete': {
      const component = { strong: 'strong', emphasis: 'em', delete: 'del' } as const;
      const styles = {
        strong: { fontWeight: 'fontWeightBold' },
        emphasis: { fontStyle: 'italic' },
        delete: { textDecoration: 'line-through' },
      };
      return (
        <Typography
          component={component[node.type]}
          variant="inherit"
          sx={styles[node.type]}
        >
          <MuiProseInline nodes={node.children} />
        </Typography>
      );
    }
    case 'link':
      return (
        <Link href={node.href}>
          <MuiProseInline nodes={node.children} />
        </Link>
      );
    case 'break':
      return <Box component="br" />;
  }
}
