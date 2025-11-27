package com.stadium.stadiummanagement.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Size;

public class StadiumUpdateRequest {

    @Size(max = 60)
    private String type;

    @Size(max = 120)
    private String name;

    @Size(max = 60)
    private String size;

    @Size(max = 255)
    private String address;

    private Long reservationId;

    private Double longitude;

    private Double latitude;

    @Size(min = 6, max = 6)
    private List<String> dayReservation;

    public StadiumUpdateRequest() {
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
        this.dayReservation = dayReservation == null ? null : new ArrayList<>(dayReservation);
    }
}
