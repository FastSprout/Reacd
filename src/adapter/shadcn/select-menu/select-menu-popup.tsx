import { useContext } from 'react';
import type { RefObject } from 'react';
import { Combobox } from '@base-ui/react/combobox';
import { useDirection } from '@base-ui/react/direction-provider';
import type { SelectMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/select-menu/index.js';
import { CONTENT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { FORM_MENU_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { SELECT_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/select-menu-policy.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { PortalHostContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { Input } from '../vendor/ui/input.js';
import type { SelectMenuModel } from './use-select-menu.js';

export function SelectMenuPopup({
  properties,
  model,
  trigger,
}: {
  properties: SelectMenuProps;
  model: SelectMenuModel;
  trigger: RefObject<HTMLButtonElement | null>;
}) {
  const variables = useContext(ThemeVariablesContext);
  const host = useContext(PortalHostContext);
  const direction = useDirection();
  const searchLabel = `${SELECT_MENU_DEFAULTS.searchPrefix} ${properties.label}`;
  return (
    <Combobox.Portal container={host ?? undefined}>
      <Combobox.Positioner
        sideOffset={FORM_MENU_POLICY.sideOffsetPx}
        collisionPadding={FORM_MENU_POLICY.collisionPaddingPx}
        className="reacd-root reacd-portal-root reacd-select-menu-positioner"
        style={variables}
        dir={direction}
      >
        <Combobox.Popup
          className="reacd-select-menu-popup"
          hidden={!model.open}
          finalFocus={trigger}
          dir={direction}
          aria-label={`${properties.label} options`}
        >
          <Combobox.Input
            aria-label={searchLabel}
            placeholder={searchLabel}
            readOnly={properties.queryReadOnly}
            maxLength={CONTENT_POLICY.maxTextLength}
            render={<Input />}
            className="reacd-node reacd-input"
            onCompositionStart={() => {
              model.setComposing(true);
            }}
            onCompositionEnd={() => {
              model.setComposing(false);
            }}
            onKeyDownCapture={(event) => {
              const native = event.nativeEvent;
              const enter =
                event.key === 'Enter' ||
                native.keyCode === FORM_MENU_POLICY.compositionEnterCode;
              if (
                (enter && (native.isComposing || model.isComposing())) ||
                native.keyCode === FORM_MENU_POLICY.compositionProcessCode
              ) {
                event.preventDefault();
                event.stopPropagation();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                model.requestOpen(false);
              }
            }}
          />
          <Combobox.List
            className="reacd-select-menu-list"
            aria-label={`${properties.label} options`}
          >
            {model.items.map((item) => {
              const selected = model.selected.includes(item.value);
              const unavailable =
                !selected && (item.disabled || model.status !== 'ready');
              return (
                <Combobox.Item
                  key={item.value}
                  value={item.value}
                  className="reacd-select-menu-item"
                  disabled={unavailable}
                >
                  <span>{item.label}</span>
                  {item.description !== undefined && <span>{item.description}</span>}
                  <Combobox.ItemIndicator>
                    {SELECT_MENU_DEFAULTS.selectedMark}
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              );
            })}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  );
}
