import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { PageLogosProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-logos/page-logos.props.js';
import { MEDIA_DEFAULTS, MEDIA_DIMENSIONS } from
  '@fastsprout/reacd/adapter-runtime/core/media-policy.js';
import { MuiNativeImage } from '../color-mode-image/native-image.js';
import { useMaterialHeading } from '../layout/heading.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiPageLogosProps = PageLogosProps;
export function MuiPageLogos({ label, title, items,
  emptyLabel = MEDIA_DEFAULTS.emptyLogos,
}: MuiPageLogosProps) {
  const heading = useMaterialHeading(title);
  const gap = materialSpacing(useTheme());
  const track = `min(100%, ${MEDIA_DIMENSIONS.logo.width}px)`;
  return (
    <Stack spacing={gap} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
      {title && <Typography variant="h5" component={heading.component}
        {...heading.attributes}>{title}</Typography>}
      {items.length === 0 ? <Typography>{emptyLabel}</Typography> : (
        <ImageList aria-label={label}
          sx={{ m: 0, gap,
            gridTemplateColumns: `repeat(auto-fit, minmax(${track}, 1fr))`,
          }}>
          {items.map((item) => (
            <ImageListItem key={item.key} sx={{ minWidth: 0 }}>
              <MuiNativeImage key={item.src} source={item.src} alt={item.alt}
                aspect="logo" failureLabel={`${MEDIA_DEFAULTS.unavailable} ${item.alt}`}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Stack>
  );
}
