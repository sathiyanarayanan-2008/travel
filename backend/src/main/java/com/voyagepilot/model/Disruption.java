package com.voyagepilot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "disruptions")
public class Disruption {
    @Id
    private String id;
    private String type; // FLIGHT_DELAY, FLIGHT_CANCEL, HOTEL_UNAVAILABLE, HOTEL_OVERBOOKED
    private String severity; // low, medium, high
    private String title;
    private String description;
    private String affectedBookingId;
    private String status; // pending, approved, rejected, resolved
    private Proposal proposal;
    private Instant createdAt;
    private Instant resolvedAt;

    public Disruption() {
        this.createdAt = Instant.now();
        this.status = "pending";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAffectedBookingId() { return affectedBookingId; }
    public void setAffectedBookingId(String affectedBookingId) { this.affectedBookingId = affectedBookingId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Proposal getProposal() { return proposal; }
    public void setProposal(Proposal proposal) { this.proposal = proposal; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }

    public static class Proposal {
        private String summary;
        private List<String> changes = new ArrayList<>();
        private double costImpact;

        public Proposal() {}
        public Proposal(String summary, List<String> changes, double costImpact) {
            this.summary = summary;
            this.changes = changes;
            this.costImpact = costImpact;
        }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }
        public List<String> getChanges() { return changes; }
        public void setChanges(List<String> changes) { this.changes = changes; }
        public double getCostImpact() { return costImpact; }
        public void setCostImpact(double costImpact) { this.costImpact = costImpact; }
    }
}
