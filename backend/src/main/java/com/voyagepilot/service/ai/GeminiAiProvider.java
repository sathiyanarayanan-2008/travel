package com.voyagepilot.service.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

@Component
@Primary
public class GeminiAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiProvider.class);

    @Value("${voyagepilot.ai.gemini.api-key:}")
    private String apiKey;

    @Value("${voyagepilot.ai.gemini.model:gemini-2.0-flash}")
    private String model;

    private final DeterministicFallbackAiProvider fallbackProvider;
    private final HttpClient httpClient;

    public GeminiAiProvider(DeterministicFallbackAiProvider fallbackProvider) {
        this.fallbackProvider = fallbackProvider;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    public String generateResponse(String systemPrompt, String userMessage, Map<String, Object> context) {
        // Fall back deterministically if no key is configured
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.info("GEMINI_API_KEY is not set or empty. Using deterministic fallback engine.");
            return fallbackProvider.generateResponse(systemPrompt, userMessage, context);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey.trim();

            String prompt = (systemPrompt != null ? systemPrompt + "\n\n" : "") +
                    "Context: " + (context != null ? context.toString() : "{}") + "\n\n" +
                    "User: " + userMessage;

            // Escaping prompt text for JSON body safely
            String escapedPrompt = escapeJson(prompt);
            String requestBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + escapedPrompt + "\"}]}]}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String text = extractTextFromGeminiResponse(response.body());
                if (text != null && !text.trim().isEmpty()) {
                    return text.trim();
                }
            } else {
                log.warn("Gemini API returned status {}: {}. Falling back to deterministic response.",
                        response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.warn("Error calling Gemini API: {}. Gracefully falling back to deterministic planning.", e.getMessage());
        }

        return fallbackProvider.generateResponse(systemPrompt, userMessage, context);
    }

    @Override
    public String getProviderName() {
        return (apiKey != null && !apiKey.trim().isEmpty()) ? "gemini-" + model : "deterministic-fallback";
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private String extractTextFromGeminiResponse(String responseBody) {
        try {
            int textIdx = responseBody.indexOf("\"text\": \"");
            if (textIdx != -1) {
                int start = textIdx + 9;
                int end = responseBody.indexOf("\"", start);
                if (end != -1) {
                    String extracted = responseBody.substring(start, end);
                    return extracted.replace("\\n", "\n").replace("\\\"", "\"").replace("\\\\", "\\");
                }
            }
        } catch (Exception ignored) {}
        return null;
    }
}
