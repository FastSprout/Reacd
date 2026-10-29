import { NavigationExample } from '../../docs/examples/navigation.js';
import { atom, useAtom } from 'jotai';
import { App, Section, Toggle, VStack } from 'reacd';
import { PaginationExample } from '../../docs/examples/pagination.js';
import { BreadcrumbExample } from '../../docs/examples/breadcrumb.js';
import { LinkExample } from '../../docs/examples/link.js';
import { TabsExample } from '../../docs/examples/tabs.js';
import { FooterColumnsExample } from '../../docs/examples/footer-columns.js';
import { NavigationMenuExample } from '../../docs/examples/navigation-menu.js';
import { StepperExample } from '../../docs/examples/stepper.js';
import { CommandPaletteExample } from '../../docs/examples/command-palette.js';
import { DrawerExample } from '../../docs/examples/drawer.js';
import { SlideoverExample } from '../../docs/examples/slideover.js';
import { DropdownMenuExample } from '../../docs/examples/dropdown-menu.js';
import { ContextMenuExample } from '../../docs/examples/context-menu.js';
import { ContentSurroundExample } from '../../docs/examples/content-surround.js';
import { ContentSearchExample } from '../../docs/examples/content-search.js';
import { ContentSearchButtonExample } from
  '../../docs/examples/content-search-button.js';
const rtlAtom = atom(false);
export function NavigationExamples() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <App direction={rtl ? 'rtl' : 'ltr'}>
      <Section
        title="Navigation primitives"
        description="Controlled pages and named paths preserve application intent."
      >
        <VStack>
          <Toggle
            label="Right to left navigation"
            checked={rtl}
            onCheckedChange={setRtl}
          />
          <BreadcrumbExample />
          <LinkExample />
          <TabsExample />
          <FooterColumnsExample />
          <NavigationMenuExample />
          <StepperExample />
          <CommandPaletteExample />
          <DrawerExample />
          <SlideoverExample />
          <DropdownMenuExample />
          <ContextMenuExample />
          <ContentSurroundExample />
          <ContentSearchExample />
          <ContentSearchButtonExample />
          <ContentNavigationExample />
          <ContentTocExample />
          <ToastExample />
          <PaginationExample />
        </VStack>
        <NavigationExample />
    </Section>
    </App>
  );
}
import { ContentNavigationExample } from '../../docs/examples/content-navigation.js';
import { ContentTocExample } from '../../docs/examples/content-toc.js';
import { ToastExample } from '../../docs/examples/toast.js';
