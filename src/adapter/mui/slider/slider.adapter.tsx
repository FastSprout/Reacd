import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { MuiSliderRangeInput } from './slider-input.js';
import { useId } from 'react';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import type { SliderProps } from
  '@fastsprout/reacd/adapter-runtime/components/slider/slider.props.js';
import { SLIDER_POLICY } from '@fastsprout/reacd/adapter-runtime/core/slider-policy.js';
import { emitSliderValue } from './slider-change.js';
import { useNativeField } from '../native-field.js';

export type MuiSliderProps = SliderProps;

export function MuiSlider(props: MuiSliderProps) {
  const id = useId();
  const field = useNativeField(props);
  const orientation = props.orientation ?? SLIDER_POLICY.defaultOrientation;
  return (
    <FormControl
      error={Boolean(field.error)}
      inert={field.blocked}
      fullWidth
      disabled={field.disabled}
    >
      <FormLabel id={id}>{props.label}</FormLabel>
      <Slider
        value={
          props.mode === 'range' ? [props.value.start, props.value.end] : props.value
        }
        slots={props.mode === 'range' ? { input: MuiSliderRangeInput } : undefined}
        disableSwap={props.mode === 'range'}
        shiftStep={
          (props.step ?? SLIDER_POLICY.defaultStep) * SLIDER_POLICY.largeStepFactor
        }
        min={props.min}
        max={props.max}
        step={props.step ?? SLIDER_POLICY.defaultStep}
        orientation={orientation}
        sx={
          orientation === 'vertical'
            ? {
                height: `${SLIDER_POLICY.verticalExtentRem}rem`,
                minWidth: LAYOUT_POLICY.controlTargetPx,
              }
            : { minHeight: LAYOUT_POLICY.controlTargetPx }
        }
        disabled={field.disabled}
        name={field.name}
        valueLabelDisplay="auto"
        getAriaLabel={(index) =>
          props.mode === 'range'
            ? `${props.label} ${
                index === 0 ? SLIDER_POLICY.minimumLabel : SLIDER_POLICY.maximumLabel
              }`
            : props.label
        }
        slotProps={{
          thumb: {
            sx: {
              '&::after': {
                width: LAYOUT_POLICY.controlTargetPx,
                height: LAYOUT_POLICY.controlTargetPx,
              },
            },
          },
          input: {
            step: 'any',
            'aria-readonly': props.readOnly,
            'aria-invalid': Boolean(field.error),
            'aria-describedby': [...field.descriptionIds, `${id}-help`].join(' '),
          },
        }}
        onChange={(_event, value) => emitSliderValue(props, value, field.blocked)}
      />
      <FormHelperText id={`${id}-help`}>
        {field.helperError || props.description}
      </FormHelperText>
    </FormControl>
  );
}
