import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { pageAsideSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-aside/page-aside.schema.js';
import { MuiPageAside } from '../page-aside/page-aside.adapter.js';
import { pageBodySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-body/page-body.schema.js';
import { MuiPageBody } from '../page-body/page-body.adapter.js';
import { pageColumnsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-columns/page-columns.schema.js';
import { MuiPageColumns } from '../page-columns/page-columns.adapter.js';
import { pageGridSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-grid/page-grid.schema.js';
import { MuiPageGrid } from '../page-grid/page-grid.adapter.js';
import { pageListSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-list/page-list.schema.js';
import { MuiPageList } from '../page-list/page-list.adapter.js';

export const pageCompositionEntries = {
  PageAside: renderEntry('PageAside', pageAsideSchema, MuiPageAside),
  PageBody: renderEntry('PageBody', pageBodySchema, MuiPageBody),
  PageColumns: renderEntry('PageColumns', pageColumnsSchema, MuiPageColumns),
  PageGrid: renderEntry('PageGrid', pageGridSchema, MuiPageGrid),
  PageList: renderEntry('PageList', pageListSchema, MuiPageList),
};
