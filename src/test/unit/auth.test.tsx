import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Auth } from '../../pages/Auth';
import { renderWithProviders } from '../utils';

describe('Auth Component', () => {
  it('should render sign in form', () => {
    renderWithProviders(<Auth />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('should handle sign in submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);

    await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  it('should show error message for invalid credentials', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);

    await user.type(screen.getByPlaceholderText('Enter your email'), 'invalid@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});