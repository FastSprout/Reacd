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
import { MuiUser } from '../user/user.adapter.js';
import { MuiChip } from '../chip/chip.adapter.js';
import { MuiTimeline } from '../timeline/timeline.adapter.js';
import { MuiProgressGroup } from '../progress-group/progress-group.adapter.js';

export const nativeFeedbackEntries = {
  User: renderEntry('User', userSchema, MuiUser),
  Chip: renderEntry('Chip', chipSchema, MuiChip),
  Timeline: renderEntry('Timeline', timelineSchema, MuiTimeline),
  ProgressGroup: renderEntry('ProgressGroup', progressGroupSchema, MuiProgressGroup),
};
