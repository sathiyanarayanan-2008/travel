package com.voyagepilot.repository;

import com.voyagepilot.model.HotelOffer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HotelOfferRepository extends MongoRepository<HotelOffer, String> {
    List<HotelOffer> findByDestinationIgnoreCase(String destination);
}
