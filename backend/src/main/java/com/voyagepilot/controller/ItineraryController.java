package com.voyagepilot.controller;

import com.voyagepilot.dto.ApiResponse;
import com.voyagepilot.dto.ItineraryRequest;
import com.voyagepilot.model.Itinerary;
import com.voyagepilot.service.ItineraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/itineraries")
public class ItineraryController {

    private final ItineraryService itineraryService;

    public ItineraryController(ItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Itinerary>> generate(@RequestBody ItineraryRequest request) {
        Itinerary itinerary = itineraryService.generateItinerary(request);
        return ResponseEntity.ok(ApiResponse.ok("Itinerary generated successfully", itinerary));
    }
}
