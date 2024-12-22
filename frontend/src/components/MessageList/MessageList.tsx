import React from 'react';
import { MessageType } from '../../types/Message';
import MessageCard from '../MessageCard/MessageCard';
import { useMessages } from '../../hooks/useMessages';
import './MessageList.css';

interface MessageListProps {
    filterType?: MessageType;
    filterActive?: boolean;
    applicationName?: string;
}

const MessageList: React.FC<MessageListProps> = ({ filterType, filterActive, applicationName }) => {
    const { messages, loading, error } = useMessages({
        filterType,
        filterActive,
        applicationName
    });

    if (loading) {
        return <div className="message-list-loading">Loading messages...</div>;
    }

    if (error) {
        return <div className="message-list-error">Error: {error}</div>;
    }

    if (messages.length === 0) {
        return <div className="message-list-empty">No messages found</div>;
    }

    return (
        <div className="message-list">
            {messages.map((message) => (
                <MessageCard key={message.id} message={message} />
            ))}
        </div>
    );
};

export default MessageList;
