package com.pulseboard.alert.controller;

import com.pulseboard.alert.model.Alert;
import com.pulseboard.alert.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/alert")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping("/history/{vehicleId}")
    public List<Alert> getVehicleAlerts(@PathVariable String vehicleId, Principal principal) {
        return alertService.getHistoryById(vehicleId, principal.getName());
    }

    @GetMapping("/active")
    public List<Alert> getActiveAlerts(Principal principal) {
        return alertService.getAllActiveAlerts(principal.getName());
    }

    @GetMapping("/driver/{driverId}")
    public List<Alert> getDriverAlerts(@PathVariable String driverId, Principal principal) {
        return alertService.driverAlerts(driverId, principal.getName());
    }
}