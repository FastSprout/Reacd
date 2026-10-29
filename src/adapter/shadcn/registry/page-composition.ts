import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { pageAsideSchema } from '../../../schema/page-aside/page-aside.schema.js';
import { ShadcnPageAside } from '../page-aside/page-aside.adapter.js';
import { pageBodySchema } from '../../../schema/page-body/page-body.schema.js';
import { ShadcnPageBody } from '../page-body/page-body.adapter.js';
import { pageColumnsSchema } from '../../../schema/page-columns/page-columns.schema.js';
import { ShadcnPageColumns } from '../page-columns/page-columns.adapter.js';
import { pageGridSchema } from '../../../schema/page-grid/page-grid.schema.js';
import { ShadcnPageGrid } from '../page-grid/page-grid.adapter.js';
import { pageListSchema } from '../../../schema/page-list/page-list.schema.js';
import { ShadcnPageList } from '../page-list/page-list.adapter.js';

export const pageCompositionEntries = {
  PageAside: renderEntry('PageAside', pageAsideSchema, ShadcnPageAside),
  PageBody: renderEntry('PageBody', pageBodySchema, ShadcnPageBody),
  PageColumns: renderEntry('PageColumns', pageColumnsSchema, ShadcnPageColumns),
  PageGrid: renderEntry('PageGrid', pageGridSchema, ShadcnPageGrid),
  PageList: renderEntry('PageList', pageListSchema, ShadcnPageList),
};
