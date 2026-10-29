import type { z } from 'zod';
import type { formSchema } from '../../schema/form/form.schema.js';
import type { formSummaryIssueSchema } from '../../schema/form/summary.schema.js';

export type FormProps = z.infer<typeof formSchema>;

export type FormSummaryIssue = z.infer<typeof formSummaryIssueSchema>;
