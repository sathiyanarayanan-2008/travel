package com.voyagepilot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String tripId;
    private String userId;
    private String bookingReference;
    private String status; // PENDING, CONFIRMED, CANCELLED, MODIFIED
    private double totalAmount;
    private String flightOfferId;
    private String hotelOfferId;
    private int travelers;
    private String origin;
    private String destination;
    private String startDate;
    private String endDate;
    private String cancellationPolicy;
    private String modificationPolicy;
    private boolean simulated;
    private Instant createdAt;
    private Instant updatedAt;

    public Booking() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.simulated = true;
        this.status = "PENDING";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public String getStatus() { return status; }
    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public String getFlightOfferId() { return flightOfferId; }
    public void setFlightOfferId(String flightOfferId) { this.flightOfferId = flightOfferId; }
    public String getHotelOfferId() { return hotelOfferId; }
    public void setHotelOfferId(String hotelOfferId) { this.hotelOfferId = hotelOfferId; }
    public int getTravelers() { return travelers; }
    public void setTravelers(int travelers) { this.travelers = travelers; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public String getCancellationPolicy() { return cancellationPolicy; }
    public void setCancellationPolicy(String cancellationPolicy) { this.cancellationPolicy = cancellationPolicy; }
    public String getModificationPolicy() { return modificationPolicy; }
    public void setModificationPolicy(String modificationPolicy) { this.modificationPolicy = modificationPolicy; }
    public boolean isSimulated() { return simulated; }
    public void setSimulated(boolean simulated) { this.simulated = simulated; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
