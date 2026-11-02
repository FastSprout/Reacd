import { Component } from 'react';
import type { ReactNode } from 'react';
import {
  Alert,
  Link,
  UnsupportedAdapterComponentError,
  VStack,
} from '@fastsprout/reacd';

interface ViewBoundaryProps {
  label: string;
  children: ReactNode;
}
interface ViewBoundaryState {
  readonly failed: boolean;
  readonly reason: unknown;
}
export class ViewBoundary extends Component<ViewBoundaryProps, ViewBoundaryState> {
  override state: ViewBoundaryState = { failed: false, reason: undefined };
  static getDerivedStateFromError(reason: unknown) {
    return { failed: true, reason };
  }
  override render(): ReactNode {
    if (this.state.failed) {
      const reason = this.state.reason;
      const unsupported = reason instanceof UnsupportedAdapterComponentError;
      return (
        <VStack>
          <Alert
            title={`Cannot load ${this.props.label}`}
            intent="error"
            message={
              unsupported
                ? reason.message
                : 'Reloading the workspace clears unsaved local changes.'
            }
          />
          {!unsupported && <Link label="Reload workspace" href="/" />}
        </VStack>
      );
    }
    return this.props.children;
  }
}
