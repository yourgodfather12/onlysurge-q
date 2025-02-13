import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Content } from '../../pages/Content';
import { renderWithProviders } from '../utils';

describe('Content Component', () => {
  it('should render content grid', async () => {
    renderWithProviders(<Content />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Vault')).toBeInTheDocument();
    });
  });

  it('should handle content upload', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Content />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload/i);
    
    await user.upload(input, file);
    await user.type(screen.getByPlaceholderText(/title/i), 'Test Content');
    await user.type(screen.getByPlaceholderText(/description/i), 'Test description');
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByText(/uploaded successfully/i)).toBeInTheDocument();
    });
  });

  it('should analyze content', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Content />);

    await user.click(screen.getByText('Test Content'));
    await user.click(screen.getByRole('button', { name: /analyze/i }));

    await waitFor(() => {
      expect(screen.getByText('AI Analysis')).toBeInTheDocument();
      expect(screen.getByText('Engagement Score')).toBeInTheDocument();
    });
  });
});