package com.example.messageapi.controller;

import com.example.messageapi.model.Message;
import com.example.messageapi.model.MessageType;
import com.example.messageapi.service.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MessageControllerTest {

    @Mock
    private MessageService messageService;

    @InjectMocks
    private MessageController messageController;

    private MockMvc mockMvc;

    private Message testMessage1;
    private Message testMessage2;
    private List<Message> testMessages;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(messageController).build();

        testMessage1 = Message.builder()
            .id(1L)
            .active(true)
            .type(MessageType.INFORMATION)
            .applicationName("test-app-1")
            .content("Test message 1")
            .build();

        testMessage2 = Message.builder()
            .id(2L)
            .active(false)
            .type(MessageType.WARNING)
            .applicationName("test-app-2")
            .content("Test message 2")
            .build();

        testMessages = Arrays.asList(testMessage1, testMessage2);
    }

    @Test
    void getAllMessages_ShouldReturnAllMessages() throws Exception {
        // Given
        when(messageService.getAllMessages()).thenReturn(testMessages);

        // When & Then
        mockMvc.perform(get("/api/messages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].type").value("INFORMATION"))
                .andExpect(jsonPath("$[0].applicationName").value("test-app-1"))
                .andExpect(jsonPath("$[0].active").value(true))
                .andExpect(jsonPath("$[0].content").value("Test message 1"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].type").value("WARNING"))
                .andExpect(jsonPath("$[1].applicationName").value("test-app-2"))
                .andExpect(jsonPath("$[1].active").value(false))
                .andExpect(jsonPath("$[1].content").value("Test message 2"));
    }

    @Test
    void getMessageById_ShouldReturnMessage() {
        when(messageService.getMessageById(1L)).thenReturn(testMessage1);
        
        // When & Then
        mockMvc.perform(get("/api/messages/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.type").value("INFORMATION"))
                .andExpect(jsonPath("$.applicationName").value("test-app-1"))
                .andExpect(jsonPath("$.active").value(true))
                .andExpect(jsonPath("$.content").value("Test message 1"));
    }

    @Test
    void getMessagesByActive_ShouldReturnActiveMessages() throws Exception {
        // Given
        when(messageService.getMessagesByActive(true)).thenReturn(Collections.singletonList(testMessage1));

        // When & Then
        mockMvc.perform(get("/api/messages/active/true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].type").value("INFORMATION"))
                .andExpect(jsonPath("$[0].applicationName").value("test-app-1"))
                .andExpect(jsonPath("$[0].active").value(true))
                .andExpect(jsonPath("$[0].content").value("Test message 1"));
    }

    @Test
    void getMessagesByType_ShouldReturnMessagesOfType() throws Exception {
        // Given
        when(messageService.getMessagesByType("INFORMATION")).thenReturn(Collections.singletonList(testMessage1));

        // When & Then
        mockMvc.perform(get("/api/messages/type/INFORMATION"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].type").value("INFORMATION"))
                .andExpect(jsonPath("$[0].applicationName").value("test-app-1"))
                .andExpect(jsonPath("$[0].active").value(true))
                .andExpect(jsonPath("$[0].content").value("Test message 1"));
    }

    @Test
    void getMessagesByApplicationName_ShouldReturnMessagesForApp() throws Exception {
        // Given
        when(messageService.getMessagesByApplicationName("test-app-1")).thenReturn(Collections.singletonList(testMessage1));

        // When & Then
        mockMvc.perform(get("/api/messages/application/test-app-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].type").value("INFORMATION"))
                .andExpect(jsonPath("$[0].applicationName").value("test-app-1"))
                .andExpect(jsonPath("$[0].active").value(true))
                .andExpect(jsonPath("$[0].content").value("Test message 1"));
    }
}
