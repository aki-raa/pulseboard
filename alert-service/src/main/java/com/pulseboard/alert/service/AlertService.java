package com.pulseboard.alert.service;

import com.pulseboard.alert.model.Alert;
import com.pulseboard.alert.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    public List<Alert> getHistoryById(String vehicleId, String email) {
        return alertRepository.findByVehicleId(vehicleId);
    }

    public List<Alert> getAllActiveAlerts(String email) {
        return alertRepository.findAll();
    }

    public List<Alert> driverAlerts(String driverId, String email) {
        return alertRepository.findByDriverId(driverId);
    }
}