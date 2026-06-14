package com.pulseboard.location.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "locations")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("vehicleId")
    @Column(nullable = false)
    private String vehicleId;

    @JsonProperty("driverId")
    @Column(nullable = false)
    private String driverId;
    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private Double speed;

    @Column(nullable = false)
    private LocalDateTime timestamp;

}