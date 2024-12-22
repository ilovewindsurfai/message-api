import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MessageFilters from './MessageFilters';
import { MessageType } from '@/types/Message';

describe('MessageFilters', () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter inputs', () => {
    render(
      <MessageFilters
        filters={{}}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Check if all filter inputs are rendered
    expect(screen.getByLabelText(/Message Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Active Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Application Name/i)).toBeInTheDocument();
  });

  it('calls onFilterChange when message type is selected', () => {
    render(
      <MessageFilters
        filters={{}}
        onFilterChange={mockOnFilterChange}
      />
    );

    const typeSelect = screen.getByLabelText(/Message Type/i);
    fireEvent.change(typeSelect, { target: { value: 'INFORMATION' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'INFORMATION'
      })
    );
  });

  it('calls onFilterChange when active status is changed', () => {
    render(
      <MessageFilters
        filters={{}}
        onFilterChange={mockOnFilterChange}
      />
    );

    const activeSelect = screen.getByLabelText(/Active Status/i);
    fireEvent.change(activeSelect, { target: { value: 'true' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        active: true
      })
    );
  });

  it('calls onFilterChange when application name is entered', () => {
    render(
      <MessageFilters
        filters={{}}
        onFilterChange={mockOnFilterChange}
      />
    );

    const appNameInput = screen.getByLabelText(/Application Name/i);
    fireEvent.change(appNameInput, { target: { value: 'Test App' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationName: 'Test App'
      })
    );
  });

  it('displays current filter values', () => {
    const currentFilters = {
      type: 'WARNING' as MessageType,
      active: true,
      applicationName: 'Test Application'
    };

    render(
      <MessageFilters
        filters={currentFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByLabelText(/Message Type/i)).toHaveValue('WARNING');
    expect(screen.getByLabelText(/Active Status/i)).toHaveValue('true');
    expect(screen.getByLabelText(/Application Name/i)).toHaveValue('Test Application');
  });

  it('maintains other filter values when one filter changes', () => {
    const initialFilters = {
      type: 'WARNING' as MessageType,
      active: true,
      applicationName: 'Test App'
    };

    render(
      <MessageFilters
        filters={initialFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    const typeSelect = screen.getByLabelText(/Message Type/i);
    fireEvent.change(typeSelect, { target: { value: 'INFORMATION' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      type: 'INFORMATION',
      active: true,
      applicationName: 'Test App'
    });
  });

  it('handles clearing filters', () => {
    const initialFilters = {
      type: 'WARNING' as MessageType,
      active: true,
      applicationName: 'Test App'
    };

    render(
      <MessageFilters
        filters={initialFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Clear message type
    const typeSelect = screen.getByLabelText(/Message Type/i);
    fireEvent.change(typeSelect, { target: { value: '' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: undefined,
        active: true,
        applicationName: 'Test App'
      })
    );
  });
});
