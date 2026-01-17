import { useState, useEffect, useCallback } from 'react';

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body: unknown;
  timestamp: number;
}

const QUEUE_STORAGE_KEY = 'offline_request_queue';

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueuedRequest[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load queue from localStorage on mount
  useEffect(() => {
    const storedQueue = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (storedQueue) {
      try {
        setQueue(JSON.parse(storedQueue));
      } catch (e) {
        console.error('Failed to parse offline queue:', e);
      }
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  }, [queue]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add request to queue
  const addToQueue = useCallback((url: string, method: string, body: unknown) => {
    const request: QueuedRequest = {
      id: Math.random().toString(36).substring(7),
      url,
      method,
      body,
      timestamp: Date.now(),
    };
    setQueue(prev => [...prev, request]);
    return request.id;
  }, []);

  // Remove request from queue
  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(req => req.id !== id));
  }, []);

  // Process queue when online
  const processQueue = useCallback(async () => {
    if (!isOnline || queue.length === 0 || isProcessing) {
      return;
    }

    setIsProcessing(true);
    const processedIds: string[] = [];

    for (const request of queue) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request.body),
        });
        processedIds.push(request.id);
      } catch (error) {
        console.error('Failed to process queued request:', error);
        // Stop processing on first failure
        break;
      }
    }

    setQueue(prev => prev.filter(req => !processedIds.includes(req.id)));
    setIsProcessing(false);

    return processedIds.length;
  }, [isOnline, queue, isProcessing]);

  // Auto-process queue when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      processQueue();
    }
  }, [isOnline, queue.length, processQueue]);

  // Fetch with offline support
  const fetchWithOfflineSupport = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!isOnline) {
        // Queue the request for later
        const method = options.method || 'GET';
        if (method !== 'GET') {
          const body = options.body ? JSON.parse(options.body as string) : null;
          addToQueue(url, method, body);
          return { queued: true, message: 'Request queued for when you are back online' };
        }
        throw new Error('Cannot perform GET request while offline');
      }

      // Try the request normally
      return fetch(url, options);
    },
    [isOnline, addToQueue]
  );

  return {
    isOnline,
    queue,
    queueLength: queue.length,
    isProcessing,
    addToQueue,
    removeFromQueue,
    processQueue,
    fetchWithOfflineSupport,
  };
}

export default useOfflineQueue;
