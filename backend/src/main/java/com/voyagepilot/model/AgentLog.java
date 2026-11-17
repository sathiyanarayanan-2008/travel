package com.voyagepilot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.Map;

@Document(collection = "agent_logs")
public class AgentLog {
    @Id
    private String id;
    private String agentType;
    private String action;
    private String conversationId;
    private Map<String, Object> input;
    private Map<String, Object> output;
    private String decision;
    private long durationMs;
    private Instant timestamp;

    public AgentLog() {
        this.timestamp = Instant.now();
    }

    public AgentLog(String agentType, String action, String conversationId, Map<String, Object> input, Map<String, Object> output, String decision, long durationMs) {
        this.agentType = agentType;
        this.action = action;
        this.conversationId = conversationId;
        this.input = input;
        this.output = output;
        this.decision = decision;
        this.durationMs = durationMs;
        this.timestamp = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAgentType() { return agentType; }
    public void setAgentType(String agentType) { this.agentType = agentType; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
    public Map<String, Object> getInput() { return input; }
    public void setInput(Map<String, Object> input) { this.input = input; }
    public Map<String, Object> getOutput() { return output; }
    public void setOutput(Map<String, Object> output) { this.output = output; }
    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
    public long getDurationMs() { return durationMs; }
    public void setDurationMs(long durationMs) { this.durationMs = durationMs; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
