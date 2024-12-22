export type MessageType = 'INFORMATION' | 'WARNING' | 'ERROR';

export interface Message {
    id: number;
    type: MessageType;
    applicationName: string;
    active: boolean;
    content: string;
}
