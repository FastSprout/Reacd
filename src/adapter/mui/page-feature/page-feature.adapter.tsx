import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { useMaterialHeading } from '../layout/heading.js';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { PageFeatureProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-feature/page-feature.props.js';
import { PAGE_PRESENTATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { materialSpacing } from '../layout/spacing.js';
import { useNativeField } from '../native-field.js';

export type MuiPageFeatureProps = PageFeatureProps;

export function MuiPageFeature(props: MuiPageFeatureProps) {
  const theme = useTheme();
  const heading = useMaterialHeading(props.title);
  const field = useNativeField({});
  const press = props.onPress;
  const orientation =
    props.orientation ?? PAGE_PRESENTATION_DEFAULTS.featureOrientation;
  return (
    <HeadingLevelContext value={heading.descendants}>
      <Stack
        direction={orientation === 'horizontal' ? 'row' : 'column'}
        spacing={materialSpacing(theme)}
        useFlexGap
        sx={{ flexWrap: 'wrap', minWidth: 0 }}
      >
        {props.leading}
        <Stack sx={{ minWidth: 0 }}>
          {props.title && (
            <Typography
              variant="h6"
              component={heading.component}
              {...heading.attributes}
            >
              {props.href ? (
                <Link
                  href={props.href}
                  target={props.newWindow ? '_blank' : undefined}
                  rel={props.newWindow ? 'noopener noreferrer' : undefined}
                >
                  {props.title}
                </Link>
              ) : press ? (
                <Button disabled={field.disabled} onClick={() => press()}>
                  {props.title}
                </Button>
              ) : (
                props.title
              )}
            </Typography>
          )}
          {props.description && (
            <Typography color="text.secondary">{props.description}</Typography>
          )}
          {props.children}
        </Stack>
      </Stack>
    </HeadingLevelContext>
  );
}
