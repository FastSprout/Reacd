import Container from '@mui/material/Container';
import type { ContainerProps } from
  '@fastsprout/reacd/adapter-runtime/components/container/container.props.js';

export type MuiContainerProps = ContainerProps;

export function MuiContainer({ children }: MuiContainerProps) {
  return <Container maxWidth="xl">{children}</Container>;
}
