package com.voyagepilot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "itineraries")
public class Itinerary {
    @Id
    private String id;
    private String tripId;
    private String tripName;
    private String destination;
    private String origin;
    private int durationDays;
    private int travelers;
    private double totalCost;
    private List<DayPlan> days = new ArrayList<>();
    private Instant createdAt;

    public Itinerary() {
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }
    public String getTripName() { return tripName; }
    public void setTripName(String tripName) { this.tripName = tripName; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }
    public int getTravelers() { return travelers; }
    public void setTravelers(int travelers) { this.travelers = travelers; }
    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double totalCost) { this.totalCost = totalCost; }
    public List<DayPlan> getDays() { return days; }
    public void setDays(List<DayPlan> days) { this.days = days; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static class DayPlan {
        private int day;
        private String title;
        private List<Activity> activities = new ArrayList<>();

        public DayPlan() {}
        public DayPlan(int day, String title, List<Activity> activities) {
            this.day = day;
            this.title = title;
            this.activities = activities;
        }

        public int getDay() { return day; }
        public void setDay(int day) { this.day = day; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public List<Activity> getActivities() { return activities; }
        public void setActivities(List<Activity> activities) { this.activities = activities; }
    }

    public static class Activity {
        private String id;
        private String time;
        private String title;
        private String type;
        private double cost;
        private String icon;

        public Activity() {}
        public Activity(String id, String time, String title, String type, double cost, String icon) {
            this.id = id;
            this.time = time;
            this.title = title;
            this.type = type;
            this.cost = cost;
            this.icon = icon;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public double getCost() { return cost; }
        public void setCost(double cost) { this.cost = cost; }
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
    }
}
