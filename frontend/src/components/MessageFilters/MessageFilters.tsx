import React from 'react';
import { MessageType } from '../../types/Message';
import { useMessageFilters } from '../../hooks/useMessageFilters';
import './MessageFilters.css';

interface MessageFiltersProps {
    onFiltersChange: (filters: {
        type?: MessageType;
        active?: boolean;
        applicationName?: string;
    }) => void;
}

const MessageFilters: React.FC<MessageFiltersProps> = ({ onFiltersChange }) => {
    const {
        filters,
        setTypeFilter,
        setActiveFilter,
        setApplicationFilter,
        resetFilters
    } = useMessageFilters();

    const handleTypeChange = (type: MessageType | undefined) => {
        setTypeFilter(type);
        onFiltersChange({ ...filters, type });
    };

    const handleActiveChange = (active: boolean | undefined) => {
        setActiveFilter(active);
        onFiltersChange({ ...filters, active });
    };

    const handleApplicationChange = (applicationName: string | undefined) => {
        setApplicationFilter(applicationName);
        onFiltersChange({ ...filters, applicationName });
    };

    const handleReset = () => {
        resetFilters();
        onFiltersChange({
            type: undefined,
            active: undefined,
            applicationName: undefined
        });
    };

    return (
        <div className="message-filters">
            <div className="filter-group">
                <label>Message Type:</label>
                <select
                    value={filters.type || ''}
                    onChange={(e) => handleTypeChange(e.target.value as MessageType || undefined)}
                >
                    <option value="">All Types</option>
                    <option value="INFORMATION">Information</option>
                    <option value="WARNING">Warning</option>
                    <option value="ERROR">Error</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Status:</label>
                <select
                    value={filters.active === undefined ? '' : String(filters.active)}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleActiveChange(value === '' ? undefined : value === 'true');
                    }}
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Application:</label>
                <input
                    type="text"
                    value={filters.applicationName || ''}
                    onChange={(e) => handleApplicationChange(e.target.value || undefined)}
                    placeholder="Filter by application"
                />
            </div>

            <button className="reset-filters" onClick={handleReset}>
                Reset Filters
            </button>
        </div>
    );
};

export default MessageFilters;
