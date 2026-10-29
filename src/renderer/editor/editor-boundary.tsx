import { Component } from 'react';
import type { ReactNode } from 'react';
import { EDITOR_ERRORS } from '../../core/editor-policy.js';
import { EDITOR_NATIVE_POLICY } from '../../core/editor-native-policy.js';
import { Issues } from '../issues/issues.renderer.js';

export class EditorBoundary extends Component<
  { readonly children: ReactNode },
  { readonly failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? (
      <div className="reacd-node reacd-editor-recovery">
        <Issues issues={[{ path: 'Editor', message: EDITOR_ERRORS.startup }]} />
        <button type="button" className="reacd-button"
          onClick={() => this.setState({ failed: false })}>
          {EDITOR_NATIVE_POLICY.retryLabel}
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
