import { useContext, useId } from 'react';
import { Slider } from '@base-ui/react/slider';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { useDirection } from '@radix-ui/react-direction';
import type { SliderProps } from
  '@fastsprout/reacd/adapter-runtime/components/slider/index.js';
import { SLIDER_POLICY } from '@fastsprout/reacd/adapter-runtime/core/slider-policy.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { requestSliderChange } from './request-change.js';
import { SliderThumb } from './slider-thumb.js';

export function ShadcnSlider(properties: SliderProps) {
  const id = useId();
  const active = useContext(PortalActiveContext);
  const direction = useDirection();
  const metadata = useFieldMetadata(
    properties,
    properties.description ? [`${id}-description`] : [],
  );
  const range = properties.mode === 'range';
  const value = range
    ? [properties.value.start, properties.value.end]
    : properties.value;
  const names =
    properties.mode === 'range'
      ? [
          { suffix: SLIDER_POLICY.startSuffix, value: properties.value.start },
          { suffix: SLIDER_POLICY.endSuffix, value: properties.value.end },
        ]
      : [{ suffix: '', value: properties.value }];
  const display = names.map((entry) => entry.value).join(SLIDER_POLICY.rangeSeparator);
  const step = properties.step ?? SLIDER_POLICY.defaultStep;
  const description = metadata.descriptionIds.join(' ') || undefined;
  return (
    <DirectionProvider direction={direction}>
      <div className="reacd-node reacd-field reacd-range">
        <span id={`${id}-label`}>
          {properties.label}: {display}
        </span>
        {properties.description && (
          <p id={`${id}-description`}>{properties.description}</p>
        )}
        <Slider.Root<number | readonly number[]>
          value={value}
          min={properties.min}
          max={properties.max}
          step={step}
          largeStep={Math.min(
            step * SLIDER_POLICY.largeStepFactor,
            properties.max - properties.min,
          )}
          orientation={properties.orientation ?? SLIDER_POLICY.defaultOrientation}
          disabled={metadata.disabled}
          locale={SLIDER_POLICY.locale}
          thumbCollisionBehavior="none"
          thumbAlignment="edge"
          className="reacd-range-root"
          aria-labelledby={`${id}-label`}
          style={{
            blockSize:
              properties.orientation === 'vertical'
                ? `${SLIDER_POLICY.verticalExtentRem}rem`
                : undefined,
          }}
          onValueChange={(candidate, details) =>
            requestSliderChange(properties, candidate, metadata.disabled, active, () =>
              details.cancel(),
            )
          }
        >
          <Slider.Control className="reacd-range-control">
            <Slider.Track className="reacd-range-track">
              <Slider.Indicator className="reacd-range-indicator" />
              <SliderThumb
                index={0}
                label={
                  range
                    ? `${SLIDER_POLICY.minimumLabel} ${properties.label}`
                    : properties.label
                }
                description={description}
                readOnly={Boolean(properties.readOnly)}
                invalid={Boolean(metadata.error)}
              />
              {range && (
                <SliderThumb
                  index={1}
                  label={`${SLIDER_POLICY.maximumLabel} ${properties.label}`}
                  description={description}
                  readOnly={Boolean(properties.readOnly)}
                  invalid={Boolean(metadata.error)}
                />
              )}
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        {names.map((entry) => (
          <input
            key={entry.suffix}
            type="hidden"
            name={
              metadata.name === undefined ? undefined : metadata.name + entry.suffix
            }
            value={entry.value}
            disabled={metadata.disabled}
          />
        ))}
      </div>
    </DirectionProvider>
  );
}
