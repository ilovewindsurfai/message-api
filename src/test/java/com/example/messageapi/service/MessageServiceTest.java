package com.example.messageapi.service;

import com.example.messageapi.model.Message;
import com.example.messageapi.model.MessageType;
import com.example.messageapi.repository.MessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private MessageService messageService;

    private Message testMessage1;
    private Message testMessage2;
    private List<Message> testMessages;

    @BeforeEach
    void setUp() {
        testMessage1 = Message.builder()
                .id(1L)
                .type(MessageType.INFORMATION)
                .applicationName("test-app-1")
                .active(true)
                .content("Test information message")
                .build();

        testMessage2 = Message.builder()
                .id(2L)
                .type(MessageType.WARNING)
                .applicationName("test-app-2")
                .active(false)
                .content("Test warning message")
                .build();

        testMessages = Arrays.asList(testMessage1, testMessage2);
    }

    @Test
    void getAllMessages_ShouldReturnAllMessages() {
        // Given
        when(messageRepository.findAll()).thenReturn(testMessages);

        // When
        List<Message> result = messageService.getAllMessages();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test information message", result.get(0).getContent());
        assertEquals("Test warning message", result.get(1).getContent());
        verify(messageRepository).findAll();
    }

    @Test
    void getMessageById_WhenMessageExists_ShouldReturnMessage() {
        // Given
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage1));

        // When
        Message result = messageService.getMessageById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test information message", result.getContent());
        verify(messageRepository).findById(1L);
    }

    @Test
    void getMessagesByActive_ShouldReturnActiveMessages() {
        // Given
        when(messageRepository.findByActive(true)).thenReturn(Collections.singletonList(testMessage1));

        // When
        List<Message> result = messageService.getMessagesByActive(true);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).isActive());
        assertEquals("Test information message", result.get(0).getContent());
        verify(messageRepository).findByActive(true);
    }

    @Test
    void getMessagesByType_ShouldReturnMessagesOfType() {
        // Given
        when(messageRepository.findByType("INFORMATION")).thenReturn(Collections.singletonList(testMessage1));

        // When
        List<Message> result = messageService.getMessagesByType("INFORMATION");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(MessageType.INFORMATION, result.get(0).getType());
        assertEquals("Test information message", result.get(0).getContent());
        verify(messageRepository).findByType("INFORMATION");
    }

    @Test
    void getMessagesByApplicationName_ShouldReturnMessagesForApp() {
        // Given
        when(messageRepository.findByApplicationName("test-app-1")).thenReturn(Collections.singletonList(testMessage1));

        // When
        List<Message> result = messageService.getMessagesByApplicationName("test-app-1");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("test-app-1", result.get(0).getApplicationName());
        assertEquals("Test information message", result.get(0).getContent());
        verify(messageRepository).findByApplicationName("test-app-1");
    }

    @Test
    void createMessage_ShouldSaveAndReturnMessage() {
        // Given
        Message newMessage = Message.builder()
                .type(MessageType.ERROR)
                .applicationName("test-app-3")
                .active(true)
                .content("Test error message")
                .build();
        
        Message savedMessage = Message.builder()
                .id(3L)
                .type(MessageType.ERROR)
                .applicationName("test-app-3")
                .active(true)
                .content("Test error message")
                .build();

        when(messageRepository.save(any(Message.class))).thenReturn(savedMessage);

        // When
        Message result = messageService.createMessage(newMessage);

        // Then
        assertNotNull(result);
        assertEquals(3L, result.getId());
        assertEquals("Test error message", result.getContent());
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void updateMessage_WhenMessageExists_ShouldUpdateAndReturnMessage() {
        // Given
        Message updateMessage = Message.builder()
                .id(1L)
                .type(MessageType.WARNING)
                .applicationName("updated-app")
                .active(false)
                .content("Updated message content")
                .build();

        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage1));
        when(messageRepository.save(any(Message.class))).thenReturn(updateMessage);

        // When
        Message result = messageService.updateMessage(1L, updateMessage);

        // Then
        assertNotNull(result);
        assertEquals("Updated message content", result.getContent());
        assertEquals("updated-app", result.getApplicationName());
        verify(messageRepository).findById(1L);
        verify(messageRepository).save(any(Message.class));
    }
}
