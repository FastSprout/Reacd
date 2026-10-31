import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { User } from '../../../components/user/user.js';
import { ProgressGroup } from '../../../components/progress-group/progress-group.js';
import { Banner } from '../../../components/banner/banner.js';

describe('feedback components SSR and hydration', () => {
  it.each(['saas-modern-light', 'erp-compact'])(
    'hydrates identities, segments and controlled actions in %s',
    async (templateId) => {
      const user = userEvent.setup();
      const press = vi.fn();
      const close = vi.fn();
      const content = (
        <ReacdProvider adapter={activeTestAdapter} templateId={templateId}>
          <User
            name="Server identity"
            description="Research engineer"
            avatar={{ fallback: 'SI' }}
            onPress={press}
          />
          <ProgressGroup
            label="Server capacity"
            max={128}
            items={[
              { id: 'apps', label: 'Applications', value: 24 },
              { id: 'documents', label: 'Documents', value: 16 },
            ]}
          />
          <Banner title="Server notice" open onOpenChange={close} dismissible />
        </ReacdProvider>
      );
      const container = document.createElement('div');
      container.innerHTML = renderToString(content);
      document.body.appendChild(container);
      const errors: unknown[] = [];
      const view = render(content, {
        container,
        hydrate: true,
        onRecoverableError: (error) => errors.push(error),
      });
      expect(
        screen.getByRole('progressbar', { name: 'Server capacity' }),
      ).toHaveAttribute('aria-valuenow', '40');
      await user.click(screen.getByRole('button', { name: 'Server identity' }));
      await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
      expect(press).toHaveBeenCalledOnce();
      expect(close).toHaveBeenCalledWith(false);
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
