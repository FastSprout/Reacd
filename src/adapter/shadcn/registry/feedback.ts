import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { treeSchema } from '../../../schema/tree/index.js';
import { ShadcnTree } from '../tree/tree.adapter.js';
import { userSchema } from '../../../schema/user/user.schema.js';
import { progressGroupSchema } from '../../../schema/progress-group/index.js';
import { bannerSchema } from '../../../schema/banner/banner.schema.js';
import { ShadcnUser } from '../user/user.adapter.js';
import { ShadcnProgressGroup } from '../progress-group/progress-group.adapter.js';
import { ShadcnBanner } from '../banner/banner.adapter.js';
import { timelineSchema } from '../../../schema/timeline/timeline.schema.js';
import { scrollAreaSchema } from '../../../schema/scroll-area/scroll-area.schema.js';
import { ShadcnTimeline } from '../timeline/timeline.adapter.js';
import { ShadcnScrollArea } from '../scroll-area/scroll-area.adapter.js';
export const feedbackEntries = {
  Tree: renderEntry('Tree', treeSchema, ShadcnTree),
  Timeline: renderEntry('Timeline', timelineSchema, ShadcnTimeline),
  ScrollArea: renderEntry('ScrollArea', scrollAreaSchema, ShadcnScrollArea),
  User: renderEntry('User', userSchema, ShadcnUser),
  ProgressGroup: renderEntry('ProgressGroup', progressGroupSchema, ShadcnProgressGroup),
  Banner: renderEntry('Banner', bannerSchema, ShadcnBanner),
};
