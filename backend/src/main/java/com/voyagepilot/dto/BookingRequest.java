package com.voyagepilot.dto;

import jakarta.validation.constraints.NotBlank;

public class BookingRequest {
    @NotBlank(message = "Trip ID or Destination is required")
    private String tripId;
    private String flightOfferId;
    private String hotelOfferId;
    private int travelers;
    private boolean confirmed;

    public BookingRequest() {}

    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }
    public String getFlightOfferId() { return flightOfferId; }
    public void setFlightOfferId(String flightOfferId) { this.flightOfferId = flightOfferId; }
    public String getHotelOfferId() { return hotelOfferId; }
    public void setHotelOfferId(String hotelOfferId) { this.hotelOfferId = hotelOfferId; }
    public int getTravelers() { return travelers; }
    public void setTravelers(int travelers) { this.travelers = travelers; }
    public boolean isConfirmed() { return confirmed; }
    public void setConfirmed(boolean confirmed) { this.confirmed = confirmed; }
}
