import { useContext } from 'react';
import { Autocomplete } from '@base-ui/react/autocomplete';
import { useDirection } from '@base-ui/react/direction-provider';
import type { InputMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-menu/index.js';
import {
  FORM_MENU_DEFAULTS,
  FORM_MENU_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { PortalHostContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';

export function InputMenuPopup({
  label,
  items,
  inactive,
  highlight,
  open,
}: {
  label: string;
  open: boolean;
  items: InputMenuProps['items'];
  inactive: boolean;
  highlight: (item: InputMenuProps['items'][number]) => void;
}) {
  const variables = useContext(ThemeVariablesContext);
  const host = useContext(PortalHostContext);
  const direction = useDirection();
  return (
    <Autocomplete.Portal container={host ?? undefined}>
      <Autocomplete.Positioner
        sideOffset={FORM_MENU_POLICY.sideOffsetPx}
        collisionPadding={FORM_MENU_POLICY.collisionPaddingPx}
        className="reacd-root reacd-portal-root reacd-input-menu-positioner"
        style={variables}
        dir={direction}
      >
        <Autocomplete.Popup
          hidden={!open}
          className="reacd-input-menu-popup"
          dir={direction}
        >
          <Autocomplete.List
            aria-label={`${label} ${FORM_MENU_DEFAULTS.suggestionsLabel}`}
            className="reacd-input-menu-list"
          >
            {items.map((item) => (
              <Autocomplete.Item
                key={item.value}
                value={item}
                disabled={inactive || item.disabled}
                className="reacd-input-menu-item"
                onClickCapture={() => highlight(item)}
              >
                <span>{item.label}</span>
                {item.description !== undefined && <span>{item.description}</span>}
              </Autocomplete.Item>
            ))}
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  );
}
