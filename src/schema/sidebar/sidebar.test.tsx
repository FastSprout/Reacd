import { describe, expect, it } from 'vitest';
import { sidebarSchema } from './sidebar.schema.js';

const declaration = {
  title: 'Workspace navigation',
  open: true,
  onOpenChange: () => undefined,
  mobileOpen: false,
  onMobileOpenChange: () => undefined,
};

describe('Sidebar closed schema', () => {
  it('requires independent controlled desktop and mobile state', () => {
    expect(sidebarSchema.safeParse(declaration).success).toBe(true);
    expect(
      sidebarSchema.safeParse({ ...declaration, mobileOpen: undefined }).success,
    ).toBe(false);
  });

  it('rejects raw rendering, unsafe slots and unknown behavior', () => {
    for (const escape of [
      { className: 'custom' },
      { style: { width: 10 } },
      { side: 'left' },
      { children: <div /> },
      { collapsedContent: <span /> },
      { onOpenChange: 'callback' },
      { collapsible: 'custom' },
    ])
      expect(sidebarSchema.safeParse({ ...declaration, ...escape }).success).toBe(
        false,
      );
  });
});
