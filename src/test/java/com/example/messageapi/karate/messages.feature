Feature: Message API Tests

Background:
  * url baseUrl
  * def messageRequest = read('message-request.json')

Scenario: Get all messages when no messages exist
  Given path '/messages'
  When method get
  Then status 200
  And match response == []

Scenario: Create and retrieve a message
  # Create message
  Given path '/messages'
  And request messageRequest
  When method post
  Then status 201
  And match response.id == '#number'
  And match response.type == messageRequest.type
  And match response.applicationName == messageRequest.applicationName
  And match response.active == messageRequest.active
  And match response.content == messageRequest.content

  # Get created message
  * def messageId = response.id
  Given path '/messages', messageId
  When method get
  Then status 200
  And match response contains messageRequest

Scenario: Get messages by active status
  # Create active message
  Given path '/messages'
  And request messageRequest
  When method post
  Then status 201

  # Create inactive message
  Given path '/messages'
  And request { type: 'WARNING', applicationName: 'test-app-2', active: false, content: 'Inactive warning message' }
  When method post
  Then status 201

  # Get active messages
  Given path '/messages/active/true'
  When method get
  Then status 200
  And match response[0].active == true
  And match response[0].applicationName == messageRequest.applicationName
  And match response[0].content == messageRequest.content

Scenario: Get messages by type
  # Create INFORMATION message
  Given path '/messages'
  And request messageRequest
  When method post
  Then status 201

  # Create ERROR message
  Given path '/messages'
  And request { type: 'ERROR', applicationName: 'test-app-2', active: true, content: 'Error message content' }
  When method post
  Then status 201

  # Get INFORMATION messages
  Given path '/messages/type/INFORMATION'
  When method get
  Then status 200
  And match response[0].type == 'INFORMATION'
  And match response[0].applicationName == messageRequest.applicationName
  And match response[0].content == messageRequest.content

Scenario: Get messages by application name
  # Create message for test-app-1
  Given path '/messages'
  And request messageRequest
  When method post
  Then status 201

  # Create message for test-app-2
  Given path '/messages'
  And request { type: 'WARNING', applicationName: 'test-app-2', active: true, content: 'Test app 2 message' }
  When method post
  Then status 201

  # Get messages for test-app-1
  Given path '/messages/application/test-app-1'
  When method get
  Then status 200
  And match response[0].applicationName == 'test-app-1'
  And match response[0].content == messageRequest.content

Scenario: Get non-existing message
  Given path '/messages/999'
  When method get
  Then status 404

Scenario: Get messages with invalid type
  Given path '/messages/type/INVALID_TYPE'
  When method get
  Then status 200
  And match response == []

Scenario: Get messages for non-existing application
  Given path '/messages/application/non-existing-app'
  When method get
  Then status 200
  And match response == []

Scenario: Create message with invalid type
  Given path '/messages'
  And request { type: 'INVALID_TYPE', applicationName: 'test-app', active: true, content: 'Invalid message' }
  When method post
  Then status 400

Scenario: Create message without required fields
  Given path '/messages'
  And request { applicationName: 'test-app' }
  When method post
  Then status 400
