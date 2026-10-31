import { InputDate } from '../../src/components/input-date/index.js';

export const INPUT_DATE_EXAMPLES = {
  InputDate: (
    <InputDate
      label="Date example"
      referenceDate="2024-02-28"
      value="2024-02-29"
      onValueChange={() => undefined}
    />
  ),
};
