import { useState, useEffect } from 'react';
import { Message, MessageType } from '@types/Message';
import messageService from '@services/messageService';

interface UseMessagesProps {
    type?: MessageType;
    active?: boolean;
    applicationName?: string;
}

export const useMessages = ({ type, active, applicationName }: UseMessagesProps = {}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await messageService.getMessages({ type, active, applicationName });
            setMessages(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [type, active, applicationName]);

    return {
        messages,
        loading,
        error,
        refetch: fetchMessages
    };
};
