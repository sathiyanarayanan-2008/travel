package com.voyagepilot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "flight_offers")
public class FlightOffer {
    @Id
    private String id;
    private String airline;
    private String flightNo;
    private String origin;
    private String destination;
    private String departure;
    private String arrival;
    private String duration;
    private int stops;
    private double price;
    private double originalPrice;
    private String baggage;
    private String supplier;
    private int availability;
    private String cancellation;
    private String meals;
    private boolean wifi;
    private String flightClass;
    private String badge;

    public FlightOffer() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }
    public String getFlightNo() { return flightNo; }
    public void setFlightNo(String flightNo) { this.flightNo = flightNo; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getDeparture() { return departure; }
    public void setDeparture(String departure) { this.departure = departure; }
    public String getArrival() { return arrival; }
    public void setArrival(String arrival) { this.arrival = arrival; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public int getStops() { return stops; }
    public void setStops(int stops) { this.stops = stops; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }
    public String getBaggage() { return baggage; }
    public void setBaggage(String baggage) { this.baggage = baggage; }
    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }
    public int getAvailability() { return availability; }
    public void setAvailability(int availability) { this.availability = availability; }
    public String getCancellation() { return cancellation; }
    public void setCancellation(String cancellation) { this.cancellation = cancellation; }
    public String getMeals() { return meals; }
    public void setMeals(String meals) { this.meals = meals; }
    public boolean isWifi() { return wifi; }
    public void setWifi(boolean wifi) { this.wifi = wifi; }
    public String getFlightClass() { return flightClass; }
    public void setFlightClass(String flightClass) { this.flightClass = flightClass; }
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
}
