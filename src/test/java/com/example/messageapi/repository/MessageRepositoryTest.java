package com.example.messageapi.repository;

import com.example.messageapi.model.Message;
import com.example.messageapi.model.MessageType;
import com.github.database.rider.core.api.dataset.DataSet;
import com.github.database.rider.core.api.dataset.ExpectedDataSet;
import com.github.database.rider.junit5.api.DBRider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@DBRider
class MessageRepositoryTest {

    @Autowired
    private MessageRepository messageRepository;

    @Test
    @DataSet("datasets/two-messages.yml")
    void findAll_ShouldReturnAllMessages() {
        // When
        List<Message> allMessages = messageRepository.findAll();

        // Then
        assertEquals(2, allMessages.size());
        assertTrue(allMessages.stream().anyMatch(m -> m.getApplicationName().equals("test-app-1")));
        assertTrue(allMessages.stream().anyMatch(m -> m.getApplicationName().equals("test-app-2")));
    }

    @Test
    @DataSet("datasets/messages-with-different-active-status.yml")
    void findByActive_ShouldReturnActiveMessages() {
        // When
        List<Message> activeMessages = messageRepository.findByActive(true);

        // Then
        assertEquals(1, activeMessages.size());
        assertTrue(activeMessages.get(0).isActive());
        assertEquals("test-app-1", activeMessages.get(0).getApplicationName());
    }

    @Test
    @DataSet("datasets/messages-with-different-types.yml")
    void findByType_ShouldReturnMessagesOfType() {
        // When
        List<Message> informationMessages = messageRepository.findByType(MessageType.INFORMATION.toString());

        // Then
        assertEquals(1, informationMessages.size());
        assertEquals(MessageType.INFORMATION, informationMessages.get(0).getType());
        assertEquals("test-app-1", informationMessages.get(0).getApplicationName());
    }

    @Test
    @DataSet("datasets/messages-with-different-applications.yml")
    void findByApplicationName_ShouldReturnMessagesForApp() {
        // When
        List<Message> app1Messages = messageRepository.findByApplicationName("test-app-1");

        // Then
        assertEquals(1, app1Messages.size());
        assertEquals("test-app-1", app1Messages.get(0).getApplicationName());
    }

    @Test
    @DataSet("datasets/empty.yml")
    @ExpectedDataSet("datasets/single-message.yml")
    void save_ShouldPersistMessage() {
        // Given
        Message message = Message.builder()
            .id(1L)
            .active(true)
            .type(MessageType.INFORMATION)
            .applicationName("test-app")
            .build();

        // When
        messageRepository.save(message);

        // Then
        // DBRider will verify the database state matches single-message.yml
    }

    @Test
    @DataSet("datasets/empty.yml")
    void findByActive_WithNoActiveMessages_ShouldReturnEmptyList() {
        // When
        List<Message> activeMessages = messageRepository.findByActive(true);

        // Then
        assertTrue(activeMessages.isEmpty());
    }

    @Test
    @DataSet("datasets/empty.yml")
    void findByType_WithNoMatchingType_ShouldReturnEmptyList() {
        // When
        List<Message> messages = messageRepository.findByType(MessageType.ERROR.toString());

        // Then
        assertTrue(messages.isEmpty());
    }

    @Test
    @DataSet("datasets/empty.yml")
    void findByApplicationName_WithNoMatchingApp_ShouldReturnEmptyList() {
        // When
        List<Message> messages = messageRepository.findByApplicationName("non-existing-app");

        // Then
        assertTrue(messages.isEmpty());
    }
}
