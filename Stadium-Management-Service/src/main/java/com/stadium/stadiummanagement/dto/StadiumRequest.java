package com.stadium.stadiummanagement.dto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class StadiumRequest {

    @NotBlank
    @Size(max = 60)
    private String type;

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 60)
    private String size;

    @Size(max = 255)
    private String address;

    private Long reservationId;

    @NotNull
    private Double longitude;

    @NotNull
    private Double latitude;

    @NotNull
    @Size(min = 6, max = 6)
    private List<String> dayReservation = defaultDayReservation();

    public StadiumRequest() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public List<String> getDayReservation() {
        return dayReservation;
    }

    public void setDayReservation(List<String> dayReservation) {
        this.dayReservation = dayReservation == null ? defaultDayReservation() : new ArrayList<>(dayReservation);
    }

    private static List<String> defaultDayReservation() {
        return new ArrayList<>(Arrays.asList("non reserver", "non reserver", "non reserver",
                "non reserver", "non reserver", "non reserver"));
    }
}
