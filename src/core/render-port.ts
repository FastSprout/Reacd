import type { ReactNode } from 'react';

export type ValidationIssue = {
  path: string;
  message: string;
};

export interface RenderPort<Catalog extends object> {
  render<K extends keyof Catalog>(kind: K, props: Catalog[K]): ReactNode;
  report(issues: readonly ValidationIssue[]): ReactNode;
}
