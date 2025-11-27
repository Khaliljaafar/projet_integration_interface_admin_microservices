package com.stadium.stadiummanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stadium.stadiummanagement.dto.StadiumRequest;
import com.stadium.stadiummanagement.dto.StadiumResponse;
import com.stadium.stadiummanagement.dto.StadiumUpdateRequest;
import com.stadium.stadiummanagement.service.StadiumService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stadiums")
@Validated
public class StadiumController {

    private final StadiumService stadiumService;

    public StadiumController(StadiumService stadiumService) {
        this.stadiumService = stadiumService;
    }

    @PostMapping
    public ResponseEntity<StadiumResponse> createStadium(@Valid @RequestBody StadiumRequest request) {
        StadiumResponse response = stadiumService.createStadium(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{stadiumId}")
    public StadiumResponse updateStadium(@PathVariable Long stadiumId,
            @Valid @RequestBody StadiumUpdateRequest request) {
        return stadiumService.updateStadium(stadiumId, request);
    }

    @GetMapping
    public List<StadiumResponse> listStadiums(@RequestParam(name = "type", required = false) String type) {
        return stadiumService.listStadiums(type);
    }

    @GetMapping("/{stadiumId}")
    public StadiumResponse getDetail(@PathVariable Long stadiumId) {
        return stadiumService.getStadium(stadiumId);
    }

    @DeleteMapping("/{stadiumId}")
    public ResponseEntity<Void> deleteStadium(@PathVariable Long stadiumId) {
        stadiumService.deleteStadium(stadiumId);
        return ResponseEntity.noContent().build();
    }
}
