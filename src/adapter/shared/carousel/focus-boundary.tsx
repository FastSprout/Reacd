import { Component, createRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
interface FocusProps {
  children: ReactNode;
  label: string;
  value: number;
  activeKey: string;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}
export class CarouselFocusBoundary extends Component<
  FocusProps,
  Record<string, never>,
  boolean
> {
  readonly container = createRef<HTMLDivElement>();
  override getSnapshotBeforeUpdate(previous: Readonly<FocusProps>): boolean {
    const root = this.container.current;
    if (previous.activeKey === this.props.activeKey || root === null) return false;
    const panel = root.querySelector(`[data-carousel-index="${previous.value}"]`);
    return panel !== null && panel.contains(root.ownerDocument.activeElement);
  }
  override componentDidUpdate(
    _previous: Readonly<FocusProps>,
    _state: Readonly<Record<string, never>>,
    repair: boolean,
  ): void {
    if (repair) this.container.current?.focus();
  }
  override render(): ReactNode {
    return (
      <div
        ref={this.container}
        className="reacd-node reacd-carousel"
        role="region"
        aria-label={this.props.label}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={this.props.onKeyDown}
      >
        {this.props.children}
      </div>
    );
  }
}
