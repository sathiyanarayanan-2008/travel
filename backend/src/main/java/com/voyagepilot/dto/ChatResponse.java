package com.voyagepilot.dto;

import java.util.Map;

public class ChatResponse {
    private String reply;
    private String agentType;
    private Map<String, Object> extractedData;
    private String conversationId;

    public ChatResponse() {}

    public ChatResponse(String reply, String agentType, Map<String, Object> extractedData, String conversationId) {
        this.reply = reply;
        this.agentType = agentType;
        this.extractedData = extractedData;
        this.conversationId = conversationId;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
    public String getAgentType() { return agentType; }
    public void setAgentType(String agentType) { this.agentType = agentType; }
    public Map<String, Object> getExtractedData() { return extractedData; }
    public void setExtractedData(Map<String, Object> extractedData) { this.extractedData = extractedData; }
    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
}
