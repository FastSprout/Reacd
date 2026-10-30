import { Component } from 'react';
import type { ReactNode } from 'react';
import { Alert, Link, VStack } from '@fastsprout/reacd';

interface ViewBoundaryProps {
  label: string;
  children: ReactNode;
}
export class ViewBoundary extends Component<ViewBoundaryProps, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render(): ReactNode {
    if (this.state.failed) {
      return (
        <VStack>
          <Alert
            title={`Cannot load ${this.props.label}`}
            intent="error"
            message="Reloading the workspace clears unsaved local changes."
          />
          <Link label="Reload workspace" href="/" />
        </VStack>
      );
    }
    return this.props.children;
  }
}
