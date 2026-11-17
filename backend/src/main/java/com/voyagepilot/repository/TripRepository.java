package com.voyagepilot.repository;

import com.voyagepilot.model.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TripRepository extends MongoRepository<Trip, String> {
    List<Trip> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Trip> findByDestinationIgnoreCase(String destination);
}
