import { useState, useEffect } from 'react';
import { Message, MessageType } from '../types/Message';
import { messageService } from '../services/messageService';

interface UseMessagesProps {
    filterType?: MessageType;
    filterActive?: boolean;
    applicationName?: string;
}

interface UseMessagesReturn {
    messages: Message[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useMessages = ({ filterType, filterActive, applicationName }: UseMessagesProps): UseMessagesReturn => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            let fetchedMessages: Message[];

            if (filterType) {
                fetchedMessages = await messageService.getMessagesByType(filterType);
            } else if (filterActive !== undefined) {
                fetchedMessages = await messageService.getMessagesByActive(filterActive);
            } else if (applicationName) {
                fetchedMessages = await messageService.getMessagesByApplication(applicationName);
            } else {
                fetchedMessages = await messageService.getAllMessages();
            }

            setMessages(fetchedMessages);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [filterType, filterActive, applicationName]);

    return {
        messages,
        loading,
        error,
        refetch: fetchMessages
    };
};
