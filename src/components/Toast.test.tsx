import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';

// Test component that uses the toast
const TestComponent = () => {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('Test message', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error
      </button>
      <button onClick={() => showToast('Warning message', 'warning')}>
        Show Warning
      </button>
      <button onClick={() => showToast('Info message', 'info')}>
        Show Info
      </button>
    </div>
  );
};

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render toast on showToast call', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success'));

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should auto-remove toast after 4 seconds', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success'));
    expect(screen.getByText('Test message')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should allow manual dismiss', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success'));
    expect(screen.getByText('Test message')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Bildirimi kapat');
    await user.click(closeButton);

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should display multiple toasts', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success'));
    await user.click(screen.getByText('Show Error'));

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
