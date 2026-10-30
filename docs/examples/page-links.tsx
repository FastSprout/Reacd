import { PageLinks, Text } from '@fastsprout/reacd';

export function PageLinksExample() {
  return (
    <PageLinks
      label="Page link reference"
      title="Reference destinations"
      links={[
        {
          key: 'overview',
          label: 'Return to the running overview',
          href: '/',
          leading: <Text>Local reference</Text>,
        },
        {
          key: 'react',
          label: 'Read React documentation',
          href: 'https://react.dev',
          newWindow: true,
        },
      ]}
    />
  );
}
