import type { KeyboardEvent } from 'react';
import { useDirection } from '@base-ui/react/direction-provider';
import type { CarouselProps } from
  '@fastsprout/reacd/adapter-runtime/components/carousel/index.js';
import {
  CAROUSEL_DEFAULTS,
  CAROUSEL_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/carousel-policy.js';
import {
  carouselSlideLabel,
  carouselTarget,
} from '@fastsprout/reacd/adapter-runtime/core/carousel-navigation.js';
import { Button } from '../vendor/ui/button.js';
import { CarouselFocusBoundary } from './focus-boundary.js';
import { CarouselPanel } from './carousel-panel.js';

export function ShadcnCarousel({
  label,
  items,
  value,
  onValueChange,
  disabled,
  readOnly,
  orientation = CAROUSEL_DEFAULTS.orientation,
  loop = CAROUSEL_DEFAULTS.loop,
  state = CAROUSEL_DEFAULTS.state,
  emptyMessage = CAROUSEL_DEFAULTS.emptyMessage,
  loadingMessage = CAROUSEL_DEFAULTS.loadingMessage,
  errorMessage = CAROUSEL_DEFAULTS.errorMessage,
  retryLabel = CAROUSEL_DEFAULTS.retryLabel,
  onRetry,
}: CarouselProps) {
  const direction = useDirection();
  const protectedValue = disabled || readOnly;
  function move(key: string) {
    const next = carouselTarget(value, items.length, key, orientation, direction, loop);
    if (next !== undefined && next !== value) onValueChange(next);
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || protectedValue || state !== 'ready')
      return;
    const next = carouselTarget(
      value,
      items.length,
      event.key,
      orientation,
      direction,
      loop,
    );
    if (next !== undefined) {
      event.preventDefault();
      move(event.key);
    }
  }
  const forward =
    orientation === 'vertical'
      ? 'ArrowDown'
      : direction === 'rtl'
        ? 'ArrowLeft'
        : 'ArrowRight';
  const backward =
    orientation === 'vertical'
      ? 'ArrowUp'
      : direction === 'rtl'
        ? 'ArrowRight'
        : 'ArrowLeft';
  const currentItem = items[value];
  const activeKey =
    state === 'ready'
      ? currentItem === undefined
        ? 'empty'
        : `slide:${currentItem.id}`
      : state;
  return (
    <CarouselFocusBoundary
      label={label}
      value={value}
      activeKey={activeKey}
      onKeyDown={onKeyDown}
    >
      {state === 'loading' ? (
        <p role="status">{loadingMessage}</p>
      ) : state === 'error' ? (
        <div>
          <p role="alert">{errorMessage}</p>
          {onRetry === undefined ? null : (
            <Button type="button" className="reacd-button" onClick={() => onRetry()}>
              {retryLabel}
            </Button>
          )}
        </div>
      ) : items.length === 0 ? (
        <p role="status">{emptyMessage}</p>
      ) : (
        <>
          <div className="reacd-carousel-panels" aria-live="polite">
            {items.map((item, index) => (
              <CarouselPanel
                key={item.id}
                index={index}
                active={index === value}
                label={carouselSlideLabel(item.label, index, items.length)}
              >
                {item.children}
              </CarouselPanel>
            ))}
          </div>
          {items.length < CAROUSEL_POLICY.minimumNavigationItems ? null : (
            <div className="reacd-carousel-controls">
              <Button
                type="button"
                className="reacd-button"
                variant="outline"
                disabled={protectedValue || (!loop && value === 0)}
                onClick={() => move(backward)}
              >
                {CAROUSEL_DEFAULTS.previousLabel}
              </Button>
              <Button
                type="button"
                className="reacd-button"
                variant="outline"
                disabled={
                  protectedValue ||
                  (!loop && value === items.length - CAROUSEL_POLICY.step)
                }
                onClick={() => move(forward)}
              >
                {CAROUSEL_DEFAULTS.nextLabel}
              </Button>
              <div
                role="group"
                aria-label={CAROUSEL_DEFAULTS.chooserLabel}
                className="reacd-carousel-chooser"
              >
                {items.map((item, index) => (
                  <Button
                    key={item.id}
                    type="button"
                    className="reacd-button"
                    variant="ghost"
                    aria-label={`${item.label}, slide ${index + CAROUSEL_POLICY.step}`}
                    aria-pressed={index === value}
                    disabled={protectedValue || index === value}
                    onClick={() => onValueChange(index)}
                  >
                    {index + CAROUSEL_POLICY.step}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </CarouselFocusBoundary>
  );
}
