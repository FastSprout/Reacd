import { useId } from 'react';
import { useDirection } from '@radix-ui/react-direction';
import { I18nProvider } from 'react-aria-components/I18nProvider';
import { ColorArea, ColorThumb } from 'react-aria-components/ColorArea';
import { ColorSlider, SliderTrack } from 'react-aria-components/ColorSlider';
import { parseColor } from 'react-aria-components/ColorPicker';
import type { ColorPickerProps } from '../../../components/color-picker/index.js';
import { COLOR_PICKER_POLICY as P } from '../../../core/color-picker-policy.js';
import { useFieldMetadata } from '../../../renderer/form-field/field-metadata.js';
import { Button } from '../vendor/ui/button.js';
import { useColorModel } from './use-color-model.js';
import { ColorHex } from './color-hex.js';
export function ShadcnColorPicker(props: ColorPickerProps) {
  const id = useId();
  const direction = useDirection();
  const metadata = useFieldMetadata(props, props.description ? [`${id}-help`] : []);
  const blocked = metadata.disabled || Boolean(props.readOnly);
  const { color, change } = useColorModel(
    props.value,
    props.mode,
    blocked,
    props.onValueChange,
  );
  return (
    <I18nProvider locale={direction === 'rtl' ? P.rtlLocale : P.ltrLocale}>
      <div
        className="reacd-node reacd-field reacd-color-picker"
        dir={direction}
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={metadata.descriptionIds.join(' ') || undefined}
        aria-invalid={Boolean(metadata.error) || undefined}
        aria-disabled={metadata.disabled || undefined}
      >
        <span id={`${id}-label`}>{props.label}</span>
        {props.description && <p id={`${id}-help`}>{props.description}</p>}
        <ColorArea
          form={`${id}-channels`}
          className="reacd-color-area"
          aria-label={`${props.label} color area`}
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
          value={color}
          onChange={change}
          isDisabled={blocked}
        >
          <ColorThumb className="reacd-color-thumb" />
        </ColorArea>
        <span>{props.label} hue</span>
        <ColorSlider
          form={`${id}-channels`}
          aria-label={`${props.label} hue`}
          value={color}
          onChange={change}
          colorSpace="hsb"
          channel="hue"
          isDisabled={blocked}
          className="reacd-color-slider"
        >
          <SliderTrack className="reacd-color-track">
            <ColorThumb className="reacd-color-thumb" />
          </SliderTrack>
        </ColorSlider>
        {props.mode === 'rgba' && (
          <>
            <span>{props.label} alpha</span>
            <ColorSlider
              form={`${id}-channels`}
              aria-label={`${props.label} alpha`}
              value={color}
              onChange={change}
              channel="alpha"
              isDisabled={blocked}
              className="reacd-color-slider"
            >
              <SliderTrack className="reacd-color-track">
                <ColorThumb className="reacd-color-thumb" />
              </SliderTrack>
            </ColorSlider>
          </>
        )}
        <ColorHex
          label={props.label}
          value={props.value}
          mode={props.mode}
          onValueChange={props.onValueChange}
          disabled={metadata.disabled}
          readOnly={Boolean(props.readOnly)}
        />
        {props.presets && (
          <div className="reacd-color-presets">
            {props.presets.map((preset) => (
              <Button
                type="button"
                className="reacd-button"
                key={preset.value}
                aria-pressed={preset.value === props.value}
                disabled={blocked}
                onClick={() => change(parseColor(preset.value))}
              >
                <span
                  className="reacd-color-swatch"
                  aria-hidden="true"
                  style={{ backgroundColor: preset.value }}
                />
                {preset.label}
              </Button>
            ))}
          </div>
        )}
        {metadata.name && !metadata.disabled && (
          <input type="hidden" name={metadata.name} value={props.value} />
        )}
      </div>
    </I18nProvider>
  );
}
