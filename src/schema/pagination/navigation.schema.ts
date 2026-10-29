import { z } from 'zod';
import { PAGINATION_POLICY } from '../../core/pagination-policy.js';
import { linkSchema } from '../link/link.schema.js';
const parameterSchema = z
  .string()
  .max(PAGINATION_POLICY.maximumParameterLength)
  .regex(/^[A-Za-z][A-Za-z0-9_-]*$/);
export const paginationNavigationSchema = z
  .strictObject({
    href: linkSchema.shape.href.refine(
      (href) => href.startsWith('/') || /^https?:\/\//.test(href),
      'Pagination requires an HTTP or local path.',
    ),
    pageParameter: parameterSchema.optional(),
    pageSizeParameter: parameterSchema.optional(),
  })
  .refine(
    (navigation) =>
      (navigation.pageParameter ?? PAGINATION_POLICY.pageParameter) !==
      (navigation.pageSizeParameter ?? PAGINATION_POLICY.pageSizeParameter),
    'Page and page-size parameters must be distinct.',
  );
