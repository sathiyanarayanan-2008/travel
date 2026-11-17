package com.voyagepilot.service;

import com.voyagepilot.dto.DisruptionRequest;
import com.voyagepilot.model.Disruption;
import com.voyagepilot.repository.DisruptionRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class DisruptionService {

    private final DisruptionRepository disruptionRepo;

    public DisruptionService(DisruptionRepository disruptionRepo) {
        this.disruptionRepo = disruptionRepo;
    }

    public Disruption simulateDisruption(DisruptionRequest request) {
        Disruption disruption = new Disruption();
        disruption.setType(request.getType());
        disruption.setSeverity(request.getSeverity() != null ? request.getSeverity() : "high");
        disruption.setDescription(request.getDescription());
        disruption.setAffectedBookingId(request.getBookingId());

        Disruption.Proposal proposal = new Disruption.Proposal();

        switch (request.getType().toUpperCase()) {
            case "FLIGHT_DELAY" -> {
                disruption.setTitle("Flight Schedule Delay (3h 15m)");
                proposal.setSummary("Autonomous 4-point itinerary adjustment without missing key sights:");
                proposal.setChanges(List.of(
                        "Reschedule Goa Airport cab transfer from 08:45 AM to 12:00 PM.",
                        "Notify Seaside Comfort Inn of late check-in (authorized for 12:30 PM).",
                        "Shift Britto's lunch to 1:30 PM and compress beach leisure window.",
                        "Calangute sunset and Thalassa dinner preserved without conflict."
                ));
                proposal.setCostImpact(0);
            }
            case "HOTEL_OVERBOOKED", "HOTEL_UNAVAILABLE" -> {
                disruption.setTitle("Hotel Room Overbooking Surcharge Protection");
                proposal.setSummary("Instant room upgrade to 4-Star Goa Beach Resort (Baga Beach):");
                proposal.setChanges(List.of(
                        "Upgraded from Deluxe Balcony to Superior Sea View.",
                        "Free welcome cocktails and complimentary dinner buffet on Night 1.",
                        "Zero cost difference (Covered by supplier rate guarantee policy)."
                ));
                proposal.setCostImpact(0);
            }
            case "FLIGHT_CANCEL" -> {
                disruption.setTitle("Flight Cancellation Protection");
                proposal.setSummary("Rebook on subsequent direct flight with baggage waiver:");
                proposal.setChanges(List.of(
                        "Rebooked onto Air India AI-671 departing at 07:30 AM.",
                        "25kg baggage allowance included automatically.",
                        "Supplier covers rebooking fare difference (Cost delta: ₹0)."
                ));
                proposal.setCostImpact(0);
            }
            default -> {
                disruption.setTitle("Supplier Operational Variance");
                proposal.setSummary("Agentic investigation and route re-optimization:");
                proposal.setChanges(List.of(
                        "Monitored flight and hotel state.",
                        "Preserved existing reservations with zero traveler cost impact."
                ));
                proposal.setCostImpact(0);
            }
        }

        disruption.setProposal(proposal);
        disruption.setStatus("pending");
        return disruptionRepo.save(disruption);
    }

    public Disruption approveDisruption(String id) {
        Disruption disruption = disruptionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Disruption not found with id: " + id));

        if (!"pending".equalsIgnoreCase(disruption.getStatus())) {
            throw new IllegalArgumentException("Disruption is already in status: " + disruption.getStatus());
        }

        disruption.setStatus("approved");
        disruption.setResolvedAt(Instant.now());
        return disruptionRepo.save(disruption);
    }

    public List<Disruption> getAllDisruptions() {
        return disruptionRepo.findAll();
    }
}
