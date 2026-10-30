import { Component } from 'react';
import type { ReactNode } from 'react';
import { Alert } from '@fastsprout/reacd';

interface PreviewBoundaryProps {
  name: string;
  children: ReactNode;
}
export class PreviewBoundary extends Component<
  PreviewBoundaryProps,
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render(): ReactNode {
    if (this.state.failed) {
      return (
        <Alert
          intent="error"
          title={`Cannot load ${this.props.name} example`}
          message="Reload this preview to retry. Unsaved example changes will reset."
        />
      );
    }
    return this.props.children;
  }
}
