import { Children } from 'react';
import type {
  PageColumnsProps,
} from '../../../components/page-columns/page-columns.js';

export function ShadcnPageColumns({ children }: PageColumnsProps) {
  return (
    <div className="reacd-node reacd-page-columns">
      {Children.map(Children.toArray(children), (child) => (
        <div className="reacd-page-column-item">{child}</div>
      ))}
    </div>
  );
}
