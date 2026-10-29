import { z } from 'zod';
import {
  choiceGroupShape,
  choiceValueSchema,
  validChoiceValue,
} from '../shared/choices.js';
import { textChangeSchema } from '../shared/values.js';

export const radioGroupSchema = z
  .strictObject({
    ...choiceGroupShape,
    value: choiceValueSchema,
    onValueChange: textChangeSchema,
  })
  .refine(
    (props) => validChoiceValue(props.items, props.value),
    'Selected radio value must exist in the options.',
  );
