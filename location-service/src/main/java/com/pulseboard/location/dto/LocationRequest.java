package com.pulseboard.location.dto;

import lombok.Data;

@Data
public class LocationRequest {
    private String vehicleId;
    private String driverId;
    private Double latitude;
    private Double longitude;
    private Double speed;
}