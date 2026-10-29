import type { SlotProps } from 'input-otp';
import { PIN_INPUT_POLICY } from '../../../core/pin-input-policy.js';

export function PinSlots({
  slots,
  mask,
  separatorEvery,
}: {
  slots: readonly SlotProps[];
  mask: boolean | undefined;
  separatorEvery: number | undefined;
}) {
  return slots.map((slot, index) => (
    <span className="reacd-pin-position" key={index} aria-hidden="true">
      {separatorEvery !== undefined && index > 0 && index % separatorEvery === 0 ? (
        <span className="reacd-pin-separator">{PIN_INPUT_POLICY.separator}</span>
      ) : null}
      <span className="reacd-pin-slot" data-active={slot.isActive}>
        {slot.char === null
          ? PIN_INPUT_POLICY.placeholder
          : mask
            ? PIN_INPUT_POLICY.maskCharacter
            : slot.char}
        {slot.hasFakeCaret ? <span className="reacd-pin-caret" /> : null}
      </span>
    </span>
  ));
}
