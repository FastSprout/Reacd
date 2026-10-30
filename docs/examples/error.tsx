import { Error, Text } from '@fastsprout/reacd';

export function ErrorExample() {
  return (
    <Error
      statusCode={404}
      title="Page unavailable"
      message="The requested page could not be found."
      redirect="/"
      recoveryLabel="Return to the catalog"
    >
      <Text>Check the address or return to the component catalog.</Text>
    </Error>
  );
}
