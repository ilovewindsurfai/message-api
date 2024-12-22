import { describe, it, expect, vi, beforeEach } from 'vitest';
import messageService from './messageService';
import httpService from './httpService';

vi.mock('./httpService', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('messageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMessages', () => {
    it('calls httpService.get with correct parameters', async () => {
      const mockMessages = [
        {
          id: '1',
          type: 'INFORMATION',
          content: 'Test message',
          applicationName: 'Test App',
          active: true,
          timestamp: new Date().toISOString(),
        },
      ];

      vi.mocked(httpService.get).mockResolvedValueOnce(mockMessages);

      const filters = {
        type: 'INFORMATION' as const,
        active: true,
        applicationName: 'Test App',
      };

      const result = await messageService.getMessages(filters);

      expect(httpService.get).toHaveBeenCalledWith('/messages', expect.any(URLSearchParams));
      expect(result).toEqual(mockMessages);
    });
  });

  describe('createMessage', () => {
    it('calls httpService.post with correct parameters', async () => {
      const newMessage = {
        type: 'INFORMATION' as const,
        content: 'New message',
        applicationName: 'Test App',
        active: true,
        timestamp: new Date().toISOString(),
      };

      const mockResponse = { ...newMessage, id: '1' };
      vi.mocked(httpService.post).mockResolvedValueOnce(mockResponse);

      const result = await messageService.createMessage(newMessage);

      expect(httpService.post).toHaveBeenCalledWith('/messages', newMessage);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateMessage', () => {
    it('calls httpService.put with correct parameters', async () => {
      const id = '1';
      const updateData = {
        content: 'Updated message',
        active: false,
      };

      const mockResponse = {
        id,
        type: 'INFORMATION',
        content: 'Updated message',
        applicationName: 'Test App',
        active: false,
        timestamp: new Date().toISOString(),
      };

      vi.mocked(httpService.put).mockResolvedValueOnce(mockResponse);

      const result = await messageService.updateMessage(id, updateData);

      expect(httpService.put).toHaveBeenCalledWith(`/messages/${id}`, updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteMessage', () => {
    it('calls httpService.delete with correct parameters', async () => {
      const id = '1';
      vi.mocked(httpService.delete).mockResolvedValueOnce(undefined);

      await messageService.deleteMessage(id);

      expect(httpService.delete).toHaveBeenCalledWith(`/messages/${id}`);
    });
  });
});
