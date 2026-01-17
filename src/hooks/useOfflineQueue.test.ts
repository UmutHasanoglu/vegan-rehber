import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOfflineQueue } from './useOfflineQueue';

describe('useOfflineQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset online status
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });
  });

  it('should initialize with empty queue', () => {
    const { result } = renderHook(() => useOfflineQueue());

    expect(result.current.queue).toEqual([]);
    expect(result.current.queueLength).toBe(0);
    expect(result.current.isOnline).toBe(true);
  });

  it('should add request to queue', () => {
    const { result } = renderHook(() => useOfflineQueue());

    act(() => {
      result.current.addToQueue('/api/test', 'POST', { data: 'test' });
    });

    expect(result.current.queueLength).toBe(1);
    expect(result.current.queue[0].url).toBe('/api/test');
    expect(result.current.queue[0].method).toBe('POST');
    expect(result.current.queue[0].body).toEqual({ data: 'test' });
  });

  it('should remove request from queue', () => {
    const { result } = renderHook(() => useOfflineQueue());

    let requestId: string;
    act(() => {
      requestId = result.current.addToQueue('/api/test', 'POST', { data: 'test' });
    });

    expect(result.current.queueLength).toBe(1);

    act(() => {
      result.current.removeFromQueue(requestId);
    });

    expect(result.current.queueLength).toBe(0);
  });

  it('should persist queue to localStorage', () => {
    const { result } = renderHook(() => useOfflineQueue());

    act(() => {
      result.current.addToQueue('/api/test', 'POST', { data: 'test' });
    });

    const stored = localStorage.getItem('offline_request_queue');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].url).toBe('/api/test');
  });

  it('should load queue from localStorage on mount', () => {
    const initialQueue = [
      {
        id: 'test-id',
        url: '/api/test',
        method: 'POST',
        body: { data: 'test' },
        timestamp: Date.now(),
      },
    ];
    localStorage.setItem('offline_request_queue', JSON.stringify(initialQueue));

    const { result } = renderHook(() => useOfflineQueue());

    expect(result.current.queueLength).toBe(1);
    expect(result.current.queue[0].url).toBe('/api/test');
  });
});
