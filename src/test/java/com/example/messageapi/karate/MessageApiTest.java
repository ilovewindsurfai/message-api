package com.example.messageapi.karate;

import com.intuit.karate.junit5.Karate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MessageApiTest {

    @LocalServerPort
    private int port;

    @Karate.Test
    Karate testMessageApi() {
        System.setProperty("karate.env", "dev");
        System.setProperty("karate.port", String.valueOf(port));
        return Karate.run("messages").relativeTo(getClass());
    }
}
