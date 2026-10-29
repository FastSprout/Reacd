import type { Result } from '../../core/result.js';
import type { DataTableController } from '../data-table/controller.types.js';
const READY: Result<void> = { success: true, data: undefined };
export function createTableConnection(controller: DataTableController) {
  let snapshot: Result<void> = READY;
  return {
    snapshot: () => snapshot,
    serverSnapshot: () => READY,
    subscribe: (notify: () => void) => {
      const lease = controller.connect();
      snapshot = lease.success ? READY : lease;
      notify();
      return lease.success ? lease.data : () => undefined;
    },
  };
}
