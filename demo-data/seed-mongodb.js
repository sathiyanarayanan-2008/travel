// VoyagePilot AI - MongoDB Reset & Seed Script
// Usage: mongosh voyagepilot seed-mongodb.js

db = db.getSiblingDB('voyagepilot');

print("Resetting voyagepilot database collections...");
db.users.drop();
db.trips.drop();
db.itineraries.drop();
db.flight_offers.drop();
db.hotel_offers.drop();
db.bookings.drop();
db.conversations.drop();
db.disruptions.drop();
db.agent_logs.drop();

print("Seeding Users...");
db.users.insertMany([
  { _id: "demo-traveler-01", name: "Priya Sharma", email: "priya@example.com", role: "TRAVELER", createdAt: new Date() },
  { _id: "demo-agent-01", name: "Vikram Malhotra", email: "vikram@tbo-agency.com", role: "TRAVEL_AGENT", createdAt: new Date() }
]);

print("Seeding Flight Offers...");
db.flight_offers.insertMany([
  {
    _id: "FL001",
    airline: "IndiGo",
    flightNo: "6E-2041",
    origin: "MAA",
    destination: "GOI",
    departure: "06:15",
    arrival: "08:00",
    duration: "1h 45m",
    stops: 0,
    price: 4500,
    originalPrice: 5800,
    baggage: "15kg check-in + 7kg cabin",
    supplier: "TBO Supplier A",
    availability: 12,
    cancellation: "Free cancellation up to 24h prior to departure",
    meals: "Buy on board",
    flightClass: "Economy",
    badge: "Best Morning Choice"
  },
  {
    _id: "FL002",
    airline: "Air India",
    flightNo: "AI-671",
    origin: "MAA",
    destination: "GOI",
    departure: "07:30",
    arrival: "09:30",
    duration: "2h 00m",
    stops: 0,
    price: 5200,
    originalPrice: 6400,
    baggage: "25kg check-in + 7kg cabin",
    supplier: "TBO Supplier B",
    availability: 8,
    cancellation: "₹500 standard cancellation fee",
    meals: "Complimentary Hot Breakfast",
    flightClass: "Economy",
    badge: "Extra Baggage (25kg)"
  },
  {
    _id: "FL003",
    airline: "SpiceJet",
    flightNo: "SG-514",
    origin: "MAA",
    destination: "GOI",
    departure: "09:00",
    arrival: "11:15",
    duration: "2h 15m",
    stops: 1,
    price: 3200,
    originalPrice: 4200,
    baggage: "15kg check-in + 7kg cabin",
    supplier: "TBO Supplier A",
    availability: 22,
    cancellation: "₹750 cancellation fee",
    meals: "Buy on board",
    flightClass: "Economy",
    badge: "Lowest Price"
  },
  {
    _id: "FL004",
    airline: "Vistara",
    flightNo: "UK-882",
    origin: "MAA",
    destination: "GOI",
    departure: "11:45",
    arrival: "13:30",
    duration: "1h 45m",
    stops: 0,
    price: 6800,
    originalPrice: 8200,
    baggage: "25kg check-in + 7kg cabin",
    supplier: "TBO Supplier C",
    availability: 5,
    cancellation: "Free cancellation up to 48h prior",
    meals: "Gourmet Hot Meal & Beverage",
    flightClass: "Premium Economy",
    badge: "Premium Comfort"
  }
]);

print("Seeding Hotel Offers...");
db.hotel_offers.insertMany([
  {
    _id: "HT001",
    name: "Seaside Comfort Inn",
    location: "Calangute, North Goa",
    rating: 4.2,
    pricePerNight: 2200,
    originalPrice: 3200,
    roomType: "Deluxe Double Room (Balcony)",
    amenities: ["Free WiFi", "Outdoor Pool", "Breakfast Included", "AC", "Beach Shuttle"],
    supplier: "TBO Supplier A",
    availability: 4,
    cancellation: "Free cancellation until 48h prior to check-in",
    description: "Charming 3-star property situated 350m from Calangute Beach.",
    destination: "GOI",
    tag: "Best Value Pick"
  },
  {
    _id: "HT002",
    name: "Goa Beach Resort & Spa",
    location: "Baga Beach, North Goa",
    rating: 4.6,
    pricePerNight: 3500,
    originalPrice: 4800,
    roomType: "Superior Sea View Room",
    amenities: ["Direct Beach Access", "Infinity Pool", "Ayurvedic Spa", "Breakfast", "Rooftop Bar"],
    supplier: "TBO Supplier B",
    availability: 2,
    cancellation: "Non-refundable (includes complimentary welcome cocktails)",
    description: "Beachfront 4-star resort with panoramic Arabian Sea sunset views.",
    destination: "GOI",
    tag: "Beachfront Luxury"
  },
  {
    _id: "HT003",
    name: "Budget Stay Goa",
    location: "Anjuna Beach Road, North Goa",
    rating: 3.8,
    pricePerNight: 1200,
    originalPrice: 1900,
    roomType: "Standard King Room",
    amenities: ["Free High-Speed WiFi", "AC", "24/7 Front Desk", "Free Parking"],
    supplier: "TBO Supplier A",
    availability: 9,
    cancellation: "Free cancellation until 24h prior to check-in",
    description: "Spotless budget accommodation close to flea markets and nightlife hubs.",
    destination: "GOI",
    tag: "Ultra Budget (Save ₹2,000)"
  }
]);

print("Seeding Trips & Bookings...");
db.trips.insertOne({
  _id: "TRIP-GOA-001",
  userId: "demo-traveler-01",
  origin: "Chennai (MAA)",
  destination: "Goa (GOI)",
  startDate: "2024-11-20",
  endDate: "2024-11-22",
  durationDays: 3,
  travelers: 2,
  budget: 30000,
  totalCost: 27500,
  status: "CONFIRMED",
  bookingId: "BK-VP-2024-9428",
  interests: ["Beaches", "Affordable Hotels", "Morning Flights"],
  createdAt: new Date(),
  updatedAt: new Date()
});

db.bookings.insertOne({
  _id: "BK-VP-2024-9428",
  bookingReference: "BK-VP-2024-9428",
  tripId: "TRIP-GOA-001",
  userId: "demo-traveler-01",
  origin: "Chennai (MAA)",
  destination: "Goa (GOI)",
  travelers: 2,
  startDate: "2024-11-20",
  endDate: "2024-11-22",
  flightOfferId: "FL001",
  hotelOfferId: "HT001",
  totalAmount: 27500,
  status: "CONFIRMED",
  simulated: true,
  cancellationPolicy: "Free cancellation up to 24h prior to travel.",
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Seeding Disruptions...");
db.disruptions.insertOne({
  _id: "DIS-2024-01",
  type: "FLIGHT_DELAY",
  severity: "high",
  title: "IndiGo 6E-2041 Delayed by 3h 15m (Weather / ATC)",
  description: "Flight 6E-2041 (Chennai → Goa) departure shifted from 06:15 AM to 09:30 AM due to coastal airspace clearance delay.",
  affectedBookingId: "BK-VP-2024-9428",
  status: "pending",
  proposal: {
    summary: "Automated 4-point itinerary adjustment without missing key sights:",
    changes: [
      "Rescheduled Airport Cab Pickup in Goa from 08:45 AM to 12:00 PM.",
      "Delayed Seaside Comfort Inn check-in to 12:30 PM (Late arrival pre-notified).",
      "Shifted Britto's lunch to 1:30 PM and compressed Baga water sports window.",
      "Preserved evening Calangute sunset and Thalassa dinner without conflicts."
    ],
    costImpact: 0.0
  },
  createdAt: new Date()
});

print("✅ MongoDB collections successfully initialized!");
