import { ChoiceMark } from '../primitives/choice-mark.js';
import { useId, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useDirection } from '@radix-ui/react-direction';
import type { InputRatingProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-rating/index.js';
import { INPUT_RATING_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-rating-policy.js';
import { RatingStars } from './rating-stars.js';
import { Button } from '../primitives/button.js';

export function SharedInputRating({
  label,
  description,
  value,
  onValueChange,
  length = INPUT_RATING_POLICY.length,
  step = INPUT_RATING_POLICY.step,
  clearable,
  hoverable,
  required,
  disabled,
  readOnly,
  name,
}: InputRatingProps) {
  const id = useId();
  const direction = useDirection();
  const [thumb, setThumb] = useState<HTMLSpanElement | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  return (
    <div
      className="reacd-node reacd-field reacd-input-rating"
      data-direction={direction}
    >
      <span id={id}>{label}</span>
      <div className="reacd-rating-scroll">
        <Slider.Root
          asChild
          value={[value]}
          min={INPUT_RATING_POLICY.emptyValue}
          max={length}
          step={step}
          disabled={disabled || readOnly}
          className="reacd-rating-control"
          onValueChange={(values) => {
            for (const next of values) onValueChange(next);
          }}
          onPointerMove={(event) => {
            if (!hoverable || disabled || readOnly) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (rect.width === 0) return;
            const offset =
              direction === 'rtl'
                ? rect.right - event.clientX
                : event.clientX - rect.left;
            const raw = (offset / rect.width) * length;
            setPreview(
              Math.min(
                length,
                Math.max(INPUT_RATING_POLICY.emptyValue, Math.ceil(raw / step) * step),
              ),
            );
          }}
          onPointerLeave={() => setPreview(null)}
        >
          <ChoiceMark appearance="rating">
            <Slider.Track className="reacd-rating-track">
              <RatingStars
                value={hoverable && !disabled && !readOnly ? (preview ?? value) : value}
                length={length}
              />
            </Slider.Track>
            <Slider.Thumb
              ref={setThumb}
              className="reacd-rating-thumb"
              aria-labelledby={id}
              aria-required={required}
              aria-invalid={required && value === INPUT_RATING_POLICY.emptyValue}
              aria-readonly={readOnly}
              aria-valuetext={`${value} of ${length} stars`}
              aria-describedby={description === undefined ? undefined : `${id}-help`}
            />
          </ChoiceMark>
        </Slider.Root>
      </div>
      <input type="hidden" name={name} value={value} disabled={disabled} />
      <input
        key={value}
        className="reacd-rating-validation"
        tabIndex={-1}
        aria-hidden="true"
        defaultValue={value === INPUT_RATING_POLICY.emptyValue ? '' : String(value)}
        required={required}
        disabled={disabled || readOnly}
        onInvalid={
          thumb === null
            ? undefined
            : (event) => {
                event.preventDefault();
                thumb.focus();
              }
        }
      />
      {description === undefined ? null : (
        <span id={`${id}-help`} className="reacd-field-description">
          {description}
        </span>
      )}
      {clearable ? (
        <Button
          className="reacd-button"
          type="button"
          variant="outline"
          disabled={disabled || readOnly || value === INPUT_RATING_POLICY.emptyValue}
          onClick={() => onValueChange(INPUT_RATING_POLICY.emptyValue)}
        >
          Clear {label}
        </Button>
      ) : null}
    </div>
  );
}
