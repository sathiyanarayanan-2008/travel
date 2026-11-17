package com.voyagepilot.service;

import com.voyagepilot.model.*;
import com.voyagepilot.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final FlightOfferRepository flightRepo;
    private final HotelOfferRepository hotelRepo;
    private final TripRepository tripRepo;
    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final DisruptionRepository disruptionRepo;

    public DataSeeder(FlightOfferRepository flightRepo,
                      HotelOfferRepository hotelRepo,
                      TripRepository tripRepo,
                      BookingRepository bookingRepo,
                      UserRepository userRepo,
                      DisruptionRepository disruptionRepo) {
        this.flightRepo = flightRepo;
        this.hotelRepo = hotelRepo;
        this.tripRepo = tripRepo;
        this.bookingRepo = bookingRepo;
        this.userRepo = userRepo;
        this.disruptionRepo = disruptionRepo;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedMultiDestinationFlights();
        seedMultiDestinationHotels();
        seedTrips();
        seedDisruptions();
        log.info("✅ VoyagePilot AI comprehensive multi-state & city travel data seeded.");
    }

    private void seedUsers() {
        if (userRepo.count() == 0) {
            userRepo.saveAll(List.of(
                    new User("demo-traveler-01", "Priya Sharma", "priya@example.com", "TRAVELER"),
                    new User("demo-agent-01", "Vikram Malhotra", "vikram@tbo-agency.com", "TRAVEL_AGENT")
            ));
        }
    }

    private void seedMultiDestinationFlights() {
        flightRepo.deleteAll();
        List<FlightOffer> flights = new ArrayList<>();

        // 1. GOA
        flights.add(createFlight("FL-GOA-01", "IndiGo", "6E-2041", "Chennai (MAA)", "Goa (GOI)", "06:15", "08:00", "1h 45m", 0, 4500, 5800, "15kg check-in", "TBO Supplier A", 12, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Morning Beach Express"));
        flights.add(createFlight("FL-GOA-02", "Air India", "AI-671", "Mumbai (BOM)", "Goa (GOI)", "08:30", "09:45", "1h 15m", 0, 3600, 4800, "25kg check-in", "TBO Supplier B", 8, "₹500 cancellation fee", "Complimentary Snack", "Economy", "Extra Baggage (25kg)"));

        // 2. MANALI (via Kullu / Chandigarh)
        flights.add(createFlight("FL-MAN-01", "Air India", "AI-9811", "Delhi (DEL)", "Kullu-Manali (KUU)", "06:45", "08:15", "1h 30m", 0, 7200, 8900, "15kg check-in", "TBO Supplier A", 6, "Free cancellation up to 48h prior", "Snack Box", "Economy", "Direct Himalayan Flight"));
        flights.add(createFlight("FL-MAN-02", "IndiGo", "6E-2194", "Delhi (DEL)", "Chandigarh (IXC)", "07:15", "08:20", "1h 05m", 0, 2800, 3900, "15kg check-in", "TBO Supplier B", 18, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Connecting Highway Route"));

        // 3. JAIPUR
        flights.add(createFlight("FL-JAI-01", "IndiGo", "6E-551", "Mumbai (BOM)", "Jaipur (JAI)", "06:30", "08:15", "1h 45m", 0, 3800, 4900, "15kg check-in", "TBO Supplier A", 14, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Early Morning Non-stop"));
        flights.add(createFlight("FL-JAI-02", "Alliance Air", "9I-642", "Delhi (DEL)", "Jaipur (JAI)", "08:00", "09:05", "1h 05m", 0, 2200, 3100, "15kg check-in", "TBO Supplier A", 20, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Quick Hop"));

        // 4. KERALA (Kochi / Trivandrum)
        flights.add(createFlight("FL-KER-01", "IndiGo", "6E-409", "Bangalore (BLR)", "Kochi (COK)", "07:00", "08:05", "1h 05m", 0, 2600, 3500, "15kg check-in", "TBO Supplier A", 16, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Quick Morning Non-stop"));
        flights.add(createFlight("FL-KER-02", "Air India", "AI-582", "Delhi (DEL)", "Kochi (COK)", "06:00", "09:15", "3h 15m", 0, 5800, 7200, "25kg check-in", "TBO Supplier B", 11, "Free cancellation up to 48h prior", "Hot Breakfast", "Economy", "Direct Morning Route"));

        // 5. HYDERABAD
        flights.add(createFlight("FL-HYD-01", "IndiGo", "6E-621", "Bangalore (BLR)", "Hyderabad (HYD)", "06:15", "07:25", "1h 10m", 0, 2900, 3900, "15kg check-in", "TBO Supplier A", 24, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Morning Tech Shuttle"));
        flights.add(createFlight("FL-HYD-02", "Vistara", "UK-873", "Delhi (DEL)", "Hyderabad (HYD)", "07:00", "09:15", "2h 15m", 0, 4800, 6200, "20kg check-in", "TBO Supplier C", 15, "Free cancellation up to 24h prior", "Hot Gourmet Breakfast", "Premium Economy", "Executive Class"));
        flights.add(createFlight("FL-HYD-03", "Air India", "AI-544", "Chennai (MAA)", "Hyderabad (HYD)", "09:30", "10:45", "1h 15m", 0, 3100, 4200, "25kg check-in", "TBO Supplier B", 12, "₹500 cancellation fee", "Complimentary Snack", "Economy", "Reliable Direct"));

        // 6. BANGALORE
        flights.add(createFlight("FL-BLR-01", "IndiGo", "6E-283", "Delhi (DEL)", "Bangalore (BLR)", "06:00", "08:45", "2h 45m", 0, 4900, 6500, "15kg check-in", "TBO Supplier A", 30, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Popular Tech Corridor"));
        flights.add(createFlight("FL-BLR-02", "Air India", "AI-603", "Mumbai (BOM)", "Bangalore (BLR)", "07:15", "08:55", "1h 40m", 0, 3500, 4600, "25kg check-in", "TBO Supplier B", 18, "₹500 cancellation fee", "Hot Breakfast", "Economy", "Extra Baggage"));
        flights.add(createFlight("FL-BLR-03", "Akasa Air", "QP-1311", "Hyderabad (HYD)", "Bangalore (BLR)", "08:45", "09:55", "1h 10m", 0, 2400, 3400, "15kg check-in", "TBO Supplier A", 22, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Lowest Price"));

        // 7. DELHI
        flights.add(createFlight("FL-DEL-01", "Vistara", "UK-992", "Mumbai (BOM)", "Delhi (DEL)", "06:00", "08:10", "2h 10m", 0, 4800, 6200, "20kg check-in", "TBO Supplier C", 20, "Free cancellation up to 24h prior", "Hot Meal & Drinks", "Premium Economy", "Business Corridor"));
        flights.add(createFlight("FL-DEL-02", "IndiGo", "6E-5012", "Bangalore (BLR)", "Delhi (DEL)", "07:30", "10:15", "2h 45m", 0, 4600, 5900, "15kg check-in", "TBO Supplier A", 28, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Morning Direct"));
        flights.add(createFlight("FL-DEL-03", "Air India", "AI-440", "Chennai (MAA)", "Delhi (DEL)", "06:30", "09:20", "2h 50m", 0, 5100, 6800, "25kg check-in", "TBO Supplier B", 14, "Free cancellation up to 48h prior", "Hot Breakfast", "Economy", "Full Service"));

        // 8. TAMIL NADU (Chennai / Madurai / Coimbatore)
        flights.add(createFlight("FL-TN-01", "IndiGo", "6E-334", "Bangalore (BLR)", "Chennai (MAA)", "06:45", "07:45", "1h 00m", 0, 2200, 3100, "15kg check-in", "TBO Supplier A", 25, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Superfast Shuttle"));
        flights.add(createFlight("FL-TN-02", "Air India", "AI-672", "Mumbai (BOM)", "Chennai (MAA)", "07:00", "08:50", "1h 50m", 0, 3900, 5100, "25kg check-in", "TBO Supplier B", 16, "Free cancellation up to 48h prior", "Hot Breakfast", "Economy", "Heritage Corridor"));
        flights.add(createFlight("FL-TN-03", "IndiGo", "6E-7124", "Chennai (MAA)", "Madurai (IXM)", "08:30", "09:40", "1h 10m", 0, 2700, 3600, "15kg check-in", "TBO Supplier A", 19, "Free cancellation up to 24h prior", "Buy on board", "Economy", "Temple City Connect"));

        // 9. DUBAI
        flights.add(createFlight("FL-DXB-01", "Emirates", "EK-501", "Mumbai (BOM)", "Dubai (DXB)", "04:30", "06:15", "3h 15m", 0, 14500, 18200, "30kg check-in", "TBO Supplier C", 14, "Free cancellation up to 72h prior", "International Dining", "Economy", "Premier Direct Flight"));
        flights.add(createFlight("FL-DXB-02", "FlyDubai", "FZ-446", "Delhi (DEL)", "Dubai (DXB)", "09:10", "11:45", "4h 05m", 0, 11800, 14900, "20kg check-in", "TBO Supplier A", 20, "₹1,500 cancellation fee", "Paid Meal", "Economy", "Budget International"));

        flightRepo.saveAll(flights);
    }

    private void seedMultiDestinationHotels() {
        hotelRepo.deleteAll();
        List<HotelOffer> hotels = new ArrayList<>();

        // 1. GOA
        hotels.add(createHotel("HT-GOA-01", "Seaside Comfort Inn", "Calangute, North Goa", 4.2, 2200, 3200, "Deluxe Double Room (Balcony)", List.of("Free WiFi", "Outdoor Pool", "Breakfast Included", "AC", "Beach Shuttle"), "TBO Supplier A", 4, "Free cancellation until 48h prior", "Charming 3-star property situated 350m from Calangute Beach.", "Goa", "Best Value Pick"));
        hotels.add(createHotel("HT-GOA-02", "Goa Beach Resort & Spa", "Baga Beach, North Goa", 4.6, 3500, 4800, "Superior Sea View Room", List.of("Direct Beach Access", "Infinity Pool", "Ayurvedic Spa", "Breakfast", "Rooftop Bar"), "TBO Supplier B", 2, "Non-refundable", "Beachfront 4-star resort with panoramic Arabian Sea sunset views.", "Goa", "Beachfront Luxury"));
        hotels.add(createHotel("HT-GOA-03", "Budget Stay Goa", "Anjuna Beach Road, North Goa", 3.8, 1200, 1900, "Standard King Room", List.of("Free High-Speed WiFi", "AC", "24/7 Front Desk", "Free Parking"), "TBO Supplier A", 9, "Free cancellation until 24h prior", "Spotless budget accommodation close to flea markets.", "Goa", "Ultra Budget"));

        // 2. MANALI
        hotels.add(createHotel("HT-MAN-01", "Solang Valley Himalayan Resort", "Solang Valley, Manali", 4.7, 3400, 4800, "Snow View Wooden Cottage", List.of("Mountain View", "Fireplace", "Breakfast", "Heater", "Adventure Desk"), "TBO Supplier B", 5, "Free cancellation up to 48h prior", "Panoramic views of snow-clad peaks and direct access to Solang ski slopes.", "Manali", "Himalayan Classic"));
        hotels.add(createHotel("HT-MAN-02", "Apple Blossom Pine Retreat", "Old Manali", 4.3, 1900, 2800, "Deluxe Pine Room", List.of("Free WiFi", "Cafe", "Bonfire", "Balcony", "Trek Guide"), "TBO Supplier A", 7, "Free cancellation up to 24h prior", "Nestled among apple orchards in Old Manali, close to Manu Temple.", "Manali", "Great Value"));

        // 3. JAIPUR
        hotels.add(createHotel("HT-JAI-01", "Shahpura Haveli Heritage Stay", "Bani Park, Jaipur", 4.6, 2600, 3800, "Traditional Royal Chamber", List.of("Heritage Courtyard", "Rooftop Restaurant", "Pool", "Folk Music", "AC"), "TBO Supplier A", 6, "Free cancellation up to 48h prior", "Authentic 200-year-old Rajput haveli featuring fresco murals.", "Jaipur", "Heritage Value"));
        hotels.add(createHotel("HT-JAI-02", "Jai Mahal Palace", "Jacob Road, Jaipur", 4.9, 9500, 14000, "Palace Heritage Room", List.of("18 Acres Mughal Gardens", "Historic Palace", "Spa", "Fine Dining", "Peacock Gardens"), "TBO Supplier C", 2, "Free cancellation up to 72h prior", "Majestic 1745 AD palace operated by Taj, surrounded by Mughal gardens.", "Jaipur", "Palatial Luxury"));

        // 4. KERALA
        hotels.add(createHotel("HT-KER-01", "Kumarakom Lake Luxury Retreat", "Vembanad Lake, Kumarakom", 4.8, 6200, 8900, "Meandering Pool Villa", List.of("Backwater Views", "Ayurvedic Spa", "Houseboat Trips", "Infinity Pool", "Kerala Cuisine"), "TBO Supplier B", 3, "Free cancellation up to 72h prior", "Acclaimed resort on the banks of Lake Vembanad.", "Kerala", "Backwater Serenity"));
        hotels.add(createHotel("HT-KER-02", "Munnar Misty Hills Cottage", "Pallivasal, Munnar", 4.4, 2100, 3100, "Valley Facing Tea Cottage", List.of("Tea Plantation View", "Campfire", "Breakfast", "Nature Walks"), "TBO Supplier A", 8, "Free cancellation up to 24h prior", "Surrounded by emerald green tea estates in the misty Western Ghats.", "Kerala", "Nature Lover"));

        // 5. HYDERABAD
        hotels.add(createHotel("HT-HYD-01", "Taj Falaknuma Palace", "Engine Bowli, Hyderabad", 4.9, 14500, 22000, "Royal Historical Suite", List.of("Horse Carriage Arrival", "Nizam Heritage Tour", "Bespoke Dining", "Spa", "City Panorama"), "TBO Supplier C", 1, "Free cancellation up to 7 days prior", "Former palace of the Nizam of Hyderabad, perched 2,000 feet above the city.", "Hyderabad", "Nizam Palatial"));
        hotels.add(createHotel("HT-HYD-02", "ITC Kohenur Luxury Collection", "HITEC City, Hyderabad", 4.8, 6800, 9500, "Durgam Cheruvu Lake View Room", List.of("Lake View", "Rooftop Lounge", "Spa", "Fine Dining", "Pool"), "TBO Supplier B", 6, "Free cancellation up to 48h prior", "Spectacular luxury hotel overlooking the scenic freshwater Durgam lake.", "Hyderabad", "Cyber Modern"));
        hotels.add(createHotel("HT-HYD-03", "Charminar Heritage Comfort", "Abids, Hyderabad", 4.2, 2100, 3100, "Executive Room", List.of("Free WiFi", "Biryani Restaurant", "AC", "Metro Proximity"), "TBO Supplier A", 12, "Free cancellation up to 24h prior", "Convenient location near Old City pearls bazaars and authentic biryani hubs.", "Hyderabad", "Best Value"));

        // 6. BANGALORE
        hotels.add(createHotel("HT-BLR-01", "The Leela Palace Bengaluru", "Old Airport Road, Bangalore", 4.9, 11500, 16000, "Royal Premiere Room", List.of("Vijayanagara Architecture", "9 Acres Gardens", "Citron Spa", "Fine Dining", "Pool"), "TBO Supplier C", 3, "Free cancellation up to 72h prior", "Palatial grandeur inspired by the royal architectural splendor of Mysore.", "Bangalore", "Garden Palace"));
        hotels.add(createHotel("HT-BLR-02", "The Paul Bangalore", "Domlur, Bangalore", 4.6, 4800, 6800, "Studio Suite", List.of("Irish Pub Murphy's", "Atrium Pool", "Complimentary Breakfast", "Gym", "Free WiFi"), "TBO Supplier B", 7, "Free cancellation up to 48h prior", "All-suite boutique luxury hotel minutes from Indiranagar's cafes and breweries.", "Bangalore", "Boutique Suite"));
        hotels.add(createHotel("HT-BLR-03", "Bloomrooms @ Indiranagar", "100 Feet Road, Bangalore", 4.3, 2400, 3500, "Signature Cloud Bed Room", List.of("Free High-Speed WiFi", "Cafe", "Bright Modern Design", "Walkable Nightlife"), "TBO Supplier A", 10, "Free cancellation up to 24h prior", "Crisp, vibrant, design-led hotel in the heart of Bangalore's top dining district.", "Bangalore", "Trendy Value"));

        // 7. DELHI
        hotels.add(createHotel("HT-DEL-01", "The Imperial New Delhi", "Janpath, Connaught Place, Delhi", 4.9, 12000, 17500, "Heritage Imperial Room", List.of("Art Deco Museum", "Outdoor Pool", "Award-Winning Dining", "Spa", "Central Connaught Place"), "TBO Supplier C", 2, "Free cancellation up to 72h prior", "Legendary 1930s hotel blending rich colonial history with modern luxury.", "Delhi", "Iconic Landmark"));
        hotels.add(createHotel("HT-DEL-02", "The Lodhi", "Lodhi Road, New Delhi", 4.8, 9800, 14000, "Lodhi Room with Private Plunge Pool", List.of("Private Plunge Pool", "Aman Heritage", "Spa", "Tennis Courts", "Humayun Tomb View"), "TBO Supplier B", 4, "Free cancellation up to 48h prior", "Urban sanctuary set close to Lodhi Gardens and Delhi golf club.", "Delhi", "Urban Sanctuary"));
        hotels.add(createHotel("HT-DEL-03", "Haveli Dharampura", "Chandni Chowk, Old Delhi", 4.6, 3800, 5600, "Mughal Jharokha Room", List.of("UNESCO Heritage Recognized", "Rooftop Pigeon Flying Show", "Mughlai Dining", "Courtyard Kathak"), "TBO Supplier A", 5, "Free cancellation up to 48h prior", "Lovingly restored 19th-century Mughal haveli inside historic Old Delhi.", "Delhi", "Old Delhi Heritage"));

        // 8. TAMIL NADU (Chennai / Mahabalipuram / Ooty)
        hotels.add(createHotel("HT-TN-01", "Taj Fisherman's Cove Resort & Spa", "Covelong Beach, Chennai / TN", 4.8, 8500, 12500, "Sea Facing Cottage", List.of("Private Beach", "Seafood Grill", "Jiva Spa", "Catamaran Rides", "Pool"), "TBO Supplier C", 3, "Free cancellation up to 72h prior", "Built on the ramparts of an old Dutch fort along the Bay of Bengal coast.", "Tamil Nadu", "Coastal Sanctuary"));
        hotels.add(createHotel("HT-TN-02", "Radisson Blu Resort Temple Bay", "Mahabalipuram, Tamil Nadu", 4.6, 5200, 7400, "Chalet Garden View", List.of("Meandering Pool", "Shore Temple Proximity", "Ayurvedic Spa", "Beach Access"), "TBO Supplier B", 8, "Free cancellation up to 48h prior", "Expansive 44-acre beach resort walking distance from UNESCO Shore Temples.", "Tamil Nadu", "Heritage Beach"));
        hotels.add(createHotel("HT-TN-03", "Savoy - IHCL SeleQtions", "Ooty, Nilgiris, Tamil Nadu", 4.7, 4900, 7100, "Colonial Garden Room", List.of("180-Year-Old English Manor", "Fireplace", "High Tea", "Rose Garden Views"), "TBO Supplier B", 5, "Free cancellation up to 48h prior", "Historic British Raj colonial manor nestled in the misty Nilgiri hills.", "Tamil Nadu", "Nilgiri Mountain"));

        // 9. DUBAI
        hotels.add(createHotel("HT-DXB-01", "Rove Downtown Dubai", "Downtown Dubai", 4.7, 7500, 11000, "Burj View Room", List.of("Burj Khalifa View", "Pool", "Gym", "Cinema", "Mall Shuttle"), "TBO Supplier A", 6, "Free cancellation up to 48h prior", "Vibrant modern hotel walking distance from Dubai Mall and Burj Khalifa.", "Dubai", "Downtown Trendy"));

        hotelRepo.saveAll(hotels);
    }

    private FlightOffer createFlight(String id, String airline, String flightNo, String origin, String destination,
                                     String departure, String arrival, String duration, int stops, double price,
                                     double originalPrice, String baggage, String supplier, int availability,
                                     String cancellation, String meals, String flightClass, String badge) {
        FlightOffer f = new FlightOffer();
        f.setId(id);
        f.setAirline(airline);
        f.setFlightNo(flightNo);
        f.setOrigin(origin);
        f.setDestination(destination);
        f.setDeparture(departure);
        f.setArrival(arrival);
        f.setDuration(duration);
        f.setStops(stops);
        f.setPrice(price);
        f.setOriginalPrice(originalPrice);
        f.setBaggage(baggage);
        f.setSupplier(supplier);
        f.setAvailability(availability);
        f.setCancellation(cancellation);
        f.setMeals(meals);
        f.setFlightClass(flightClass);
        f.setBadge(badge);
        return f;
    }

    private HotelOffer createHotel(String id, String name, String location, double rating, double pricePerNight,
                                   double originalPrice, String roomType, List<String> amenities, String supplier,
                                   int availability, String cancellation, String description, String destination, String tag) {
        HotelOffer h = new HotelOffer();
        h.setId(id);
        h.setName(name);
        h.setLocation(location);
        h.setRating(rating);
        h.setPricePerNight(pricePerNight);
        h.setOriginalPrice(originalPrice);
        h.setRoomType(roomType);
        h.setAmenities(amenities);
        h.setSupplier(supplier);
        h.setAvailability(availability);
        h.setCancellation(cancellation);
        h.setDescription(description);
        h.setDestination(destination);
        h.setTag(tag);
        return h;
    }

    private void seedTrips() {
        if (tripRepo.count() == 0) {
            Trip t1 = new Trip();
            t1.setId("TRIP-GOA-001");
            t1.setUserId("demo-traveler-01");
            t1.setOrigin("Chennai (MAA)");
            t1.setDestination("Goa");
            t1.setStartDate("2024-11-20");
            t1.setEndDate("2024-11-22");
            t1.setDurationDays(3);
            t1.setTravelers(2);
            t1.setBudget(30000);
            t1.setTotalCost(27500);
            t1.setStatus("CONFIRMED");
            t1.setBookingId("BK-VP-2024-9428");
            t1.setInterests(List.of("Beaches", "Affordable Hotels", "Morning Flights"));

            Trip t2 = new Trip();
            t2.setId("TRIP-MAN-002");
            t2.setUserId("demo-traveler-01");
            t2.setOrigin("Delhi (DEL)");
            t2.setDestination("Manali");
            t2.setStartDate("2024-12-01");
            t2.setEndDate("2024-12-05");
            t2.setDurationDays(5);
            t2.setTravelers(4);
            t2.setBudget(80000);
            t2.setTotalCost(65000);
            t2.setStatus("PLANNING");
            t2.setBookingId("BK-VP-2024-3119");
            t2.setInterests(List.of("Mountains", "Adventure", "Snow"));

            Trip t3 = new Trip();
            t3.setId("TRIP-JAI-003");
            t3.setUserId("demo-traveler-01");
            t3.setOrigin("Mumbai (BOM)");
            t3.setDestination("Jaipur");
            t3.setStartDate("2024-10-10");
            t3.setEndDate("2024-10-12");
            t3.setDurationDays(3);
            t3.setTravelers(3);
            t3.setBudget(50000);
            t3.setTotalCost(42000);
            t3.setStatus("COMPLETED");
            t3.setBookingId("BK-VP-2024-1082");
            t3.setInterests(List.of("Forts", "Palaces", "Shopping"));

            Trip t4 = new Trip();
            t4.setId("TRIP-HYD-004");
            t4.setUserId("demo-traveler-01");
            t4.setOrigin("Bangalore (BLR)");
            t4.setDestination("Hyderabad");
            t4.setStartDate("2025-01-10");
            t4.setEndDate("2025-01-12");
            t4.setDurationDays(3);
            t4.setTravelers(2);
            t4.setBudget(25000);
            t4.setTotalCost(21500);
            t4.setStatus("CONFIRMED");
            t4.setBookingId("BK-VP-2025-6310");
            t4.setInterests(List.of("Biryani", "Charminar", "Golconda", "Pearls"));

            tripRepo.saveAll(List.of(t1, t2, t3, t4));

            Booking b1 = new Booking();
            b1.setId("BK-VP-2024-9428");
            b1.setBookingReference("BK-VP-2024-9428");
            b1.setTripId("TRIP-GOA-001");
            b1.setUserId("demo-traveler-01");
            b1.setOrigin("Chennai (MAA)");
            b1.setDestination("Goa");
            b1.setTravelers(2);
            b1.setStartDate("2024-11-20");
            b1.setEndDate("2024-11-22");
            b1.setFlightOfferId("FL-GOA-01");
            b1.setHotelOfferId("HT-GOA-01");
            b1.setTotalAmount(27500);
            b1.setStatus("CONFIRMED");
            b1.setSimulated(true);
            b1.setCancellationPolicy("Free cancellation up to 24h prior to travel.");
            bookingRepo.save(b1);
        }
    }

    private void seedDisruptions() {
        if (disruptionRepo.count() == 0) {
            Disruption d1 = new Disruption();
            d1.setId("DIS-2024-01");
            d1.setType("FLIGHT_DELAY");
            d1.setSeverity("high");
            d1.setTitle("IndiGo 6E-2041 Delayed by 3h 15m (Weather / ATC)");
            d1.setDescription("Flight 6E-2041 departure shifted from 06:15 AM to 09:30 AM due to coastal airspace clearance delay.");
            d1.setAffectedBookingId("BK-VP-2024-9428");
            d1.setStatus("pending");
            d1.setProposal(new Disruption.Proposal(
                    "Automated 4-point itinerary adjustment without missing key sights:",
                    List.of(
                            "Rescheduled Airport Cab Pickup to 12:00 PM.",
                            "Delayed hotel check-in (Late arrival pre-notified).",
                            "Shifted lunch reservation by 1 hour and compressed leisure window.",
                            "Preserved evening sunset and dinner reservations without conflicts."
                    ),
                    0.0
            ));

            disruptionRepo.save(d1);
        }
    }
}
