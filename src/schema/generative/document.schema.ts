import { inspectJsonBudget as inspectBudget } from '../../core/json-budget.js';
import { z } from 'zod';
import {
  BUTTON_INTENTS,
  CONTENT_POLICY,
  DATA_STATES,
  DOCUMENT_POLICY,
  INPUT_TYPES,
  LAYOUT_POLICY,
  SPACING,
  TEXT_ROLES,
  TEXT_WEIGHTS,
} from '../../core/policy.js';

export const SCHEMA_ID = DOCUMENT_POLICY.schemaId;
export const limits = {
  depth: DOCUMENT_POLICY.maxDepth,
  values: DOCUMENT_POLICY.maxValues,
  characters: DOCUMENT_POLICY.maxCharacters,
} as const;

const identifier = z
  .string()
  .min(1)
  .max(CONTENT_POLICY.maxIdentifierLength)
  .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/);
const label = z.string().trim().min(1).max(CONTENT_POLICY.maxLabelLength);
const content = z.string().max(CONTENT_POLICY.maxTextLength);
const spacingSchema = z.enum(SPACING);
export type Spacing = z.infer<typeof spacingSchema>;

const textSchema = z.strictObject({
  type: z.literal('Text'),
  content,
  role: z.enum(TEXT_ROLES).optional(),
  weight: z.enum(TEXT_WEIGHTS).optional(),
  lineLimit: z.number().int().min(1).max(CONTENT_POLICY.maxVisibleLines).optional(),
});

const buttonSchema = z.strictObject({
  type: z.literal('Button'),
  label,
  action: identifier,
  intent: z.enum(BUTTON_INTENTS).optional(),
  disabled: z.boolean().optional(),
});

const inputSchema = z.strictObject({
  type: z.literal('Input'),
  id: identifier,
  label,
  inputType: z.enum(INPUT_TYPES).optional(),
  placeholder: z.string().max(CONTENT_POLICY.maxLabelLength).optional(),
  value: content.optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
});

export const tableSchema = z.strictObject({
  type: z.literal('Table'),
  caption: label,
  columns: z.array(label).min(1).max(CONTENT_POLICY.maxTableColumns),
  rows: z
    .array(z.array(content).max(CONTENT_POLICY.maxTableColumns))
    .max(CONTENT_POLICY.maxTableRows),
  state: z.enum(DATA_STATES).optional(),
  emptyMessage: label.optional(),
  errorMessage: label.optional(),
});

export type TextNode = z.infer<typeof textSchema>;
export type ButtonNode = z.infer<typeof buttonSchema>;
export type InputNode = z.infer<typeof inputSchema>;
export type TableNode = z.infer<typeof tableSchema>;
export type StackNode = {
  type: 'VStack' | 'HStack' | 'Card';
  spacing?: Spacing | undefined;
  children: ReacdNode[];
};
export type GridNode = {
  type: 'Grid';
  columns: number;
  spacing?: Spacing | undefined;
  children: ReacdNode[];
};
export type ReacdNode =
  StackNode | GridNode | TextNode | ButtonNode | InputNode | TableNode;

export const nodeSchema: z.ZodType<ReacdNode> = z.lazy(() => {
  const children = z.array(nodeSchema).max(DOCUMENT_POLICY.maxChildren);
  const stack = { spacing: spacingSchema.optional(), children };
  return z.discriminatedUnion('type', [
    z.strictObject({ type: z.literal('VStack'), ...stack }),
    z.strictObject({ type: z.literal('HStack'), ...stack }),
    z.strictObject({ type: z.literal('Card'), ...stack }),
    z.strictObject({
      type: z.literal('Grid'),
      columns: z
        .number()
        .int()
        .min(LAYOUT_POLICY.minGridColumns)
        .max(LAYOUT_POLICY.maxGridColumns),
      ...stack,
    }),
    textSchema,
    buttonSchema,
    inputSchema,
    tableSchema,
  ]);
});

export const documentSchema = z.strictObject({
  $schema: z.literal(SCHEMA_ID).optional(),
  schemaVersion: z.literal(DOCUMENT_POLICY.version),
  templateId: identifier,
  root: nodeSchema,
});

export type ReacdDocument = z.infer<typeof documentSchema>;
export type ValidationIssue = { path: string; message: string };
export type ValidationResult =
  | { success: true; data: ReacdDocument }
  | { success: false; issues: ValidationIssue[] };

export function visitNodes(
  node: ReacdNode,
  visit: (node: ReacdNode, path: string) => void,
  path = '$.root',
): void {
  visit(node, path);
  if ('children' in node) {
    node.children.forEach((child, index) =>
      visitNodes(child, visit, `${path}.children[${index}]`),
    );
  }
}

export function validateDocument(input: unknown): ValidationResult {
  const budgetIssues = inspectBudget(input);
  if (budgetIssues.length > 0) return { success: false, issues: budgetIssues };
  const parsed = documentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      issues: parsed.error.issues.map((issue) => ({
        path: `$.${issue.path.map(String).join('.')}`,
        message: issue.message,
      })),
    };
  }
  const issues: ValidationIssue[] = [];
  const inputIds = new Set<string>();
  visitNodes(parsed.data.root, (node, path) => {
    if (node.type === 'Input') {
      if (inputIds.has(node.id))
        issues.push({ path: `${path}.id`, message: `Duplicate field ID: ${node.id}.` });
      inputIds.add(node.id);
    }
    if (node.type === 'Table') {
      node.rows.forEach((row, index) => {
        if (row.length !== node.columns.length) {
          issues.push({
            path: `${path}.rows[${index}]`,
            message: 'Cell count must match the number of columns.',
          });
        }
      });
    }
  });
  if (issues.length > 0) return { success: false, issues };
  return { success: true, data: parsed.data };
}

export function parseDocumentJson(source: string): ValidationResult {
  if (source.length > limits.characters) {
    return {
      success: false,
      issues: [{ path: '$', message: 'Document character budget exceeded.' }],
    };
  }
  let input: unknown;
  try {
    input = JSON.parse(source);
  } catch {
    return {
      success: false,
      issues: [{ path: '$', message: 'Invalid JSON syntax.' }],
    };
  }
  return validateDocument(input);
}
