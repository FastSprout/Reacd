import { Fragment } from 'react';
import { OTPInputContext } from 'input-otp';
import type { RenderProps } from 'input-otp';
import { PIN_INPUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/pin-input-policy.js';
import {
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../vendor/ui/input-otp.js';

interface PinSlotsProps {
  readonly state: RenderProps;
  readonly mask?: boolean | undefined;
  readonly separatorEvery?: number | undefined;
}

export function ShadcnPinSlots({ state, mask, separatorEvery }: PinSlotsProps) {
  const presentation = {
    ...state,
    slots: state.slots.map((slot) => ({
      ...slot,
      char: mask && slot.char ? PIN_INPUT_POLICY.maskCharacter : slot.char,
    })),
  };
  return (
    <OTPInputContext value={presentation}>
      <InputOTPGroup aria-hidden="true" className="min-w-0 flex-1 flex-wrap gap-y-2">
        {state.slots.map((_slot, index) => (
          <Fragment key={index}>
            {separatorEvery !== undefined &&
              index > 0 &&
              index % separatorEvery === 0 && <InputOTPSeparator />}
            <InputOTPSlot index={index} className="min-w-9 flex-1" />
          </Fragment>
        ))}
      </InputOTPGroup>
    </OTPInputContext>
  );
}
