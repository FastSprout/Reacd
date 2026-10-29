import { useContext, useState } from 'react';
import type { ReactNode } from 'react';
import {
  PortalActiveContext,
  PortalHostContext,
} from '../../../renderer/theme/portal-context.js';

export function CarouselPanel({
  children,
  active,
  label,
  index,
}: {
  children: ReactNode;
  active: boolean;
  label: string;
  index: number;
}) {
  const ancestorActive = useContext(PortalActiveContext);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return (
    <fieldset
      className="reacd-carousel-panel"
      data-carousel-index={index}
      disabled={!active}
      hidden={!active}
      inert={!active}
      role="group"
      aria-roledescription="slide"
      aria-label={label}
    >
      <PortalActiveContext.Provider value={ancestorActive && active}>
        <PortalHostContext.Provider value={host}>{children}</PortalHostContext.Provider>
      </PortalActiveContext.Provider>
      <div ref={setHost} className="reacd-carousel-portal-host" />
    </fieldset>
  );
}
