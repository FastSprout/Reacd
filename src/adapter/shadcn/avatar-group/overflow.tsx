import { useState } from 'react';
import { Close } from '@radix-ui/react-popover';
import type { AvatarGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/avatar-group/index.js';
import { AVATAR_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/avatar-policy.js';
import { AvatarGroupCount } from '../vendor/ui/avatar.js';
import { Button } from '../vendor/ui/button.js';
import { CardContent, CardDescription } from '../vendor/ui/card.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
} from '../vendor/ui/popover.js';
import { useOverlayScope } from '../overlays/use-overlay-scope.js';
import { ShadcnAvatar } from '../avatar/avatar.adapter.js';

export function ShadcnAvatarOverflow({
  items,
  size,
}: Pick<AvatarGroupProps, 'items' | 'size'>) {
  const [open, setOpen] = useState(false);
  const { setHost, ...scope } = useOverlayScope({ open, onOpenChange: setOpen });
  const label = `${AVATAR_DEFAULTS.overflowPrefix} ${items.length} ${
    items.length === 1
      ? AVATAR_DEFAULTS.overflowSingular
      : AVATAR_DEFAULTS.overflowPlural
  }`;
  return (
    <Popover open={scope.visible} onOpenChange={scope.change}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          disabled={scope.blocked}
          className="h-auto min-h-9 shrink-0 rounded-full p-0"
        >
          <AvatarGroupCount aria-hidden>+{items.length}</AvatarGroupCount>
          <span className="sr-only">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        ref={setHost}
        container={scope.parentHost}
        aria-label={AVATAR_DEFAULTS.overflowTitle}
        dir={scope.direction}
        onCloseAutoFocus={scope.closeAutoFocus}
        style={{
          ...scope.theme,
          overflowY: 'auto',
          overflowWrap: 'anywhere',
          maxInlineSize: 'var(--radix-popover-content-available-width)',
          maxBlockSize: 'var(--radix-popover-content-available-height)',
        }}
      >
        <PopoverHeader>
          <PopoverTitle>{label}</PopoverTitle>
        </PopoverHeader>
        <CardContent
          role="list"
          aria-label={AVATAR_DEFAULTS.overflowTitle}
          className="grid min-w-0 gap-4 p-0"
        >
          {items.map(({ id, ...identity }) => (
            <CardContent
              key={id}
              role="listitem"
              className="flex min-w-0 flex-wrap items-center gap-2 p-0"
            >
              <ShadcnAvatar {...identity} size={size} />
              <CardDescription>{identity.name}</CardDescription>
            </CardContent>
          ))}
        </CardContent>
        <Close asChild>
          <Button type="button" variant="outline">
            {AVATAR_DEFAULTS.overflowClose}
          </Button>
        </Close>
      </PopoverContent>
    </Popover>
  );
}
