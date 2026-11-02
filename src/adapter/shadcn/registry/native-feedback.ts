import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { userSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/user/user.schema.js';
import { chipSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chip/chip.schema.js';
import { timelineSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/timeline/timeline.schema.js';
import { progressGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/progress-group/progress-group.schema.js';
import { ShadcnUser } from '../user/user.adapter.js';
import { ShadcnChip } from '../chip/chip.adapter.js';
import { ShadcnTimeline } from '../timeline/timeline.adapter.js';
import { ShadcnProgressGroup } from '../progress-group/progress-group.adapter.js';

export const nativeFeedbackEntries = {
  User: renderEntry('User', userSchema, ShadcnUser),
  Chip: renderEntry('Chip', chipSchema, ShadcnChip),
  Timeline: renderEntry('Timeline', timelineSchema, ShadcnTimeline),
  ProgressGroup: renderEntry('ProgressGroup', progressGroupSchema, ShadcnProgressGroup),
};
