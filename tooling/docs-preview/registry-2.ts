import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';

export const previewGroup2 = {
  ColorModeSelect: previewEntry('examples/color-mode.tsx', () =>
    import('../../docs/examples/color-mode.js').then((module) => ({
      default: module.ColorModeExample,
    })),
  ),
  ColorModeSwitch: previewEntry('examples/color-mode.tsx', () =>
    import('../../docs/examples/color-mode.js').then((module) => ({
      default: module.ColorModeExample,
    })),
  ),
  ColorModeButton: previewEntry('examples/color-mode.tsx', () =>
    import('../../docs/examples/color-mode.js').then((module) => ({
      default: module.ColorModeExample,
    })),
  ),
  Chart: previewEntry('examples/chart.tsx', () =>
    import('../../docs/examples/chart.js').then((module) => ({
      default: module.ChartExample,
    })),
  ),
  Marquee: previewEntry('examples/marquee.tsx', () =>
    import('../../docs/examples/marquee.js').then((module) => ({
      default: module.MarqueeExample,
    })),
  ),
  Carousel: previewEntry('examples/carousel.tsx', () =>
    import('../../docs/examples/carousel.js').then((module) => ({
      default: module.CarouselExample,
    })),
  ),
  Calendar: previewEntry('examples/calendar.tsx', () =>
    import('../../docs/examples/calendar.js').then((module) => ({
      default: module.CalendarExample,
    })),
  ),
  InputTime: previewEntry('examples/input-time.tsx', () =>
    import('../../docs/examples/input-time.js').then((module) => ({
      default: module.InputTimeExample,
    })),
  ),
  FieldGroup: previewEntry('examples/field-group.tsx', () =>
    import('../../docs/examples/field-group.js').then((module) => ({
      default: module.FieldGroupExample,
    })),
  ),
  ChatAttachment: previewEntry('examples/chat-attachment.tsx', () =>
    import('../../docs/examples/chat-attachment.js').then((module) => ({
      default: module.ChatAttachmentExample,
    })),
  ),
  ChatMessage: previewEntry('examples/chat-message.tsx', () =>
    import('../../docs/examples/chat-message.js').then((module) => ({
      default: module.ChatMessageExample,
    })),
  ),
  ChatMessages: previewEntry('examples/chat-messages.tsx', () =>
    import('../../docs/examples/chat-messages.js').then((module) => ({
      default: module.ChatMessagesExample,
    })),
  ),
  Icon: previewEntry('examples/icon.tsx', () =>
    import('../../docs/examples/icon.js').then((module) => ({
      default: module.IconExample,
    })),
  ),
  ChatReasoning: previewEntry('examples/chat-reasoning.tsx', () =>
    import('../../docs/examples/chat-reasoning.js').then((module) => ({
      default: module.ChatReasoningExample,
    })),
  ),
  ChatTool: previewEntry('examples/chat-tool.tsx', () =>
    import('../../docs/examples/chat-tool.js').then((module) => ({
      default: module.ChatToolExample,
    })),
  ),
  ChatShimmer: previewEntry('examples/chat-shimmer.tsx', () =>
    import('../../docs/examples/chat-shimmer.js').then((module) => ({
      default: module.ChatShimmerExample,
    })),
  ),
  InputDate: previewEntry('examples/input-date.tsx', () =>
    import('../../docs/examples/input-date.js').then((module) => ({
      default: module.InputDateExample,
    })),
  ),
  Toast: previewEntry('examples/toast.tsx', () =>
    import('../../docs/examples/toast.js').then((module) => ({
      default: module.ToastExample,
    })),
  ),
  ContentNavigation: previewEntry('examples/content-navigation.tsx', () =>
    import('../../docs/examples/content-navigation.js').then((module) => ({
      default: module.ContentNavigationExample,
    })),
  ),
  ContentToc: previewEntry('examples/content-toc.tsx', () =>
    import('../../docs/examples/content-toc.js').then((module) => ({
      default: module.ContentTocExample,
    })),
  ),
} satisfies Record<string, PreviewEntry>;
