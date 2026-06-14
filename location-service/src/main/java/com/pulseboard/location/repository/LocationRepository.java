package com.pulseboard.location.repository;

import com.pulseboard.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByVehicleIdOrderByTimestampDesc(String vehicleId);
    List<Location> findByDriverIdOrderByTimestampDesc(String driverId);
}