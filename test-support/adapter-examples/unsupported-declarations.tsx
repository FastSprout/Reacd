import type { ReactNode } from 'react';
import type { ComponentCatalog } from '../../src/components/catalog.js';
import {
  EditorDragHandle,
  EditorEmojiMenu,
  EditorMentionMenu,
  EditorSuggestionMenu,
  EditorToolbar,
  DashboardSidebar,
  DashboardPanel,
  DashboardNavbar,
  DashboardToolbar,
  DashboardSidebarCollapse,
  DashboardSidebarToggle,
  DashboardResizeHandle,
} from '../../src/index.js';

export const UNSUPPORTED_DECLARATIONS: Readonly<Partial<
  Record<keyof ComponentCatalog, ReactNode>
>> = {
  EditorToolbar: <EditorToolbar label="Example formatting" />,
  EditorDragHandle: <EditorDragHandle label="Example block" blockId="first" />,
  EditorSuggestionMenu: <EditorSuggestionMenu label="Insert block"
    items={[{ command: 'heading1', label: 'Heading' }]} />,
  EditorMentionMenu: <EditorMentionMenu label="People"
    items={[{ id: 'person', label: 'Example person' }]} />,
  EditorEmojiMenu: <EditorEmojiMenu label="Emoji"
    items={[{ name: 'wave', label: 'Wave', value: '👋' }]} />,
  DashboardSidebar: <DashboardSidebar />,
  DashboardPanel: <DashboardPanel label="Example panel" />,
  DashboardNavbar: <DashboardNavbar title="Inbox" />,
  DashboardToolbar: <DashboardToolbar label="Inbox actions" />,
  DashboardSidebarCollapse: <DashboardSidebarCollapse />,
  DashboardSidebarToggle: <DashboardSidebarToggle />,
  DashboardResizeHandle: <DashboardResizeHandle label="Navigation resize" />,
};
