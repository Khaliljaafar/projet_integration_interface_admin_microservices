package com.stadium.stadiummanagement.dto;

import java.util.ArrayList;
import java.util.List;

import com.stadium.stadiummanagement.domain.Stadium;
import com.stadium.stadiummanagement.domain.StadiumDetail;
import com.stadium.stadiummanagement.domain.StadiumLocalisation;

public class StadiumResponse {

    private Long id;
    private String type;
    private String name;
    private String size;
    private String address;
    private Long reservationId;
    private Double longitude;
    private Double latitude;
    private List<String> dayReservation = new ArrayList<>();

    public StadiumResponse() {
    }

    public static StadiumResponse fromEntity(Stadium stadium) {
        StadiumResponse response = new StadiumResponse();
        response.setId(stadium.getId());
        response.setType(stadium.getType());
        StadiumDetail detail = stadium.getDetail();
        if (detail != null) {
            response.setName(detail.getName());
            response.setSize(detail.getSize());
            response.setAddress(detail.getAddress());
            response.setReservationId(detail.getReservationId());
            if (detail.getDayReservation() != null) {
                response.setDayReservation(detail.getDayReservation());
            }
            StadiumLocalisation localisation = detail.getLocalisation();
            if (localisation != null) {
                response.setLongitude(localisation.getLongitude());
                response.setLatitude(localisation.getLatitude());
            }
        }
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        this.dayReservation = dayReservation == null ? new ArrayList<>() : new ArrayList<>(dayReservation);
    }
}
