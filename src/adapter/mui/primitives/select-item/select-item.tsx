import ListItem from '@mui/material/ListItem';
import * as Select from '@radix-ui/react-select';
import { Check } from 'lucide-react';
import type { SelectItemPrimitiveProps } from
  '../../../shared/primitives/select-item/select-item.props.js';
import { MUI_SELECT_ITEM_STYLE } from '../styles.js';

export function MuiSelectItemPrimitive({
  children,
  ...properties
}: SelectItemPrimitiveProps) {
  return (
    <Select.Item {...properties} asChild>
      <ListItem component="div" sx={MUI_SELECT_ITEM_STYLE}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator>
          <Check aria-hidden="true" />
        </Select.ItemIndicator>
      </ListItem>
    </Select.Item>
  );
}
