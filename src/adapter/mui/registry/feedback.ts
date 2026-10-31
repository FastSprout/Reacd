import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { treeSchema } from '@fastsprout/reacd/adapter-runtime/schema/tree/index.js';
import { MuiTree } from '../tree/tree.adapter.js';
import { userSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/user/user.schema.js';
import { progressGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/progress-group/index.js';
import { bannerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/banner/banner.schema.js';
import { MuiUser } from '../user/user.adapter.js';
import { MuiProgressGroup } from '../progress-group/progress-group.adapter.js';
import { MuiBanner } from '../banner/banner.adapter.js';
import { timelineSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/timeline/timeline.schema.js';
import { scrollAreaSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/scroll-area/scroll-area.schema.js';
import { MuiTimeline } from '../timeline/timeline.adapter.js';
import { MuiScrollArea } from '../scroll-area/scroll-area.adapter.js';
export const feedbackEntries = {
  Tree: renderEntry('Tree', treeSchema, MuiTree),
  Timeline: renderEntry('Timeline', timelineSchema, MuiTimeline),
  ScrollArea: renderEntry('ScrollArea', scrollAreaSchema, MuiScrollArea),
  User: renderEntry('User', userSchema, MuiUser),
  ProgressGroup: renderEntry('ProgressGroup', progressGroupSchema, MuiProgressGroup),
  Banner: renderEntry('Banner', bannerSchema, MuiBanner),
};
