import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiCard } from './card.adapter.js';
it('composes Material Card content and actions without a common painter', () => {
  render(
    <MuiCard
      label="Profile"
      header={<Typography>Header</Typography>}
      footer={<Typography>Actions</Typography>}
    >
      <Typography>Body</Typography>
    </MuiCard>,
  );
  expect(screen.getByRole('region', { name: 'Profile' }).className).toContain(
    'MuiCard-root',
  );
  expect(screen.getByText('Body').closest('.MuiCardContent-root')).not.toBeNull();
  expect(screen.getByText('Actions').closest('.MuiCardActions-root')).not.toBeNull();
});

it('renders the native content surface without optional regions', () => {
  render(
    <MuiCard>
      <Typography>Only body</Typography>
    </MuiCard>,
  );
  expect(screen.getByText('Only body').closest('.MuiCard-root')).not.toBeNull();
});
