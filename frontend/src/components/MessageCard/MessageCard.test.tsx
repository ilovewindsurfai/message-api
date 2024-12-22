import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MessageCard from './MessageCard';

describe('MessageCard', () => {
  const mockMessage = {
    id: '1',
    type: 'INFORMATION' as const,
    content: 'Test message content',
    applicationName: 'Test App',
    active: true,
    timestamp: new Date().toISOString()
  };

  it('renders message content correctly', () => {
    render(<MessageCard message={mockMessage} />);
    
    expect(screen.getByText(mockMessage.content)).toBeInTheDocument();
    expect(screen.getByText(mockMessage.applicationName)).toBeInTheDocument();
    expect(screen.getByText(mockMessage.type)).toBeInTheDocument();
  });

  it('shows active status badge', () => {
    render(<MessageCard message={mockMessage} />);
    
    const statusBadge = screen.getByText('Active');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('badge-success');
  });

  it('shows inactive status badge', () => {
    const inactiveMessage = { ...mockMessage, active: false };
    render(<MessageCard message={inactiveMessage} />);
    
    const statusBadge = screen.getByText('Inactive');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('badge-secondary');
  });

  it('applies correct color class based on message type', () => {
    render(<MessageCard message={mockMessage} />);
    
    const messageContent = screen.getByText(mockMessage.content);
    expect(messageContent).toHaveClass('text-primary');
  });
});
