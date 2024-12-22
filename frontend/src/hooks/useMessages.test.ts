import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMessages } from './useMessages';
import messageService from '../services/messageService';

vi.mock('../services/messageService', () => ({
  default: {
    getMessages: vi.fn(),
  },
}));

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches messages on mount', async () => {
    const mockMessages = [
      {
        id: 1,
        type: 'INFORMATION',
        content: 'Test message',
        applicationName: 'Test App',
        active: true,
        timestamp: new Date().toISOString(),
      },
    ];

    vi.mocked(messageService.getMessages).mockResolvedValueOnce(mockMessages);

    const { result } = renderHook(() => useMessages());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for the messages to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.messages).toEqual(mockMessages);
    expect(result.current.error).toBe(null);
    expect(messageService.getMessages).toHaveBeenCalledTimes(1);
  });

  it('handles error when fetching messages fails', async () => {
    const error = new Error('Failed to fetch messages');
    vi.mocked(messageService.getMessages).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useMessages());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for the error to be set
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toEqual(error);
    expect(messageService.getMessages).toHaveBeenCalledTimes(1);
  });

  it('refetches messages when filters change', async () => {
    const mockMessages = [
      {
        id: 1,
        type: 'INFORMATION',
        content: 'Test message',
        applicationName: 'Test App',
        active: true,
        timestamp: new Date().toISOString(),
      },
    ];

    vi.mocked(messageService.getMessages).mockResolvedValue(mockMessages);

    interface UseMessagesProps {
      type: 'INFORMATION' | 'ERROR' | 'WARNING'; // Adjust based on your actual types
    }
    const { result, rerender } = renderHook(
      (props: UseMessagesProps) => useMessages(props),
      {
        initialProps: { type: 'INFORMATION' as const },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Rerender with new filters
    rerender({ type: 'WARNING' as const });

    await waitFor(() => {
      expect(messageService.getMessages).toHaveBeenCalledTimes(2);
    });

    expect(messageService.getMessages).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'WARNING' })
    );
  });
});
