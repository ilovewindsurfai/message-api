package com.example.messageapi.cucumber;

import com.example.messageapi.model.Message;
import com.example.messageapi.model.MessageType;
import com.example.messageapi.repository.MessageRepository;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class MessageStepDefinitions {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private MessageRepository messageRepository;

    private ResponseEntity<Message[]> response;
    private ResponseEntity<Message> singleResponse;
    private String baseUrl;

    @Before
    public void setup() {
        baseUrl = String.format("http://localhost:%d/api/messages", port);
    }

    @Given("the message database is empty")
    public void theMessageDatabaseIsEmpty() {
        messageRepository.deleteAll();
    }

    @Given("the following messages exist:")
    public void theFollowingMessagesExist(DataTable dataTable) {
        List<Map<String, String>> messages = dataTable.asMaps();
        messages.forEach(msg -> {
            Message message = Message.builder()
                    .type(MessageType.valueOf(msg.get("type")))
                    .applicationName(msg.get("applicationName"))
                    .active(Boolean.parseBoolean(msg.get("active")))
                    .content(msg.get("content"))
                    .build();
            messageRepository.save(message);
        });
    }

    @When("I request all messages")
    public void iRequestAllMessages() {
        response = restTemplate.getForEntity(baseUrl, Message[].class);
    }

    @When("I request messages with active status {string}")
    public void iRequestMessagesWithActiveStatus(String active) {
        response = restTemplate.getForEntity(
                baseUrl + "/active/" + active,
                Message[].class
        );
    }

    @When("I request messages with type {string}")
    public void iRequestMessagesWithType(String type) {
        response = restTemplate.getForEntity(
                baseUrl + "/type/" + type,
                Message[].class
        );
    }

    @When("I request messages for application {string}")
    public void iRequestMessagesForApplication(String applicationName) {
        response = restTemplate.getForEntity(
                baseUrl + "/application/" + applicationName,
                Message[].class
        );
    }

    @When("I request the message with ID {long}")
    public void iRequestTheMessageWithId(Long id) {
        singleResponse = restTemplate.getForEntity(
                baseUrl + "/" + id,
                Message.class
        );
    }

    @Then("I should receive an empty list of messages")
    public void iShouldReceiveAnEmptyListOfMessages() {
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().length);
    }

    @Then("I should receive {int} message(s)")
    public void iShouldReceiveMessages(int count) {
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(count, response.getBody().length);
    }

    @Then("the response should include a message with:")
    public void theResponseShouldIncludeAMessageWith(DataTable dataTable) {
        Map<String, String> expectedFields = dataTable.asMap();
        Message[] messages = response.getBody();
        assertNotNull(messages);
        assertTrue(messages.length > 0);

        boolean found = false;
        for (Message message : messages) {
            if (matchesExpectedFields(message, expectedFields)) {
                found = true;
                break;
            }
        }
        assertTrue(found, "No message found matching the expected fields");
    }

    @Then("I should receive a message with:")
    public void iShouldReceiveAMessageWith(DataTable dataTable) {
        Map<String, String> expectedFields = dataTable.asMap();
        assertEquals(HttpStatus.OK, singleResponse.getStatusCode());
        Message message = singleResponse.getBody();
        assertNotNull(message);
        assertTrue(matchesExpectedFields(message, expectedFields));
    }

    @Then("I should receive a not found error")
    public void iShouldReceiveANotFoundError() {
        assertEquals(HttpStatus.NOT_FOUND, singleResponse.getStatusCode());
    }

    private boolean matchesExpectedFields(Message message, Map<String, String> expectedFields) {
        return expectedFields.entrySet().stream().allMatch(entry -> {
            switch (entry.getKey()) {
                case "type":
                    return message.getType().toString().equals(entry.getValue());
                case "applicationName":
                    return message.getApplicationName().equals(entry.getValue());
                case "active":
                    return String.valueOf(message.isActive()).equals(entry.getValue());
                case "content":
                    return message.getContent().equals(entry.getValue());
                default:
                    return false;
            }
        });
    }
}
