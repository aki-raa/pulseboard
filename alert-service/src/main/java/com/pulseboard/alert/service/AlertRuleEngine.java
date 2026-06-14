package com.pulseboard.alert.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AlertRuleEngine {

    @Value("${alert.overspeed.threshold}")
    private double overspeedThreshold;

    public boolean isOverspeed(Double speed) {
        return speed != null && speed > overspeedThreshold;
    }

    public boolean isVehicleStopped(Double speed) {
        return speed != null && speed == 0.0;
    }
}