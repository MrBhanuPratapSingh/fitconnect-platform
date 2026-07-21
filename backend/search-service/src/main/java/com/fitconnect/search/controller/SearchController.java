package com.fitconnect.search.controller;

import com.fitconnect.search.dto.GymSearchResult;
import com.fitconnect.search.service.GymSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final GymSearchService gymSearchService;

    @GetMapping("/gyms")
    public ResponseEntity<List<GymSearchResult>> searchGyms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double maxFee,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String sortBy) {

        return ResponseEntity.ok(gymSearchService.search(keyword, lat, lng, maxFee, minRating, sortBy));
    }
}