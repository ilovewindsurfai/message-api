package com.example.messageapi.controller;

import com.example.messageapi.model.Message;
import com.example.messageapi.model.MessageType;
import com.example.messageapi.repository.MessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.database.rider.core.api.dataset.DataSet;
import com.github.database.rider.spring.api.DBRider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DBRider
class MessageControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DataSet("datasets/two-messages.yml")
    void getAllMessages_ShouldReturnAllMessages() throws Exception {
        mockMvc.perform(get("/api/messages"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].type").value("INFORMATION"))
            .andExpect(jsonPath("$[0].applicationName").value("test-app-1"))
            .andExpect(jsonPath("$[0].active").value(true))
            .andExpect(jsonPath("$[0].content").value("First test message content"))
            .andExpect(jsonPath("$[1].id").value(2))
            .andExpect(jsonPath("$[1].type").value("WARNING"))
            .andExpect(jsonPath("$[1].applicationName").value("test-app-2"))
            .andExpect(jsonPath("$[1].active").value(true))
            .andExpect(jsonPath("$[1].content").value("Second test message content"));
    }

    @Test
    @DataSet("datasets/messages-with-different-types.yml")
    void getMessagesByType_ShouldReturnMessagesOfType() throws Exception {
        mockMvc.perform(get("/api/messages/type/INFORMATION"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].type").value("INFORMATION"))
            .andExpect(jsonPath("$[0].applicationName").value("test-app-1"))
            .andExpect(jsonPath("$[0].content").value("This is an information message"));
    }

    @Test
    @DataSet("datasets/messages-with-different-active-status.yml")
    void getMessagesByActive_ShouldReturnActiveMessages() throws Exception {
        mockMvc.perform(get("/api/messages/active/true"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].active").value(true))
            .andExpect(jsonPath("$[0].content").value("This is an active message"));
    }

    @Test
    @DataSet("datasets/messages-with-different-applications.yml")
    void getMessagesByApplicationName_ShouldReturnMessagesForApp() throws Exception {
        mockMvc.perform(get("/api/messages/application/test-app-1"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].applicationName").value("test-app-1"))
            .andExpect(jsonPath("$[0].content").value("Message for test-app-1"));
    }

    @Test
    @DataSet("datasets/two-messages.yml")
    void getMessageById_WithExistingMessage_ShouldReturnMessage() throws Exception {
        mockMvc.perform(get("/api/messages/{id}", 1))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.applicationName").value("test-app-1"))
            .andExpect(jsonPath("$.type").value("INFORMATION"))
            .andExpect(jsonPath("$.content").value("First test message content"));
    }

    @Test
    @DataSet("datasets/two-messages.yml")
    void getMessageById_WithNonExistingMessage_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/messages/{id}", 999))
            .andExpect(status().isNotFound());
    }

    @Test
    @DataSet("datasets/empty.yml")
    void getAllMessages_WithNoMessages_ShouldReturnEmptyArray() throws Exception {
        mockMvc.perform(get("/api/messages"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DataSet("datasets/two-messages.yml")
    void getMessagesByType_WithInvalidType_ShouldReturnEmptyArray() throws Exception {
        mockMvc.perform(get("/api/messages/type/INVALID_TYPE"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DataSet("datasets/two-messages.yml")
    void getMessagesByApplicationName_WithNonExistingApp_ShouldReturnEmptyArray() throws Exception {
        mockMvc.perform(get("/api/messages/application/non-existing-app"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DataSet("datasets/messages-with-different-active-status.yml")
    void getMessagesByActive_WithNoActiveMessages_ShouldReturnEmptyArray() throws Exception {
        mockMvc.perform(get("/api/messages/active/false"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].active").value(false))
            .andExpect(jsonPath("$[0].content").value("This is an inactive message"));
    }
}
