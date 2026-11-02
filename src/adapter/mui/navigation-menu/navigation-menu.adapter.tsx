import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { NavigationMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/navigation-menu/index.js';
import { NAVIGATION_COMPOSITION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/navigation-composition-policy.js';
import { useNativeField } from '../native-field.js';
import { materialSpacing } from '../layout/spacing.js';
import { flatTarget } from './target.js';
import { MuiNavigationGroup } from './group.js';

export type MuiNavigationMenuProps = NavigationMenuProps;
export function MuiNavigationMenu({
  label,
  items,
  orientation = NAVIGATION_COMPOSITION_DEFAULTS.orientation,
}: NavigationMenuProps) {
  const theme = useTheme();
  const field = useNativeField({});
  return (
    <Stack
      role="navigation"
      aria-label={label}
      useFlexGap
      direction={orientation === 'vertical' ? 'column' : 'row'}
      spacing={materialSpacing(theme)}
      sx={{
        minWidth: 0,
        maxWidth: '100%',
        flexWrap: orientation === 'vertical' ? 'nowrap' : 'wrap',
      }}
    >
      {items.map((item) =>
        item.children ? (
          <MuiNavigationGroup key={item.key} item={item} targets={item.children} />
        ) : (
          flatTarget(item, field.blocked)
        ),
      )}
    </Stack>
  );
}
