import { Link, PageHeader, Text } from '@fastsprout/reacd';

export function PageHeaderExample() {
  return (
    <PageHeader
      headline="Component reference"
      title="PageHeader introduction"
      description="A closed title, supporting text and independently operable links."
      links={<Link label="Return to reference overview" href="/" />}
    >
      <Text>Supporting content follows the generated heading.</Text>
    </PageHeader>
  );
}
