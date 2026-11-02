import type { Menu } from '@base-ui/react/menu';

export const SUBMENU_COLLISION_AVOIDANCE = {
  side: 'shift',
  align: 'shift',
  fallbackAxisSide: 'none',
} as const satisfies NonNullable<Menu.Positioner.Props['collisionAvoidance']>;
