import { MessageType } from '../types/Message';

interface MessageStyle {
    icon: string;
}

export const useMessageStyle = (type: MessageType): MessageStyle => {
    switch (type) {
        case 'INFORMATION':
            return {
                icon: '📝'
            };
        case 'WARNING':
            return {
                icon: '⚠️'
            };
        case 'ERROR':
            return {
                icon: '❌'
            };
        default:
            return {
                icon: '❓'
            };
    }
};
