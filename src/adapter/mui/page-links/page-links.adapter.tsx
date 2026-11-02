import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { PageLinksProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-links/page-links.props.js';
import { MuiPageNativeLinks } from './native-links.js';

export type MuiPageLinksProps = PageLinksProps;

export function MuiPageLinks(props: MuiPageLinksProps) {
  return (
    <Stack>
      {props.title && (
        <Typography variant="h6" component="h2">
          {props.title}
        </Typography>
      )}
      <MuiPageNativeLinks {...props} />
    </Stack>
  );
}
