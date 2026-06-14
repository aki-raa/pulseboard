package com.pulseboard.alert.service;

import lombok.Data;

@Data
public class LocationEvent {
    private String vehicleId;
    private String driverId;
    private Double latitude;
    private Double longitude;
    private Double speed;
    private String timestamp;
}