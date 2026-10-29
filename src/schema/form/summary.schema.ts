import { z } from 'zod';
import { FORM_SUBMIT_POLICY } from '../../core/form-submit-policy.js';
import { labelSchema } from '../shared/values.js';

export const formSummaryIssueSchema = z
  .strictObject({
    label: labelSchema.optional(),
    message: labelSchema,
  })
  .readonly();

export const formSummarySchema = z
  .array(formSummaryIssueSchema)
  .max(FORM_SUBMIT_POLICY.maximumIssues)
  .readonly();
