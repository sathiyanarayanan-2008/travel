package com.voyagepilot.dto;

import jakarta.validation.constraints.NotBlank;

public class DisruptionRequest {
    @NotBlank(message = "Disruption type is required")
    private String type;
    @NotBlank(message = "Booking reference is required")
    private String bookingId;
    private String description;
    private String severity;

    public DisruptionRequest() {}

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
