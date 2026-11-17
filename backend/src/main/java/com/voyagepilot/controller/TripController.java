package com.voyagepilot.controller;

import com.voyagepilot.dto.ApiResponse;
import com.voyagepilot.model.Trip;
import com.voyagepilot.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Trip>> createTrip(@RequestBody Trip trip) {
        Trip created = tripService.createTrip(trip);
        return ResponseEntity.ok(ApiResponse.ok("Trip plan successfully created.", created));
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Trip>> getTrip(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(tripService.getTrip(id)));
    }

    @PostMapping("/{id}/replan")
    public ResponseEntity<ApiResponse<Trip>> replanTrip(@PathVariable String id, @RequestBody Trip updates) {
        Trip replanned = tripService.replanTrip(id, updates);
        return ResponseEntity.ok(ApiResponse.ok("Trip replanned and optimized.", replanned));
    }
}
