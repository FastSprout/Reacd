import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { useMaterialHeading } from '../layout/heading.js';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { PageHeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-header/page-header.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiPageHeaderProps = PageHeaderProps;

export function MuiPageHeader(props: MuiPageHeaderProps) {
  const theme = useTheme();
  const heading = useMaterialHeading(props.title, props.anchor);
  return (
    <Stack
      component="header"
      aria-labelledby={heading.labelId}
      spacing={materialSpacing(theme)}
      sx={{ minWidth: 0 }}
    >
      {props.headline && <Typography variant="overline">{props.headline}</Typography>}
      {props.title && (
        <Typography variant="h4" component={heading.component} {...heading.attributes}>
          {props.title}
        </Typography>
      )}
      {props.description && (
        <Typography color="text.secondary">{props.description}</Typography>
      )}
      <HeadingLevelContext value={heading.descendants}>
        {props.children}
        {props.links}
      </HeadingLevelContext>
    </Stack>
  );
}
