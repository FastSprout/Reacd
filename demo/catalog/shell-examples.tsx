import { Section, VStack } from 'reacd';
import { ContainerExample } from '../../docs/examples/container.js';
import { MainExample } from '../../docs/examples/main.js';
import { HeaderExample } from '../../docs/examples/header.js';
import { FooterExample } from '../../docs/examples/footer.js';
import { SeparatorExample } from '../../docs/examples/separator.js';
import { AppExample } from '../../docs/examples/app.js';
import { ErrorExample } from '../../docs/examples/error.js';
import { ThemeExample } from '../../docs/examples/theme.js';

export function ShellExamples() {
  return (
    <Section title="Application shells">
      <VStack>
        <HeaderExample />
        <MainExample />
        <ContainerExample />
        <SeparatorExample />
        <FooterExample />
        <AppExample />
        <ThemeExample />
        <ErrorExample />
      </VStack>
    </Section>
  );
}
