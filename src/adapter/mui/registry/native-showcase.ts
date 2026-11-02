import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { authFormSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/auth-form/auth-form.schema.js';
import { bannerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/banner/banner.schema.js';
import { calendarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/calendar/calendar.schema.js';
import { chartSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chart/chart.schema.js';
import { chatPromptSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-prompt/chat-prompt.schema.js';
import { commandPaletteSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/command-palette/command-palette.schema.js';
import { inputDateSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-date/input-date.schema.js';
import { navigationMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/navigation-menu/navigation-menu.schema.js';
import { pinInputSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pin-input/pin-input.schema.js';
import { MuiAuthForm } from '../auth-form/auth-form.adapter.js';
import { MuiBanner } from '../banner/banner.adapter.js';
import { MuiCalendar } from '../calendar/calendar.adapter.js';
import { MuiChart } from '../chart/chart.adapter.js';
import { MuiChatPrompt } from '../chat-prompt/chat-prompt.adapter.js';
import { MuiCommandPalette } from '../command-palette/command-palette.adapter.js';
import { MuiInputDate } from '../input-date/input-date.adapter.js';
import { MuiNavigationMenu } from '../navigation-menu/navigation-menu.adapter.js';
import { MuiPinInput } from '../pin-input/pin-input.adapter.js';

export const nativeShowcaseEntries = {
  AuthForm: renderEntry('AuthForm', authFormSchema, MuiAuthForm),
  Banner: renderEntry('Banner', bannerSchema, MuiBanner),
  Calendar: renderEntry('Calendar', calendarSchema, MuiCalendar),
  Chart: renderEntry('Chart', chartSchema, MuiChart),
  ChatPrompt: renderEntry('ChatPrompt', chatPromptSchema, MuiChatPrompt),
  CommandPalette: renderEntry(
    'CommandPalette', commandPaletteSchema, MuiCommandPalette,
  ),
  InputDate: renderEntry('InputDate', inputDateSchema, MuiInputDate),
  NavigationMenu: renderEntry(
    'NavigationMenu', navigationMenuSchema, MuiNavigationMenu,
  ),
  PinInput: renderEntry('PinInput', pinInputSchema, MuiPinInput),
};
