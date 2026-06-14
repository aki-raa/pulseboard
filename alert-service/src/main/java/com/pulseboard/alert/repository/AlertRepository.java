package com.pulseboard.alert.repository;

import com.pulseboard.alert.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByVehicleId(String vehicleId);
    List<Alert> findByDriverId(String driverId);
}