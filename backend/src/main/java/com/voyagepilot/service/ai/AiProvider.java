package com.voyagepilot.service.ai;

import java.util.Map;

public interface AiProvider {
    /**
     * Generates an agentic response given the prompt and session context.
     *
     * @param systemPrompt System instructions for the specific agent
     * @param userMessage  Traveler query or agent message
     * @param context      Extracted trip entities and state
     * @return Agent reply string
     */
    String generateResponse(String systemPrompt, String userMessage, Map<String, Object> context);

    /**
     * Name of the provider (e.g. "gemini" or "deterministic-fallback")
     */
    String getProviderName();

    /**
     * Indicates whether the provider is active and healthy
     */
    boolean isAvailable();
}
