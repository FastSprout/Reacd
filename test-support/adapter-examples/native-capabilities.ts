import type { ComponentCatalog } from '../../src/components/catalog.js';

type Name = keyof ComponentCatalog;
type Adapter = 'material-ui' | 'shadcn-ui';

// Explicit gaps make every change in native coverage require an inventory review.
export const EXPECTED_UNSUPPORTED: Readonly<Record<Adapter, readonly Name[]>> = {
  'material-ui': [
    'Editor', 'EditorToolbar', 'EditorDragHandle', 'EditorSuggestionMenu',
    'EditorMentionMenu', 'EditorEmojiMenu', 'SelectMenu', 'Listbox',
    'ColorPicker', 'FileUpload', 'InputMenu', 'ChatPromptSubmit',
    'ChatPalette', 'Marquee', 'Carousel', 'InputTime',
    'FieldGroup', 'ChatAttachment', 'ChatMessage', 'ChatMessages',
    'ChatReasoning', 'ChatTool', 'ChatShimmer', 'Toast',
    'ContentNavigation', 'ContentToc', 'ContentSurround',
    'ContentSearch', 'ContentSearchButton', 'PricingPlan', 'PricingPlans',
    'PricingTable', 'DashboardGroup', 'DashboardSidebar', 'DashboardPanel',
    'DashboardNavbar', 'DashboardToolbar', 'DashboardSidebarCollapse',
    'DashboardSidebarToggle', 'DashboardResizeHandle', 'DashboardSearch',
    'DashboardSearchButton', 'BlogPost', 'BlogPosts', 'ChangelogVersion',
    'ChangelogVersions', 'Drawer', 'Slideover', 'ContextMenu', 'DropdownMenu',
    'Sidebar', 'Splitter', 'InputTags', 'Tree',
    'FooterColumns', 'Stepper', 'Error', 'ScrollArea',
    'Empty', 'Popover', 'Spacer', 'SplitView',
    'Viewport', 'CodeEditor',
  ],
  'shadcn-ui': [
    'Editor', 'EditorToolbar', 'EditorDragHandle', 'EditorSuggestionMenu',
    'EditorMentionMenu', 'EditorEmojiMenu', 'Listbox', 'ColorPicker',
    'FileUpload', 'Marquee', 'Carousel', 'Tree', 'CodeEditor',
  ],
};

export const PREVIEW_UNSUPPORTED_DEPENDENCIES: Readonly<Partial<Record<Name, Name>>> = {
  EditorToolbar: 'Editor',
  EditorDragHandle: 'Editor',
  EditorSuggestionMenu: 'Editor',
  EditorMentionMenu: 'Editor',
  EditorEmojiMenu: 'Editor',
};
