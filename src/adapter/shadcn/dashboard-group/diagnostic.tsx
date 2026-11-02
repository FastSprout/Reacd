import { Alert, AlertDescription } from '../vendor/ui/alert.js';
export function DashboardDiagnostic({ message }: { readonly message: string }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
