package com.pulseboard.chat.service;

import com.pulseboard.chat.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private static final String TOPIC = "chat-messages";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendMessage(Message message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(TOPIC, message.getSenderId(), json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}