import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { CodeBlockProps } from
  '@fastsprout/reacd/adapter-runtime/components/code-block/code-block.props.js';

export type MuiCodeBlockProps = CodeBlockProps;

export function MuiCodeBlock(props: MuiCodeBlockProps) {
  return (
    <Paper role="region" aria-label={props.label}>
      <Typography component="pre" sx={{ fontFamily: 'monospace', overflowX: 'auto' }}>
        {props.content}
      </Typography>
    </Paper>
  );
}
