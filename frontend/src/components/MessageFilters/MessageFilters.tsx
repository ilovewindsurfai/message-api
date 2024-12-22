import React from 'react';
import { useMessageFilters } from '@hooks/useMessageFilters';
import '@components/MessageFilters/MessageFilters.css';
import { MessageType } from '@/types/Message';

interface MessageFiltersProps {
    filters: {
        type?: MessageType;
        active?: boolean;
        applicationName?: string;
    };
    onFilterChange: (newFilters: { type?: MessageType; active?: boolean; applicationName?: string }) => void;
    children?: React.ReactNode;
}

const MessageFilters: React.FC<MessageFiltersProps> = ({ filters, onFilterChange, children }) => {
    const {
        setTypeFilter,
        setActiveFilter,
        setApplicationFilter,
        resetFilters
    } = useMessageFilters();

    const handleTypeChange = (type: MessageType | undefined) => {
        setTypeFilter(type);
        onFilterChange({ ...filters, type });
    };

    const handleActiveChange = (active: boolean | undefined) => {
        setActiveFilter(active);
        onFilterChange({ ...filters, active });
    };

    const handleApplicationChange = (applicationName: string | undefined) => {
        setApplicationFilter(applicationName);
        onFilterChange({ ...filters, applicationName });
    };

    const handleReset = () => {
        resetFilters();
        onFilterChange({
            type: undefined,
            active: undefined,
            applicationName: undefined
        });
    };

    return (
        <form className="message-filters">
            <div className="form-group">
                <label htmlFor="type-filter">Message Type:</label>
                <select
                    id="type-filter"
                    className="form-control"
                    value={filters.type || ''}
                    onChange={(e) => handleTypeChange(e.target.value as MessageType || undefined)}
                >
                    <option value="">All Types</option>
                    <option value="INFORMATION">Information</option>
                    <option value="WARNING">Warning</option>
                    <option value="ERROR">Error</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="active-filter">Status:</label>
                <select
                    id="active-filter"
                    className="form-control"
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

            <div className="form-group">
                <label htmlFor="application-filter">Application:</label>
                <input
                    type="text"
                    id="application-filter"
                    className="form-control"
                    placeholder="Filter by application"
                    value={filters.applicationName || ''}
                    onChange={(e) => handleApplicationChange(e.target.value || undefined)}
                />
            </div>

            <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={handleReset}
            >
                Reset Filters
            </button>
            {children}
        </form>
    );
};

export default MessageFilters;
