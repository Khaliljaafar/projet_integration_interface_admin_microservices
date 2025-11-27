package com.stadium.stadiummanagement.domain;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.stadium.stadiummanagement.domain.converter.StringListConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "stadium_details")
public class StadiumDetail {

    @Id
    @Column(name = "stadium_id")
    private Long stadiumId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "stadium_id")
    private Stadium stadium;

    @Column(name = "stadium_name", nullable = false, length = 120)
    private String name;

    @Column(name = "stadium_size", length = 60)
    private String size;

    @Column(name = "stadium_address", length = 255)
    private String address;

    @Column(name = "reservation_id")
    private Long reservationId;

    @OneToOne
    @JoinColumn(name = "stadium_localisation_id")
    private StadiumLocalisation localisation;

    @Convert(converter = StringListConverter.class)
    @Column(name = "day_reservation", columnDefinition = "json", nullable = false)
    private List<String> dayReservation = defaultDayReservation();

    public StadiumDetail() {
    }

    public Long getStadiumId() {
        return stadiumId;
    }

    public void setStadiumId(Long stadiumId) {
        this.stadiumId = stadiumId;
    }

    public Stadium getStadium() {
        return stadium;
    }

    public void setStadium(Stadium stadium) {
        this.stadium = stadium;
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

    public StadiumLocalisation getLocalisation() {
        return localisation;
    }

    public void setLocalisation(StadiumLocalisation localisation) {
        this.localisation = localisation;
    }

    public List<String> getDayReservation() {
        return dayReservation;
    }

    public void setDayReservation(List<String> dayReservation) {
        this.dayReservation = dayReservation == null ? defaultDayReservation()
                : new ArrayList<>(dayReservation);
    }

    private static List<String> defaultDayReservation() {
        return new ArrayList<>(Arrays.asList("non reserver", "non reserver", "non reserver",
                "non reserver", "non reserver", "non reserver"));
    }
}
