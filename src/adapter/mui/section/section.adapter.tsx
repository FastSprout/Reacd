import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { useMaterialHeading } from '../layout/heading.js';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { SectionProps } from
  '@fastsprout/reacd/adapter-runtime/components/section/section.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiSectionProps = SectionProps;

export function MuiSection(props: MuiSectionProps) {
  const heading = useMaterialHeading(props.title, props.anchor, true);
  const theme = useTheme();
  return (
    <Stack
      component="section"
      aria-labelledby={heading.labelId}
      spacing={materialSpacing(theme)}
      sx={{ minWidth: 0 }}
    >
      <Typography variant="h5" component={heading.component} {...heading.attributes}>
        {props.title}
      </Typography>
      {props.description && (
        <Typography color="text.secondary">{props.description}</Typography>
      )}
      <HeadingLevelContext value={heading.descendants}>
        {props.children}
      </HeadingLevelContext>
    </Stack>
  );
}
