import { useState } from 'react';
import type { DashboardSearchProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-search/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { COMMAND_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/command-policy.js';
import { SharedModal } from '../modal/modal.adapter.js';
import { SharedCommandPalette } from '../command-palette/command-palette.adapter.js';

export function SharedDashboardSearch({
  open,
  onOpenChange,
  title = DASHBOARD_DEFAULTS.searchLabel,
  description = DASHBOARD_DEFAULTS.searchDescription,
  onSelect,
  onQueryChange,
  ...palette
}: DashboardSearchProps) {
  const [invalidSelection, setInvalidSelection] = useState(false);
  return (
    <SharedModal
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      retainContent
    >
      {invalidSelection && <p role="alert">{COMMAND_DEFAULTS.invalidSelection}</p>}
      <SharedCommandPalette
        {...palette}
        onQueryChange={(query) => {
          setInvalidSelection(false);
          onQueryChange(query);
        }}
        onSelect={(key) => {
          const accepted: unknown = onSelect?.(key);
          if (accepted === false) return false;
          if (accepted !== undefined && accepted !== true) {
            setInvalidSelection(true);
            return false;
          }
          setInvalidSelection(false);
          onOpenChange(false);
          return true;
        }}
      />
    </SharedModal>
  );
}
