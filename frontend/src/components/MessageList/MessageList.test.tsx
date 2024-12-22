import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MessageList from './MessageList';
import { useMessages } from '@hooks/useMessages';
import { MessageType } from '@/types/Message';
import '@testing-library/jest-dom';

// Mock the useMessages hook
vi.mock('@hooks/useMessages');

describe('MessageList', () => {
  const mockMessages = [
    {
      id: '1',
      type: 'INFORMATION' as MessageType,
      content: 'Test message 1',
      applicationName: 'Test App 1',
      active: true,
      timestamp: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      type: 'WARNING' as MessageType,
      content: 'Test message 2',
      applicationName: 'Test App 2',
      active: true,
      timestamp: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when loading', () => {
    vi.mocked(useMessages).mockReturnValue({
      messages: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<MessageList filters={{}} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    const errorMessage = 'Failed to fetch messages';
    vi.mocked(useMessages).mockReturnValue({
      messages: [],
      loading: false,
      error: new Error(errorMessage),
      refetch: vi.fn(),
    });

    render(<MessageList filters={{}} />);
    expect(screen.getByText(`Error loading messages: ${errorMessage}`)).toBeInTheDocument();
  });

  it('shows "No messages found" when messages array is empty', () => {
    vi.mocked(useMessages).mockReturnValue({
      messages: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<MessageList filters={{}} />);
    expect(screen.getByText('No messages found')).toBeInTheDocument();
  });

  it('renders messages correctly when data is available', () => {
    vi.mocked(useMessages).mockReturnValue({
      messages: mockMessages,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<MessageList filters={{}} />);
    
    // Check if both messages are rendered
    expect(screen.getByText('Test App 1')).toBeInTheDocument();
    expect(screen.getByText('Test App 2')).toBeInTheDocument();
    expect(screen.getByText('Test message 1')).toBeInTheDocument();
    expect(screen.getByText('Test message 2')).toBeInTheDocument();
  });

  it('passes filters correctly to useMessages hook', () => {
    const filters = {
      type: 'INFORMATION' as MessageType,
      active: true,
      applicationName: 'Test App',
    };

    vi.mocked(useMessages).mockReturnValue({
      messages: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<MessageList filters={filters} />);
    
    expect(useMessages).toHaveBeenCalledWith(expect.objectContaining({
      type: 'INFORMATION',
      active: true,
      applicationName: 'Test App',
    }));
  });
});
