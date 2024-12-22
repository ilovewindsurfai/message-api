import React from 'react';
import { Message } from '../../types/Message';
import { useMessageStyle } from '../../hooks/useMessageStyle';
import './MessageCard.css';

interface MessageCardProps {
    message: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
    const { icon } = useMessageStyle(message.type);

    return (
        <div className={`message-card ${message.type.toLowerCase()} ${!message.active ? 'inactive' : ''}`}>
            <div className="message-header">
                <span className="message-type">
                    {icon} {message.type}
                </span>
                <span className={`message-status ${message.active ? 'active' : 'inactive'}`}>
                    {message.active ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div className="message-content">
                <h3 className="message-app">{message.applicationName}</h3>
                <p className="message-text">{message.content}</p>
                <span className="message-id">ID: {message.id}</span>
            </div>
        </div>
    );
};

export default MessageCard;
