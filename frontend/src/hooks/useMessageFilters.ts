import { useState, useCallback } from 'react';
import { MessageType } from '../types/Message';

interface UseMessageFiltersReturn {
    filters: {
        type?: MessageType;
        active?: boolean;
        applicationName?: string;
    };
    setTypeFilter: (type: MessageType | undefined) => void;
    setActiveFilter: (active: boolean | undefined) => void;
    setApplicationFilter: (applicationName: string | undefined) => void;
    resetFilters: () => void;
}

export const useMessageFilters = (): UseMessageFiltersReturn => {
    const [filters, setFilters] = useState({
        type: undefined as MessageType | undefined,
        active: undefined as boolean | undefined,
        applicationName: undefined as string | undefined,
    });

    const setTypeFilter = useCallback((type: MessageType | undefined) => {
        setFilters(prev => ({ ...prev, type }));
    }, []);

    const setActiveFilter = useCallback((active: boolean | undefined) => {
        setFilters(prev => ({ ...prev, active }));
    }, []);

    const setApplicationFilter = useCallback((applicationName: string | undefined) => {
        setFilters(prev => ({ ...prev, applicationName }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            type: undefined,
            active: undefined,
            applicationName: undefined,
        });
    }, []);

    return {
        filters,
        setTypeFilter,
        setActiveFilter,
        setApplicationFilter,
        resetFilters,
    };
};
