import { useState } from 'react';
import { ContextMenu, DropdownMenu, Text } from '../src/index.js';
import type { DropdownMenuProps } from '../src/components/dropdown-menu/index.js';

export function Example({
  items,
  context = false,
  disabled = false,
}: {
  items: DropdownMenuProps['items'];
  context?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return context ? (
    <ContextMenu
      label="Resource actions"
      items={items}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
    >
      <Text>Resource</Text>
    </ContextMenu>
  ) : (
    <DropdownMenu
      label="Resource actions"
      items={items}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
    />
  );
}

