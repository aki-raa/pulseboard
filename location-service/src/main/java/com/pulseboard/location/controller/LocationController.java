package com.pulseboard.location.controller;

import com.pulseboard.location.dto.LocationRequest;
import com.pulseboard.location.model.Location;
import com.pulseboard.location.repository.LocationRepository;
import com.pulseboard.location.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
public class LocationController {

    private final KafkaProducerService kafkaProducerService;
    private final LocationRepository locationRepository;

    @PostMapping("/update")
    public ResponseEntity<String> updateLocation(@RequestBody LocationRequest request, Principal principal) {
        Location location = Location.builder()
                .vehicleId(request.getVehicleId())
                .driverId(principal.getName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .speed(request.getSpeed())
                .timestamp(LocalDateTime.now())
                .build();

        kafkaProducerService.sendLocation(location);
        return ResponseEntity.ok("Location updated");
    }

    @GetMapping("/history/{vehicleId}")
    public ResponseEntity<List<Location>> getHistory(@PathVariable String vehicleId, Principal principal) {
        return ResponseEntity.ok(locationRepository.findByVehicleIdOrderByTimestampDesc(vehicleId));
    }
}