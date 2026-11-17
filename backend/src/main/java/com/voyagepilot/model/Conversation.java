package com.voyagepilot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "conversations")
public class Conversation {
    @Id
    private String id;
    private String userId;
    private List<Message> messages = new ArrayList<>();
    private Map<String, Object> extractedPreferences = new HashMap<>();
    private Instant createdAt;
    private Instant updatedAt;

    public Conversation() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }
    public Map<String, Object> getExtractedPreferences() { return extractedPreferences; }
    public void setExtractedPreferences(Map<String, Object> extractedPreferences) { this.extractedPreferences = extractedPreferences; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static class Message {
        private String role; // user, assistant
        private String content;
        private String agentType; // Intent, Itinerary, Supplier, Budget, Booking, Disruption, Support
        private Instant timestamp;

        public Message() {
            this.timestamp = Instant.now();
        }

        public Message(String role, String content, String agentType) {
            this.role = role;
            this.content = content;
            this.agentType = agentType;
            this.timestamp = Instant.now();
        }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getAgentType() { return agentType; }
        public void setAgentType(String agentType) { this.agentType = agentType; }
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    }
}
