import React from 'react';
import { useMessages } from '@hooks/useMessages';
import MessageCard from '@components/MessageCard/MessageCard';
import '@components/MessageList/MessageList.css';
import { MessageType } from '@/types/Message';

interface MessageListProps {
  filters: {
    type?: MessageType;
    active?: boolean;
    applicationName?: string;
  };
}

const MessageList: React.FC<MessageListProps> = ({ filters }) => {
  const { messages, loading, error } = useMessages({
    type: filters.type as MessageType | undefined,
    active: filters.active,
    applicationName: filters.applicationName,
  });

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading messages: {error.message}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No messages found
      </div>
    );
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
