import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlatformConnector } from '../../components/platforms/PlatformConnector';
import { renderWithProviders } from '../utils';

describe('Platform Integration', () => {
  it('should render platform connections', async () => {
    renderWithProviders(<PlatformConnector />);
    
    await waitFor(() => {
      expect(screen.getByText('OnlyFans')).toBeInTheDocument();
      expect(screen.getByText('Fansly')).toBeInTheDocument();
    });
  });

  it('should handle Fansly connection', async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();
    
    renderWithProviders(<PlatformConnector onConnect={onConnect} />);

    await user.click(screen.getByRole('button', { name: /connect.*fansly/i }));

    await waitFor(() => {
      expect(window.location.href).toContain('fansly.com/oauth/authorize');
    });
  });

  it('should show OnlyFans manual connection warning', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlatformConnector />);

    await user.click(screen.getByRole('button', { name: /connect.*onlyfans/i }));

    await waitFor(() => {
      expect(screen.getByText(/manual connection required/i)).toBeInTheDocument();
    });
  });
});