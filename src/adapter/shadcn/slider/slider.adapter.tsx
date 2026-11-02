import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { requestNativeChange } from '../form-field/request-native-change.js';
import { useId } from 'react';
import type { SliderProps } from
  '@fastsprout/reacd/adapter-runtime/components/slider/slider.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Slider } from '../vendor/ui/slider.js';
import { Label } from '../vendor/ui/label.js';
import { SLIDER_POLICY } from '@fastsprout/reacd/adapter-runtime/core/slider-policy.js';

import {
  sliderIntervalSchema,
  sliderScalarSchema,
} from '@fastsprout/reacd/adapter-runtime/schema/slider/numeric.schema.js';

export type ShadcnSliderProps = SliderProps;
export function ShadcnSlider(properties: SliderProps) {
  const { label, description, min, max, step, orientation, readOnly } = properties;
  const id = useId();
  const metadata = useNativeField(properties, description ? [`${id}-help`] : []);
  const value =
    properties.mode === 'range'
      ? [properties.value.start, properties.value.end]
      : [properties.value];
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Slider
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        orientation={orientation}
        style={
          orientation === 'vertical'
            ? { minInlineSize: LAYOUT_POLICY.controlTargetPx }
            : { minBlockSize: LAYOUT_POLICY.controlTargetPx }
        }
        name={metadata.name}
        disabled={metadata.disabled}
        inert={metadata.blocked}
        preserveThumbOrder
        thumbProps={(index) => ({
          id: index === 0 ? id : `${id}-end`,
          name:
            properties.mode === 'range' && metadata.name !== undefined
              ? `${metadata.name}${
                  index === 0 ? SLIDER_POLICY.startSuffix : SLIDER_POLICY.endSuffix
                }`
              : metadata.name,
          'aria-label':
            properties.mode === 'range'
              ? `${
                  index === 0 ? SLIDER_POLICY.minimumLabel : SLIDER_POLICY.maximumLabel
                } ${label}`
              : label,
          'aria-readonly': readOnly,
          'aria-invalid': Boolean(metadata.error),
          'aria-describedby': metadata.descriptionIds.join(' ') || undefined,
        })}
        onValueChange={(next) => {
          requestNativeChange(Boolean(readOnly || metadata.blocked), () => {
            if (properties.mode === 'range') {
              properties.onValueChange(
                sliderIntervalSchema.parse({
                  start: next[0],
                  end: next[1],
                }),
              );
            } else properties.onValueChange(sliderScalarSchema.parse(next[0]));
          });
        }}
      />
      {description && <p id={`${id}-help`}>{description}</p>}
    </div>
  );
}
