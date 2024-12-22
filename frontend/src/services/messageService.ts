import { Message, MessageType } from '@types/Message';
import httpService from '@services/httpService';

interface MessageFilters {
    type?: MessageType;
    active?: boolean;
    applicationName?: string;
}

const messageService = {
    async getMessages(filters: MessageFilters = {}): Promise<Message[]> {
        const params = new URLSearchParams();
        
        if (filters.type) {
            params.append('type', filters.type);
        }
        if (filters.active !== undefined) {
            params.append('active', filters.active.toString());
        }
        if (filters.applicationName) {
            params.append('applicationName', filters.applicationName);
        }

        return httpService.get<Message[]>('/messages', params);
    },

    async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
        return httpService.post<Message>('/messages', message);
    },

    async updateMessage(id: string, message: Partial<Message>): Promise<Message> {
        return httpService.put<Message>(`/messages/${id}`, message);
    },

    async deleteMessage(id: string): Promise<void> {
        return httpService.delete<void>(`/messages/${id}`);
    }
};

export default messageService;
