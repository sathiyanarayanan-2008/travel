package com.voyagepilot.repository;

import com.voyagepilot.model.Disruption;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DisruptionRepository extends MongoRepository<Disruption, String> {
    List<Disruption> findByAffectedBookingId(String affectedBookingId);
    List<Disruption> findByStatusOrderByCreatedAtDesc(String status);
}
