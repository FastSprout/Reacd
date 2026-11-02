import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import type { BreadcrumbProps } from
  '@fastsprout/reacd/adapter-runtime/components/breadcrumb/breadcrumb.props.js';
import {
  BREADCRUMB_DEFAULTS,
  BREADCRUMB_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/breadcrumb-policy.js';
import { useNativeField } from '../native-field.js';

export type MuiBreadcrumbProps = BreadcrumbProps;
type Item = BreadcrumbProps['items'][number];

function Target({ item, current }: { readonly item: Item; readonly current: boolean }) {
  const field = useNativeField({ disabled: item.disabled });
  const active = current ? 'page' : undefined;
  if (item.href !== undefined)
    return (
      <Link
        role="link"
        color="inherit"
        href={field.blocked ? undefined : item.href}
        aria-disabled={field.blocked}
        tabIndex={field.blocked ? -1 : undefined}
        aria-current={active}
        sx={{ maxWidth: '100%', overflowWrap: 'anywhere' }}
      >
        {item.label}
      </Link>
    );
  const action = item.onPress;
  if (action !== undefined)
    return (
      <Button
        variant="text"
        disabled={field.blocked}
        aria-current={active}
        onClick={() => action()}
        sx={{
          minWidth: 0,
          maxWidth: '100%',
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
        }}
      >
        {item.label}
      </Button>
    );
  return (
    <Typography
      component="span"
      color="text.primary"
      aria-current={active}
      sx={{ overflowWrap: 'anywhere' }}
    >
      {item.label}
    </Typography>
  );
}

export function MuiBreadcrumb({
  label,
  items,
  separator = BREADCRUMB_DEFAULTS.separator,
}: BreadcrumbProps) {
  const theme = useTheme();
  return (
    <Breadcrumbs
      aria-label={label}
      maxItems={BREADCRUMB_POLICY.maximumItems}
      separator={
        separator === 'slash' ? (
          '/'
        ) : (
          <ChevronRight
            fontSize="inherit"
            sx={{ transform: theme.direction === 'rtl' ? 'scaleX(-1)' : undefined }}
          />
        )
      }
      sx={{
        minWidth: 0,
        maxWidth: '100%',
        '& .MuiBreadcrumbs-li': {
          minWidth: 0,
          maxWidth: '100%',
        },
      }}
    >
      {items.map((item, index) => (
        <Target key={item.key} item={item} current={index === items.length - 1} />
      ))}
    </Breadcrumbs>
  );
}
