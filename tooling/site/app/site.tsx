import { useEffect, useMemo } from 'react';
import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  ContentSearch,
  ContentSearchButton,
  Footer,
  Header,
  Link,
  Main,
  NavigationMenu,
  ReacdProvider,
  Text,
  Theme,
  Toolbar,
  Viewport,
} from '@fastsprout/reacd';
import type { SiteActions, SitePayload } from './model.js';
import { DocumentationArticle } from './article.js';
import { DocumentationNavigation } from './navigation.js';
import { SiteHome } from './home.js';
import { searchGroups, sectionLinks } from '../navigation.js';
import {
  DEFAULT_DESIGN_PREFERENCES,
  parseDesignPreferences,
  resolveDesignTemplate,
} from '../design/preferences.js';
import { ThemeCustomizer } from './theme/theme-customizer.js';
import { ThemePresets } from './theme/theme-presets.js';
import type { DesignPreferences } from '../design/preferences.js';

const appearanceAtom = atom<'light' | 'dark'>('light');
const designAtom = atom(DEFAULT_DESIGN_PREFERENCES);
const restoredActionsAtom = atom<SiteActions | null>(null);
const compactAtom = atom(false);
const searchOpenAtom = atom(false);
const searchQueryAtom = atom('');
const menuOpenAtom = atom(false);
const links = [
  { key: 'docs', label: 'Documentation', href: '/getting-started/' },
  { key: 'components', label: 'Components', href: '/components/' },
  { key: 'examples', label: 'Examples', href: '/examples/' },
];

function SiteView({
  payload,
  actions,
}: {
  readonly payload: SitePayload;
  readonly actions: SiteActions;
}) {
  const [appearance, setAppearance] = useAtom(appearanceAtom);
  const [compact, setCompact] = useAtom(compactAtom);
  const [design, setDesign] = useAtom(designAtom);
  const [restoredActions, setRestoredActions] = useAtom(restoredActionsAtom);
  const [searchOpen, setSearchOpen] = useAtom(searchOpenAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [menuOpen, setMenuOpen] = useAtom(menuOpenAtom);
  useEffect(() => {
    setAppearance(actions.readAppearance());
    setDesign(parseDesignPreferences(actions.readDesign?.()));
    setRestoredActions(actions);
  }, [actions, setAppearance, setDesign, setRestoredActions]);
  useEffect(() => {
    if (restoredActions === actions) actions.appearanceReady?.();
  }, [actions, restoredActions, appearance, design]);
  useEffect(
    () =>
      actions.subscribeSearchShortcut?.(() => {
        setSearchOpen((value) => !value);
      }),
    [actions, setSearchOpen],
  );
  const template = useMemo(
    () => resolveDesignTemplate(design, appearance),
    [design, appearance],
  );
  const home = payload.page.route === '/';
  const changeDesign = (next: DesignPreferences) => {
    setDesign(next);
    actions.persistDesign?.(next);
  };
  return (
    <Theme template={template}>
      <App>
        <Viewport compact={compact}>
          <Header
            title="reacd"
            href="/"
            bottom={
              home ? undefined : (
                <NavigationMenu
                  label="Documentation sections"
                  items={sectionLinks(payload.navigation)}
                />
              )
            }
            menu={{
              mode: 'slideover',
              replacesNavigation: true,
              content: (
                <DocumentationNavigation
                  items={payload.navigation}
                  route={payload.page.route}
                />
              ),
              open: menuOpen,
              onOpenChange: setMenuOpen,
              toggleLabel: 'Open navigation',
              closeLabel: 'Close navigation',
            }}
            end={
              <Toolbar label="Documentation actions">
                <ContentSearchButton
                  label="Search documentation"
                  open={searchOpen}
                  onOpenChange={setSearchOpen}
                />
                <ContentSearch
                  title="Search documentation"
                  label="Search documentation"
                  open={searchOpen}
                  onOpenChange={setSearchOpen}
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  groups={searchGroups(payload.index)}
                />
                <ThemeCustomizer
                  preferences={design}
                  onChange={changeDesign}
                />
                <Button
                  label="Toggle dark appearance"
                  leadingIcon="appearance"
                  iconOnly
                  intent="secondary"
                  onPress={() => {
                    const next = appearance === 'light' ? 'dark' : 'light';
                    setAppearance(next);
                    actions.persistAppearance(next);
                  }}
                />
                <Button
                  label="Toggle documentation width"
                  leadingIcon="layout"
                  iconOnly
                  intent="secondary"
                  onPress={() => setCompact(!compact)}
                />
              </Toolbar>
            }
          >
            <NavigationMenu label="Main navigation" items={links} />
          </Header>
          {home ? (
            <Main>
              <SiteHome payload={payload} appearance={appearance} design={template}
                themePicker={<ThemePresets preferences={design}
                  appearance={appearance} onChange={changeDesign} />} />
            </Main>
          ) : (
            <DocumentationArticle
              payload={payload}
              appearance={appearance}
              design={template}
              actions={actions}
            />
          )}
          <Footer
            start={<Text>reacd · Apache-2.0</Text>}
            end={
              <Link
                href="https://github.com/FastSprout/Reacd"
                label="Source on GitHub"
              />
            }
          />
        </Viewport>
      </App>
    </Theme>
  );
}

export function SiteApplication(props: {
  readonly payload: SitePayload;
  readonly actions: SiteActions;
}) {
  return (
    <ReacdProvider>
      <SiteView payload={props.payload} actions={props.actions} />
    </ReacdProvider>
  );
}
