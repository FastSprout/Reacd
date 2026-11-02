import { useContext } from 'react';
import { MainScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/main/main-scope.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { useMaterialHeading } from '../layout/heading.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { PageProps } from
  '@fastsprout/reacd/adapter-runtime/components/page/page.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiPageProps = PageProps;

export function MuiPage(props: MuiPageProps) {
  const theme = useTheme();
  const nested = useContext(MainScopeContext);
  const heading = useMaterialHeading(props.title, props.anchor);
  return (
    <Stack
      component={nested ? 'section' : 'main'}
      aria-labelledby={heading.labelId}
      spacing={materialSpacing(theme, 'large')}
      sx={{ minWidth: 0 }}
    >
      <Typography variant="h4" component={heading.component} {...heading.attributes}>
        {props.title}
      </Typography>
      {props.subtitle && (
        <Typography color="text.secondary">{props.subtitle}</Typography>
      )}
      <MainScopeContext value={true}>
        <HeadingLevelContext value={heading.descendants}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={materialSpacing(theme)}
            sx={{ alignItems: 'stretch' }}
          >
            {props.left && <Box>{props.left}</Box>}
            <Box sx={{ flex: 1, minWidth: 0 }}>{props.children}</Box>
            {props.right && <Box>{props.right}</Box>}
          </Stack>
        </HeadingLevelContext>
      </MainScopeContext>
    </Stack>
  );
}
