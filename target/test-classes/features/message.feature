Feature: Message API Operations
  As an API user
  I want to manage messages
  So that I can handle different types of messages for various applications

  Background:
    Given the message database is empty

  Scenario: Retrieve all messages when there are no messages
    When I request all messages
    Then I should receive an empty list of messages

  Scenario: Retrieve all messages
    Given the following messages exist:
      | type        | applicationName | active | content                   |
      | INFORMATION | test-app-1     | true   | Test information message  |
      | WARNING     | test-app-2     | false  | Test warning message      |
    When I request all messages
    Then I should receive 2 messages
    And the response should include a message with:
      | field           | value                   |
      | type           | INFORMATION             |
      | applicationName | test-app-1             |
      | active         | true                    |
      | content        | Test information message |

  Scenario: Filter messages by active status
    Given the following messages exist:
      | type        | applicationName | active | content                |
      | INFORMATION | test-app-1     | true   | Active message         |
      | WARNING     | test-app-2     | false  | Inactive message       |
    When I request messages with active status "true"
    Then I should receive 1 message
    And the response should include a message with:
      | field           | value           |
      | type           | INFORMATION     |
      | applicationName | test-app-1      |
      | active         | true            |
      | content        | Active message   |

  Scenario: Filter messages by type
    Given the following messages exist:
      | type        | applicationName | active | content                    |
      | INFORMATION | test-app-1     | true   | Information type message   |
      | ERROR       | test-app-2     | true   | Error type message         |
    When I request messages with type "INFORMATION"
    Then I should receive 1 message
    And the response should include a message with:
      | field           | value                    |
      | type           | INFORMATION              |
      | applicationName | test-app-1               |
      | content        | Information type message  |

  Scenario: Filter messages by application name
    Given the following messages exist:
      | type        | applicationName | active | content                |
      | INFORMATION | test-app-1     | true   | App1 message          |
      | WARNING     | test-app-2     | true   | App2 message          |
    When I request messages for application "test-app-1"
    Then I should receive 1 message
    And the response should include a message with:
      | field           | value           |
      | applicationName | test-app-1      |
      | content        | App1 message     |

  Scenario: Get message by ID
    Given the following messages exist:
      | type        | applicationName | active | content          |
      | INFORMATION | test-app-1     | true   | Specific message |
    When I request the message with ID 1
    Then I should receive a message with:
      | field           | value            |
      | type           | INFORMATION      |
      | applicationName | test-app-1       |
      | content        | Specific message  |

  Scenario: Get non-existing message by ID
    When I request the message with ID 999
    Then I should receive a not found error

  Scenario: Get messages with invalid type
    Given the following messages exist:
      | type        | applicationName | active | content          |
      | INFORMATION | test-app-1     | true   | Valid message    |
    When I request messages with type "INVALID_TYPE"
    Then I should receive an empty list of messages

  Scenario: Get messages for non-existing application
    Given the following messages exist:
      | type        | applicationName | active | content          |
      | INFORMATION | test-app-1     | true   | Existing app msg |
    When I request messages for application "non-existing-app"
    Then I should receive an empty list of messages
