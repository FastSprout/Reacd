import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { PAGE_PRESENTATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { PageHeroProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-hero/page-hero.props.js';
import { useMaterialHeading } from '../layout/heading.js';
import { materialSpacing } from '../layout/spacing.js';
import { materialPageDirection } from '../layout/page-direction.js';
import { MuiPageIntroduction } from '../layout/page-introduction.js';

export type MuiPageHeroProps = PageHeroProps;

export function MuiPageHero(props: MuiPageHeroProps) {
  const theme = useTheme();
  const heading = useMaterialHeading(props.title);
  const introduction = (
    <Stack key="introduction" sx={{ minWidth: 0 }}>
      <MuiPageIntroduction
        heading={heading}
        title={props.title}
        headline={props.headline}
        description={props.description}
        links={props.links}
      />
    </Stack>
  );
  const content =
    props.children === undefined ? null : (
      <Stack key="content" sx={{ minWidth: 0 }}>
        {props.children}
      </Stack>
    );
  const reverse = props.reverse ?? PAGE_PRESENTATION_DEFAULTS.reverse;
  return (
    <HeadingLevelContext value={heading.descendants}>
      <Stack
        component="section"
        aria-labelledby={heading.labelId}
        spacing={materialSpacing(theme, 'large')}
        sx={{ minWidth: 0 }}
      >
        {props.top}
        {props.header}
        <Stack
          direction={materialPageDirection(props)}
          useFlexGap
          spacing={materialSpacing(theme)}
          sx={{ flexWrap: 'wrap', minWidth: 0 }}
        >
          {reverse ? [content, introduction] : [introduction, content]}
        </Stack>
        {props.footer}
        {props.bottom}
      </Stack>
    </HeadingLevelContext>
  );
}
