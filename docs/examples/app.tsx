import { App, Container, Main, Text } from '@fastsprout/reacd';

export function AppExample() {
  return (
    <App language="en" direction="ltr">
      <Main>
        <Container>
          <Text>Application content</Text>
        </Container>
      </Main>
    </App>
  );
}
