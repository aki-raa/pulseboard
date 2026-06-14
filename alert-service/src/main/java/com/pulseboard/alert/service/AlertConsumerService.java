package com.pulseboard.alert.service;

import com.pulseboard.alert.model.Alert;
import com.pulseboard.alert.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AlertConsumerService {

    private final AlertRepository alertRepository;
    private final AlertRuleEngine alertRuleEngine;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "location-events", groupId = "alert-group")
    public void consume(String message) {
        try {
            LocationEvent event = objectMapper.readValue(message, LocationEvent.class);

            if (alertRuleEngine.isOverspeed(event.getSpeed())) {
                saveAlert(event, Alert.AlertType.OVERSPEED,
                        "Vehicle " + event.getVehicleId() + " overspeeding at " + event.getSpeed() + " km/h");
            }

            if (alertRuleEngine.isVehicleStopped(event.getSpeed())) {
                saveAlert(event, Alert.AlertType.VEHICLE_STOPPED,
                        "Vehicle " + event.getVehicleId() + " has stopped");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void saveAlert(LocationEvent event, Alert.AlertType type, String message) {
        Alert alert = Alert.builder()
                .vehicleId(event.getVehicleId())
                .driverId(event.getDriverId())
                .type(type)
                .message(message)
                .speed(event.getSpeed())
                .timestamp(LocalDateTime.now())
                .build();
        alertRepository.save(alert);
    }
}