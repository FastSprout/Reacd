import { useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import type { PageCardProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-card/page-card.props.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { PAGE_PRESENTATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { materialPageSurface } from '../layout/page-surface.js';
import { materialPageDirection } from '../layout/page-direction.js';
import { materialSpacing } from '../layout/spacing.js';
import { MuiPageFeature } from '../page-feature/page-feature.adapter.js';

export type MuiPageCardProps = PageCardProps;

export function MuiPageCard(props: MuiPageCardProps) {
  const theme = useTheme();
  const level = useContext(HeadingLevelContext);
  const descendants = props.title === undefined ? level : nextHeadingLevel(level);
  const variant = props.variant ?? PAGE_PRESENTATION_DEFAULTS.variant;
  const spotlight = props.spotlight ?? PAGE_PRESENTATION_DEFAULTS.spotlight;
  const surface = materialPageSurface(
    theme,
    variant,
    props.intent ?? PAGE_PRESENTATION_DEFAULTS.intent,
    props.highlight ?? PAGE_PRESENTATION_DEFAULTS.highlight,
    spotlight,
  );
  const introduction = (
    <MuiPageFeature
      key="introduction"
      title={props.title}
      description={props.description}
      leading={props.leading}
      href={props.href}
      onPress={props.onPress}
      newWindow={props.newWindow}
      orientation="vertical"
    />
  );
  const content =
    props.children === undefined ? null : (
      <HeadingLevelContext key="content" value={descendants}>
        <Stack sx={{ minWidth: 0 }}>{props.children}</Stack>
      </HeadingLevelContext>
    );
  const reverse = props.reverse ?? PAGE_PRESENTATION_DEFAULTS.reverse;
  return (
    <ThemeProvider theme={surface.theme}>
      <Card
        component="article"
        aria-label={props.title}
        variant={surface.variant}
        elevation={surface.elevation}
        sx={surface.sx}
        tabIndex={spotlight ? 0 : undefined}
      >
        <HeadingLevelContext value={descendants}>{props.header}</HeadingLevelContext>
        <CardContent
          sx={variant === 'naked' ? { p: 0, '&:last-child': { pb: 0 } } : undefined}
        >
          <Stack
            direction={materialPageDirection(props)}
            useFlexGap
            spacing={materialSpacing(theme)}
            sx={{ flexWrap: 'wrap', minWidth: 0 }}
          >
            {reverse ? [content, introduction] : [introduction, content]}
          </Stack>
        </CardContent>
        <HeadingLevelContext value={descendants}>{props.footer}</HeadingLevelContext>
      </Card>
    </ThemeProvider>
  );
}
