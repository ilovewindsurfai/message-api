package com.example.messageapi.repository;

import com.example.messageapi.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByActive(boolean active);
    List<Message> findByType(String type);
    List<Message> findByApplicationName(String applicationName);
}
