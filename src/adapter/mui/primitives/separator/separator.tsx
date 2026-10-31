import Box from '@mui/material/Box';
import * as Separator from '@radix-ui/react-separator';
import type { SeparatorPrimitiveProps } from
  '../../../shared/primitives/separator/separator.props.js';

export function MuiSeparatorPrimitive(properties: SeparatorPrimitiveProps) {
  return (
    <Separator.Root {...properties} asChild>
      <Box component="div">{properties.children}</Box>
    </Separator.Root>
  );
}
