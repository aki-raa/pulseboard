package com.pulseboard.location.service;

import com.pulseboard.location.model.Location;
import com.pulseboard.location.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class KafkaConsumerService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "location-events", groupId = "location-group")
    public void consume(String message) {
        try {
            Location location = objectMapper.readValue(message, Location.class);
            locationRepository.save(location);
            messagingTemplate.convertAndSend("/topic/location", location);
            System.out.println("Received from Kafka: " + message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}