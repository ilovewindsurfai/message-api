package com.example.messageapi.service;

import com.example.messageapi.model.Message;
import com.example.messageapi.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }
    
    public Message getMessageById(Long id) {
        return messageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));
    }
    
    public List<Message> getMessagesByActive(boolean active) {
        return messageRepository.findByActive(active);
    }
    
    public List<Message> getMessagesByType(String type) {
        return messageRepository.findByType(type);
    }
    
    public List<Message> getMessagesByApplicationName(String applicationName) {
        return messageRepository.findByApplicationName(applicationName);
    }
}
