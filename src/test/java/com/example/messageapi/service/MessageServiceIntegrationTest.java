package com.example.messageapi.service;

import com.example.messageapi.model.Message;
import com.example.messageapi.model.MessageType;
import com.example.messageapi.repository.MessageRepository;
import com.github.database.rider.core.api.dataset.DataSet;
import com.github.database.rider.core.api.dataset.ExpectedDataSet;
import com.github.database.rider.spring.api.DBRider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@DBRider
//Sql(scripts = "/sql/cleanup.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
class MessageServiceIntegrationTest {

    @Autowired
    private MessageService messageService;

    @Autowired
    private MessageRepository messageRepository;

    @Test
    @DataSet("datasets/two-messages.yml")
    void getAllMessages_ShouldReturnAllMessages() {
        // When
        List<Message> messages = messageService.getAllMessages();

        // Then
        assertEquals(2, messages.size());
        assertTrue(messages.stream().anyMatch(m -> m.getApplicationName().equals("test-app-1")));
        assertTrue(messages.stream().anyMatch(m -> m.getApplicationName().equals("test-app-2")));
    }

    @Test
    @DataSet("datasets/messages-with-different-active-status.yml")
    void getMessagesByActive_ShouldReturnActiveMessages() {
        // When
        List<Message> activeMessages = messageService.getMessagesByActive(true);

        // Then
        assertEquals(1, activeMessages.size());
        assertTrue(activeMessages.get(0).isActive());
        assertEquals("test-app-1", activeMessages.get(0).getApplicationName());
    }

    @Test
    @DataSet("datasets/messages-with-different-types.yml")
    void getMessagesByType_ShouldReturnMessagesOfType() {
        // When
        List<Message> informationMessages = messageService.getMessagesByType(MessageType.INFORMATION.toString());

        // Then
        assertEquals(1, informationMessages.size());
        assertEquals(MessageType.INFORMATION, informationMessages.get(0).getType());
        assertEquals("test-app-1", informationMessages.get(0).getApplicationName());
    }

    @Test
    @DataSet("datasets/messages-with-different-applications.yml")
    void getMessagesByApplicationName_ShouldReturnMessagesForApp() {
        // When
        List<Message> app1Messages = messageService.getMessagesByApplicationName("test-app-1");

        // Then
        assertEquals(1, app1Messages.size());
        assertEquals("test-app-1", app1Messages.get(0).getApplicationName());
    }

    @Test
    @DataSet("datasets/two-messages.yml")
    void getMessageById_WithExistingMessage_ShouldReturnMessage() {
        // When
        Message foundMessage = messageService.getMessageById(1L);

        // Then
        assertNotNull(foundMessage);
        assertEquals(1L, foundMessage.getId());
        assertEquals(MessageType.INFORMATION, foundMessage.getType());
        assertEquals("test-app-1", foundMessage.getApplicationName());
    }

    @Test
    @DataSet("datasets/two-messages.yml")
    void getMessageById_WithNonExistingMessage_ShouldThrowException() {
        // When/Then
        assertThrows(RuntimeException.class, () -> 
            messageService.getMessageById(999L)
        );
    }

    @Test
    @DataSet("datasets/two-messages.yml")
    void getMessagesByType_WithInvalidType_ShouldReturnEmptyList() {
        // When
        List<Message> messages = messageService.getMessagesByType("INVALID_TYPE");

        // Then
        assertTrue(messages.isEmpty());
    }

    @Test
    @DataSet("datasets/two-messages.yml")
    void getMessagesByApplicationName_WithNonExistingApp_ShouldReturnEmptyList() {
        // When
        List<Message> messages = messageService.getMessagesByApplicationName("non-existing-app");

        // Then
        assertTrue(messages.isEmpty());
    }

    @Test
    @DataSet("datasets/messages-with-different-active-status.yml")
    void getMessagesByActive_WithNoActiveMessages_ShouldReturnEmptyList() {
        // When
        List<Message> activeMessages = messageService.getMessagesByActive(false);

        // Then
        assertEquals(1, activeMessages.size());
        assertFalse(activeMessages.get(0).isActive());
    }

    @Test
    @DataSet("datasets/empty.yml")
    void getAllMessages_WithNoMessages_ShouldReturnEmptyList() {
        // When
        List<Message> messages = messageService.getAllMessages();

        // Then
        assertTrue(messages.isEmpty());
    }
}
