import { expectTypeOf, it } from 'vitest';
import { DataTable, Grid } from '../../index.js';
import type {
  DataTableProps, GridProps, NumberRange, SliderProps, UploadFile,
} from '../../index.js';
import type { FileUploadProps } from '../../components/file-upload/index.js';
import type { ComponentCatalog } from '../../components/catalog.js';
import type { StateBinding } from '../registry/registry.types.js';
import type { DataTableSnapshot } from '../data-table/controller.types.js';
import type { TableRow } from '../../schema/data-table/model.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';

type StylingProps = 'style' | 'className' | 'css' | 'sx' | 'as' | 'asChild';
type WritableStylingKeys<Props> = {
  [Key in Extract<StylingProps, keyof Props>]: [Props[Key]] extends [never]
    ? never
    : Key;
}[Extract<StylingProps, keyof Props>];
type StylingEscapes = {
  [Name in keyof ComponentCatalog]: WritableStylingKeys<ComponentCatalog[Name]>;
}[keyof ComponentCatalog];

it('keeps component props closed and state projections read-only', () => {
  expectTypeOf<StylingEscapes>().toBeNever();
  expectTypeOf<Parameters<typeof Grid>[0]>().toEqualTypeOf<GridProps>();
  expectTypeOf<Parameters<typeof DataTable>[0]>().toEqualTypeOf<DataTableProps>();
  expectTypeOf<Extract<SliderProps, { mode: 'range' }>['value']>()
    .toEqualTypeOf<NumberRange>();
  expectTypeOf<FileUploadProps['value']>().toEqualTypeOf<readonly UploadFile[]>();
  expectTypeOf<DataTableSnapshot['rows']>().toMatchTypeOf<readonly TableRow[]>();
  expectTypeOf<DataTableSnapshot['rows']>().not.toMatchTypeOf<TableRow[]>();
  expectTypeOf<
    Extract<'write', keyof Extract<StateBinding, { mode: 'read' }>>
  >().toBeNever();
  expectTypeOf<
    Extract<GenerativeNode, { type: 'Input' }>['value']['mode']
  >().toEqualTypeOf<'read' | 'readWrite'>();
  expectTypeOf<
    Extract<Extract<GenerativeNode, { type: 'Text' }>['content'], object>['mode']
  >().toEqualTypeOf<'read'>();
});
