package com.stadium.stadiummanagement.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stadium.stadiummanagement.domain.Stadium;
import com.stadium.stadiummanagement.domain.StadiumDetail;
import com.stadium.stadiummanagement.domain.StadiumLocalisation;
import com.stadium.stadiummanagement.dto.StadiumRequest;
import com.stadium.stadiummanagement.dto.StadiumResponse;
import com.stadium.stadiummanagement.dto.StadiumUpdateRequest;
import com.stadium.stadiummanagement.exception.ResourceNotFoundException;
import com.stadium.stadiummanagement.repository.StadiumDetailRepository;
import com.stadium.stadiummanagement.repository.StadiumLocalisationRepository;
import com.stadium.stadiummanagement.repository.StadiumRepository;

@Service
@Transactional
public class StadiumService {

    private final StadiumRepository stadiumRepository;
    private final StadiumDetailRepository stadiumDetailRepository;
    private final StadiumLocalisationRepository localisationRepository;

    public StadiumService(StadiumRepository stadiumRepository, StadiumDetailRepository stadiumDetailRepository,
            StadiumLocalisationRepository localisationRepository) {
        this.stadiumRepository = stadiumRepository;
        this.stadiumDetailRepository = stadiumDetailRepository;
        this.localisationRepository = localisationRepository;
    }

    public StadiumResponse createStadium(StadiumRequest request) {
        Stadium stadium = new Stadium();
        stadium.setType(request.getType());
        Stadium savedStadium = stadiumRepository.save(stadium);

        StadiumLocalisation localisation = new StadiumLocalisation();
        localisation.setLongitude(request.getLongitude());
        localisation.setLatitude(request.getLatitude());
        localisation = localisationRepository.save(localisation);

        StadiumDetail detail = new StadiumDetail();
        detail.setStadium(savedStadium);
        detail.setName(request.getName());
        detail.setSize(request.getSize());
        detail.setAddress(request.getAddress());
        detail.setReservationId(request.getReservationId());
        detail.setDayReservation(request.getDayReservation());
        detail.setLocalisation(localisation);
        stadiumDetailRepository.save(detail);
        savedStadium.setDetail(detail);
        return StadiumResponse.fromEntity(savedStadium);
    }

    public StadiumResponse updateStadium(Long stadiumId, StadiumUpdateRequest request) {
        Stadium stadium = findStadium(stadiumId);
        if (request.getType() != null) {
            stadium.setType(request.getType());
        }
        StadiumDetail detail = stadiumDetailRepository.findById(stadiumId)
                .orElseGet(() -> {
                    StadiumDetail created = new StadiumDetail();
                    created.setStadium(stadium);
                    return created;
                });
        if (request.getName() != null) {
            detail.setName(request.getName());
        }
        if (request.getSize() != null) {
            detail.setSize(request.getSize());
        }
        if (request.getAddress() != null) {
            detail.setAddress(request.getAddress());
        }
        if (request.getReservationId() != null) {
            detail.setReservationId(request.getReservationId());
        }
        if (request.getDayReservation() != null) {
            detail.setDayReservation(request.getDayReservation());
        }
        if (request.getLongitude() != null && request.getLatitude() != null) {
            StadiumLocalisation localisation = detail.getLocalisation();
            if (localisation == null) {
                localisation = new StadiumLocalisation();
            }
            localisation.setLongitude(request.getLongitude());
            localisation.setLatitude(request.getLatitude());
            localisation = localisationRepository.save(localisation);
            detail.setLocalisation(localisation);
        }
        stadiumDetailRepository.save(detail);
        stadiumRepository.save(stadium);
        stadium.setDetail(detail);
        return StadiumResponse.fromEntity(stadium);
    }

    public void deleteStadium(Long stadiumId) {
        Stadium stadium = findStadium(stadiumId);
        stadiumRepository.delete(stadium);
    }

    @Transactional(readOnly = true)
    public StadiumResponse getStadium(Long stadiumId) {
        return StadiumResponse.fromEntity(findStadium(stadiumId));
    }

    @Transactional(readOnly = true)
    public List<StadiumResponse> listStadiums(String type) {
        List<Stadium> source = type == null ? stadiumRepository.findAll() : stadiumRepository.findByTypeIgnoreCase(type);
        return source.stream().map(StadiumResponse::fromEntity).collect(Collectors.toList());
    }

    private Stadium findStadium(Long stadiumId) {
        return stadiumRepository.findById(stadiumId)
                .orElseThrow(() -> new ResourceNotFoundException("Stadium not found: " + stadiumId));
    }
}
