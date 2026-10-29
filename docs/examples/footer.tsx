import { Footer, Text } from 'reacd';

export function FooterExample() {
  return (
    <Footer
      start={<Text>reacd</Text>}
      end={<Text>Local preview</Text>}
      top={<Text>Footer context</Text>}
      bottom={<Text>All data stays local.</Text>}
    >
      <Text>Application footer</Text>
    </Footer>
  );
}
