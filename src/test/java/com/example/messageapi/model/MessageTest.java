package com.example.messageapi.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MessageTest {

    @Test
    void testMessageCreation() {
        Message message = new Message();
        message.setId(1L);
        message.setActive(true);
        message.setType(MessageType.INFORMATION);
        message.setApplicationName("test-app");

        assertEquals(1L, message.getId());
        assertTrue(message.isActive());
        assertEquals(MessageType.INFORMATION, message.getType());
        assertEquals("test-app", message.getApplicationName());
    }

    @Test
    void testMessageTypeValues() {
        // Test all enum values are available
        assertNotNull(MessageType.INFORMATION);
        assertNotNull(MessageType.ERROR);
        assertNotNull(MessageType.WARNING);
    }

    @Test
    void testMessageEquality() {
        Message message1 = new Message();
        message1.setId(1L);
        message1.setActive(true);
        message1.setType(MessageType.ERROR);
        message1.setApplicationName("test-app");

        Message message2 = new Message();
        message2.setId(1L);
        message2.setActive(true);
        message2.setType(MessageType.ERROR);
        message2.setApplicationName("test-app");

        assertEquals(message1, message2);
        assertEquals(message1.hashCode(), message2.hashCode());
    }

    @Test
    void testMessageInequality() {
        Message message1 = new Message();
        message1.setId(1L);
        message1.setType(MessageType.ERROR);
        message1.setApplicationName("test-app-1");

        Message message2 = new Message();
        message2.setId(2L);
        message2.setType(MessageType.WARNING);
        message2.setApplicationName("test-app-2");

        assertNotEquals(message1, message2);
    }
}
