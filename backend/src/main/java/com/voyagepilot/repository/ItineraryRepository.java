package com.voyagepilot.repository;

import com.voyagepilot.model.Itinerary;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ItineraryRepository extends MongoRepository<Itinerary, String> {
    Optional<Itinerary> findByTripId(String tripId);
}
