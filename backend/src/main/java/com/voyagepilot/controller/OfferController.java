package com.voyagepilot.controller;

import com.voyagepilot.model.FlightOffer;
import com.voyagepilot.model.HotelOffer;
import com.voyagepilot.repository.FlightOfferRepository;
import com.voyagepilot.repository.HotelOfferRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final FlightOfferRepository flightRepo;
    private final HotelOfferRepository hotelRepo;

    public OfferController(FlightOfferRepository flightRepo, HotelOfferRepository hotelRepo) {
        this.flightRepo = flightRepo;
        this.hotelRepo = hotelRepo;
    }

    @GetMapping("/flights")
    public ResponseEntity<List<FlightOffer>> getFlights(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination) {

        List<FlightOffer> allFlights = flightRepo.findAll();

        if (destination != null && !destination.trim().isEmpty() && !"All".equalsIgnoreCase(destination)) {
            String destLower = destination.toLowerCase().trim();
            List<FlightOffer> filtered = allFlights.stream()
                    .filter(f -> f.getDestination() != null && f.getDestination().toLowerCase().contains(destLower))
                    .collect(Collectors.toList());
            if (!filtered.isEmpty()) {
                return ResponseEntity.ok(filtered);
            }
        }

        if (origin != null && !origin.trim().isEmpty()) {
            String origLower = origin.toLowerCase().trim();
            List<FlightOffer> filtered = allFlights.stream()
                    .filter(f -> f.getOrigin() != null && f.getOrigin().toLowerCase().contains(origLower))
                    .collect(Collectors.toList());
            if (!filtered.isEmpty()) {
                return ResponseEntity.ok(filtered);
            }
        }

        return ResponseEntity.ok(allFlights);
    }

    @GetMapping("/hotels")
    public ResponseEntity<List<HotelOffer>> getHotels(
            @RequestParam(required = false) String destination) {

        List<HotelOffer> allHotels = hotelRepo.findAll();

        if (destination != null && !destination.trim().isEmpty() && !"All".equalsIgnoreCase(destination)) {
            String target = destination.toLowerCase().trim();
            List<HotelOffer> filtered = allHotels.stream()
                    .filter(h -> (h.getDestination() != null && h.getDestination().toLowerCase().contains(target)) ||
                                 (h.getLocation() != null && h.getLocation().toLowerCase().contains(target)) ||
                                 (h.getName() != null && h.getName().toLowerCase().contains(target)))
                    .collect(Collectors.toList());
            if (!filtered.isEmpty()) {
                return ResponseEntity.ok(filtered);
            }
        }

        return ResponseEntity.ok(allHotels);
    }
}
