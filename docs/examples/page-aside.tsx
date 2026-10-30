import { PageAside, Link, Text } from '@fastsprout/reacd';

export function PageAsideExample() {
  return (
    <PageAside
      label="Page composition navigation"
      top={<Text weight="bold">This reference</Text>}
      bottom={<Text>Navigation stays available on narrow screens.</Text>}
    >
      <Link label="Return to page overview" href="/" />
    </PageAside>
  );
}
