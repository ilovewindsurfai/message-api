package com.example.messageapi.controller;

import com.example.messageapi.model.Message;
import com.example.messageapi.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    
    private final MessageService messageService;
    
    @GetMapping
    public List<Message> getAllMessages() {
        return messageService.getAllMessages();
    }
    
    @GetMapping("/{id}")
    public Message getMessageById(@PathVariable Long id) {
        return messageService.getMessageById(id);
    }
    
    @GetMapping("/active/{active}")
    public List<Message> getMessagesByActive(@PathVariable boolean active) {
        return messageService.getMessagesByActive(active);
    }
    
    @GetMapping("/type/{type}")
    public List<Message> getMessagesByType(@PathVariable String type) {
        return messageService.getMessagesByType(type);
    }
    
    @GetMapping("/application/{applicationName}")
    public List<Message> getMessagesByApplicationName(@PathVariable String applicationName) {
        return messageService.getMessagesByApplicationName(applicationName);
    }
}
