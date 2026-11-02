import { useMemo } from 'react';
import { atom, useAtom } from 'jotai';
import { ContentNavigation, Input, VStack } from '@fastsprout/reacd';
import type { SiteNavigation } from '../content/model.js';
import {
  currentNavigationKey, expandedNavigation, filterNavigation,
} from '../navigation.js';

const filterAtom = atom('');

export function DocumentationNavigation({
  items,
  route,
}: {
  readonly items: readonly SiteNavigation[];
  readonly route: string;
}) {
  const [query, setQuery] = useAtom(filterAtom);
  const expansion = useMemo(
    () => atom<readonly string[]>(expandedNavigation(items)),
    [items],
  );
  const [expanded, setExpanded] = useAtom(expansion);
  const filtered = filterNavigation(items, query);
  return (
    <VStack>
      <Input label="Filter navigation" value={query} onValueChange={setQuery} />
      <ContentNavigation
        label="Documentation navigation"
        items={filtered}
        currentKey={currentNavigationKey(filtered, route)}
        expandedKeys={query ? expandedNavigation(filtered) : expanded}
        onExpandedKeysChange={setExpanded}
      />
    </VStack>
  );
}
