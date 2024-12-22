import React from 'react';
import { Message } from '@types/Message';
import '@components/MessageCard/MessageCard.css';

interface MessageCardProps {
  message: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const getBackgroundColor = (type: string): string => {
    switch (type) {
      case 'ERROR':
        return 'bg-danger bg-opacity-10';
      case 'WARNING':
        return 'bg-warning bg-opacity-10';
      case 'INFORMATION':
        return 'bg-info bg-opacity-10';
      case 'SUCCESS':
        return 'bg-success bg-opacity-10';
      default:
        return 'bg-light';
    }
  };

  const getTextColor = (type: string): string => {
    switch (type) {
      case 'ERROR':
        return 'text-danger';
      case 'WARNING':
        return 'text-warning';
      case 'INFORMATION':
        return 'text-info';
      case 'SUCCESS':
        return 'text-success';
      default:
        return 'text-dark';
    }
  };

  const getBadgeColor = (type: string): string => {
    switch (type) {
      case 'ERROR':
        return 'badge-danger';
      case 'WARNING':
        return 'badge-warning';
      case 'INFORMATION':
        return 'badge-info';
      case 'SUCCESS':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className={`card mb-3 ${getBackgroundColor(message.type)} ${!message.active ? 'd-none' : ''}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className={`card-title ${getTextColor(message.type)}`}>
            {message.applicationName}
          </h5>
          <div>
            <span className={`badge ${getBadgeColor(message.type)} me-2`}>
              {message.type}
            </span>
            <span className={`badge ${message.active ? 'badge-success' : 'badge-secondary'}`}>
              {message.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <p className="card-text mt-2">{message.content}</p>
        <small className="text-muted">
          ID: {message.id}
        </small>
      </div>
    </div>
  );
};

export default MessageCard;
