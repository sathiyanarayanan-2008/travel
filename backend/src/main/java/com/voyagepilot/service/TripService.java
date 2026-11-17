package com.voyagepilot.service;

import com.voyagepilot.model.Trip;
import com.voyagepilot.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public Trip createTrip(Trip trip) {
        if (trip.getUserId() == null || trip.getUserId().trim().isEmpty()) {
            trip.setUserId("demo-traveler-01");
        }
        if (trip.getStatus() == null) {
            trip.setStatus("PLANNING");
        }
        trip.setCreatedAt(Instant.now());
        trip.setUpdatedAt(Instant.now());
        return tripRepository.save(trip);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTrip(String id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found with id: " + id));
    }

    public Trip replanTrip(String id, Trip updates) {
        Trip trip = getTrip(id);
        if (updates.getBudget() > 0) {
            trip.setBudget(updates.getBudget());
        }
        if (updates.getTotalCost() > 0) {
            trip.setTotalCost(updates.getTotalCost());
        }
        if (updates.getDestination() != null) {
            trip.setDestination(updates.getDestination());
        }
        if (updates.getConstraints() != null) {
            trip.setConstraints(updates.getConstraints());
        }
        trip.setStatus("PLANNING");
        trip.setUpdatedAt(Instant.now());
        return tripRepository.save(trip);
    }
}
