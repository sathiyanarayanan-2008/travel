package com.voyagepilot.controller;

import com.voyagepilot.dto.ChatRequest;
import com.voyagepilot.dto.ChatResponse;
import com.voyagepilot.service.AgentOrchestrator;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final AgentOrchestrator orchestrator;

    public ChatController(AgentOrchestrator orchestrator) {
        this.orchestrator = orchestrator;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = orchestrator.processMessage(request);
        return ResponseEntity.ok(response);
    }
}
