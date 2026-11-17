package com.voyagepilot.repository;

import com.voyagepilot.model.FlightOffer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FlightOfferRepository extends MongoRepository<FlightOffer, String> {
    List<FlightOffer> findByOriginIgnoreCaseAndDestinationIgnoreCase(String origin, String destination);
}
