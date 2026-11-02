import { Component } from 'react';
import type { ReactNode } from 'react';
import { Alert } from '@fastsprout/reacd';

interface PreviewBoundaryProps {
  readonly name: string;
  readonly children: ReactNode;
}

export class PreviewBoundary extends Component<
  PreviewBoundaryProps,
  { readonly message: string | null }
> {
  override state: { readonly message: string | null } = { message: null };

  static getDerivedStateFromError(error: unknown) {
    return {
      message: error instanceof Error ? error.message : 'The example could not load.',
    };
  }

  override render(): ReactNode {
    if (this.state.message !== null)
      return (
        <Alert
          intent="error"
          title={`Cannot render ${this.props.name}`}
          message={this.state.message}
        />
      );
    return this.props.children;
  }
}
