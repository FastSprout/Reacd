import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { materialSpacing } from '../layout/spacing.js';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import type { CardProps } from
  '@fastsprout/reacd/adapter-runtime/components/card/card.props.js';

export type MuiCardProps = CardProps;

export function MuiCard({ label, header, footer, children, spacing }: MuiCardProps) {
  const theme = useTheme();
  return (
    <Card role={label ? 'region' : undefined} aria-label={label}>
      {header && <CardContent>{header}</CardContent>}
      <CardContent>
        <Stack spacing={materialSpacing(theme, spacing)}>{children}</Stack>
      </CardContent>
      {footer && <CardActions>{footer}</CardActions>}
    </Card>
  );
}
