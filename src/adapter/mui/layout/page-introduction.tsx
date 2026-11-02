import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { PageHeroProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-hero/page-hero.props.js';

import type { useMaterialHeading } from './heading.js';

interface PageIntroductionProps extends Pick<
  PageHeroProps,
  'title' | 'headline' | 'description' | 'links'
> {
  readonly heading: ReturnType<typeof useMaterialHeading>;
}

export function MuiPageIntroduction(props: PageIntroductionProps) {
  return (
    <Stack>
      {props.headline && <Typography variant="overline">{props.headline}</Typography>}
      {props.title && (
        <Typography
          variant="h4"
          component={props.heading.component}
          {...props.heading.attributes}
        >
          {props.title}
        </Typography>
      )}
      {props.description && (
        <Typography color="text.secondary">{props.description}</Typography>
      )}
      {props.links}
    </Stack>
  );
}
