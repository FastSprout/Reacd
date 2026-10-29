import type { TableProps } from '../../../components/table/index.js';
import { TABLE_DEFAULTS as D } from '../../../core/table-policy.js';
import { TableSurface } from '../../../renderer/table/table.renderer.js';
import { ShadcnInteractiveTable } from './interactive-table.js';
import { Button } from '../vendor/ui/button.js';
export function ShadcnTable(props: TableProps) {
  if (props.state === 'loading')
    return <p role="status">{props.loadingMessage ?? D.loadingMessage}</p>;
  if (props.state === 'error') {
    const retry = props.onRetry;
    return (
      <div className="reacd-vstack">
        <p role="alert">{props.errorMessage ?? D.errorMessage}</p>
        {retry === undefined ? null : (
          <Button type="button" className="reacd-button" onClick={() => retry()}>
            {props.retryLabel ?? D.retryLabel}
          </Button>
        )}
      </div>
    );
  }
  return props.mode === 'interactive' ? (
    <ShadcnInteractiveTable {...props} />
  ) : (
    <TableSurface {...props} />
  );
}
