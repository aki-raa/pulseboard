package com.pulseboard.location.service;

import com.pulseboard.location.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class KafkaProducerService {

    private static final String TOPIC = "location-events";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendLocation(Location location) {
        try {
            String json = objectMapper.writeValueAsString(location);
            kafkaTemplate.send(TOPIC, location.getVehicleId(), json);
            System.out.println("Sent to Kafka: " + json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}