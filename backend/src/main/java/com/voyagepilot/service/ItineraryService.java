package com.voyagepilot.service;

import com.voyagepilot.dto.ItineraryRequest;
import com.voyagepilot.model.Itinerary;
import com.voyagepilot.repository.ItineraryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ItineraryService {

    private final ItineraryRepository itineraryRepo;

    public ItineraryService(ItineraryRepository itineraryRepo) {
        this.itineraryRepo = itineraryRepo;
    }

    public Itinerary generateItinerary(ItineraryRequest request) {
        String dest = request.getDestination() != null ? request.getDestination() : "Goa";
        String orig = request.getOrigin() != null ? request.getOrigin() : "Chennai";
        int daysCount = request.getDurationDays() > 0 ? request.getDurationDays() : 3;

        Itinerary itinerary = new Itinerary();
        itinerary.setDestination(dest);
        itinerary.setOrigin(orig);
        itinerary.setDurationDays(daysCount);
        itinerary.setTravelers(request.getTravelers() > 0 ? request.getTravelers() : 2);
        itinerary.setTripName(daysCount + "-Day " + dest + " Coastal & Heritage Getaway");

        List<Itinerary.DayPlan> days = new ArrayList<>();

        // Day 1
        days.add(new Itinerary.DayPlan(1, "Arrival, Check-in & North Goa Sunsets", List.of(
                new Itinerary.Activity("1-1", "06:15", "IndiGo 6E-2041 Flight (Chennai → Goa)", "transport", 9000, "✈️"),
                new Itinerary.Activity("1-2", "08:45", "Private AC Airport Transfer to Calangute", "transport", 1200, "🚕"),
                new Itinerary.Activity("1-3", "10:30", "Check-in at Seaside Comfort Inn", "hotel", 4400, "🏨"),
                new Itinerary.Activity("1-4", "12:30", "Seafood Lunch at Britto's, Baga Beach", "food", 1200, "🍽️"),
                new Itinerary.Activity("1-5", "15:00", "Water Sports & Beach Relaxation at Baga", "activity", 1500, "🏖️"),
                new Itinerary.Activity("1-6", "18:00", "Sunset Cocktails at Calangute Beach", "sightseeing", 800, "🌅"),
                new Itinerary.Activity("1-7", "20:30", "Dinner at Thalassa Greek Taverna", "food", 2200, "🍽️")
        )));

        // Day 2
        days.add(new Itinerary.DayPlan(2, "Old Goa Heritage Churches & South Coast", List.of(
                new Itinerary.Activity("2-1", "08:30", "Complimentary Buffet Breakfast at Hotel", "food", 0, "☕"),
                new Itinerary.Activity("2-2", "09:45", "Guided Tour: Basilica of Bom Jesus & Se Cathedral", "sightseeing", 400, "⛪"),
                new Itinerary.Activity("2-3", "13:00", "Traditional Goan Feast at Martin's Corner", "food", 1600, "🍛"),
                new Itinerary.Activity("2-4", "15:30", "Palolem Beach Sea Kayaking", "activity", 1000, "🛶"),
                new Itinerary.Activity("2-5", "18:00", "Cabo de Rama Fort Sunset Walk", "sightseeing", 200, "🏰"),
                new Itinerary.Activity("2-6", "20:45", "Live Music & Dinner at Tito's Lane", "food", 1800, "🎶")
        )));

        // Day 3
        if (daysCount >= 3) {
            days.add(new Itinerary.DayPlan(3, "Spice Plantations, Handicraft Bazaars & Departure", List.of(
                    new Itinerary.Activity("3-1", "08:00", "Breakfast & Morning Beach Walk", "food", 0, "☕"),
                    new Itinerary.Activity("3-2", "09:30", "Sahakari Spice Plantation Guided Tour & Tasting", "sightseeing", 800, "🌿"),
                    new Itinerary.Activity("3-3", "12:30", "Organic Buffet Lunch at Plantation", "food", 1000, "🍽️"),
                    new Itinerary.Activity("3-4", "14:30", "Mapusa Market Cashew & Souvenir Shopping", "activity", 1000, "🛍️"),
                    new Itinerary.Activity("3-5", "16:00", "Hotel Checkout & Departure Airport Transfer", "transport", 1200, "🚕"),
                    new Itinerary.Activity("3-6", "18:30", "IndiGo 6E-2043 Return Flight to Chennai", "transport", 9000, "✈️")
            )));
        }

        itinerary.setDays(days);
        double total = days.stream()
                .flatMap(d -> d.getActivities().stream())
                .mapToDouble(Itinerary.Activity::getCost)
                .sum();
        itinerary.setTotalCost(total > 0 ? total : 27500);

        return itineraryRepo.save(itinerary);
    }
}
