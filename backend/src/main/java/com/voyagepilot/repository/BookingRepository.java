package com.voyagepilot.repository;

import com.voyagepilot.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);
}
