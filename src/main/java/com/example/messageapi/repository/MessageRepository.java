package com.example.messageapi.repository;

import com.example.messageapi.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByActive(boolean active);
    List<Message> findByType(String type);
    List<Message> findByApplicationName(String applicationName);

    @Query("SELECT m FROM Message m WHERE m.id IN " +
           "(SELECT MAX(m2.id) FROM Message m2 GROUP BY m2.applicationName) " +
           "ORDER BY m.id DESC")
    List<Message> findLastMessagesByApplication();

    @Query(value = "SELECT m.* FROM message m " +
           "INNER JOIN (SELECT application_name, MAX(id) as max_id " +
           "FROM message GROUP BY application_name) latest " +
           "ON m.application_name = latest.application_name " +
           "AND m.id = latest.max_id " +
           "ORDER BY m.id DESC", 
           nativeQuery = true)
    List<Message> findLastMessagesByApplicationNative();
}
