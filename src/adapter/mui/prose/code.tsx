import { Fragment } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import type { ProseCode } from '@fastsprout/reacd/adapter-runtime/core/prose.js';
import { PROSE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/prose-policy.js';
import { materialSpacing } from '../layout/spacing.js';

export function MuiProseCode({ node }: { readonly node: ProseCode }) {
  const theme = useTheme();
  return (
    <Paper
      component="pre"
      variant="outlined"
      role="region"
      aria-label={node.language || PROSE_POLICY.codeLabel}
      tabIndex={PROSE_POLICY.codeTabIndex}
      sx={{
        m: 0,
        p: materialSpacing(theme),
        overflowX: 'auto',
        minWidth: 0,
        fontFamily: PROSE_POLICY.codeFont,
      }}
    >
      <Box component="code">
        {node.tokens === undefined
          ? node.content
          : node.tokens.map((line, index) => (
              <Fragment key={index}>
                {index > 0 && '\n'}
                {line.map((token, position) => (
                  <Box
                    component="span"
                    key={position}
                    sx={{
                      color: theme.palette.mode === 'dark' ? token.dark : token.light,
                    }}
                  >
                    {token.text}
                  </Box>
                ))}
              </Fragment>
            ))}
      </Box>
    </Paper>
  );
}
