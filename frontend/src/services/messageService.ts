import { Message, MessageType } from '../types/Message';

const API_BASE_URL = 'http://localhost:8080/api';

export const messageService = {
    getAllMessages: async (): Promise<Message[]> => {
        const response = await fetch(`${API_BASE_URL}/messages`);
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        return response.json();
    },

    getMessagesByType: async (type: MessageType): Promise<Message[]> => {
        const response = await fetch(`${API_BASE_URL}/messages/type/${type}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch messages of type ${type}`);
        }
        return response.json();
    },

    getMessagesByActive: async (active: boolean): Promise<Message[]> => {
        const response = await fetch(`${API_BASE_URL}/messages/active/${active}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${active ? 'active' : 'inactive'} messages`);
        }
        return response.json();
    },

    getMessagesByApplication: async (applicationName: string): Promise<Message[]> => {
        const response = await fetch(`${API_BASE_URL}/messages/application/${applicationName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch messages for application ${applicationName}`);
        }
        return response.json();
    }
};
