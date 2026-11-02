import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import {
  Button,
  ReacdProvider,
  Text,
  VStack,
  createReacdStore,
} from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { AppearancePreview } from './appearance-preview.js';
import { templateAtom } from '../../src/state/theme/template.atom.js';

it.each(['saas-modern-light', 'erp-compact'] as const)(
  'keeps the %s token profile while switching palette',
  async (templateId) => {
    const user = userEvent.setup();
    const store = createReacdStore();
    store.set(templateAtom, templateId);
    function Preview() {
      return (
        <AppearancePreview>
          {({ resolvedMode, setValue }) => (
            <VStack>
              <Button label="Dark palette" onPress={() => setValue('dark')} />
              <Text>{resolvedMode}</Text>
            </VStack>
          )}
        </AppearancePreview>
      );
    }
    render(
      <ReacdProvider adapter={shadcnAdapter} templateId={templateId} store={store}>
        <Preview />
      </ReacdProvider>,
    );
    expect(screen.getByText('light')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Dark palette' }));
    expect(screen.getByText('dark')).toBeVisible();
  },
);
