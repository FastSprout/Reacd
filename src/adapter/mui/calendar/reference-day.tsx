import { createContext, forwardRef, useContext } from 'react';
import { PickerDay } from '@mui/x-date-pickers/PickerDay';
import type { PickerDayProps } from '@mui/x-date-pickers/PickerDay';
import { canonicalDate } from './date-values.js';

export const ReferenceDateContext = createContext('');

export const ReferenceDay = forwardRef<HTMLButtonElement, PickerDayProps>(
  function ReferenceDay(props, ref) {
    const today = canonicalDate(props.day) === useContext(ReferenceDateContext);
    return <PickerDay {...props} ref={ref} today={today}
      aria-current={today ? 'date' : undefined} />;
  },
);
