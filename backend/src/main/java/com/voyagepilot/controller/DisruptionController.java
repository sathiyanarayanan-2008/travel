package com.voyagepilot.controller;

import com.voyagepilot.dto.ApiResponse;
import com.voyagepilot.dto.DisruptionRequest;
import com.voyagepilot.model.Disruption;
import com.voyagepilot.service.DisruptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disruptions")
public class DisruptionController {

    private final DisruptionService disruptionService;

    public DisruptionController(DisruptionService disruptionService) {
        this.disruptionService = disruptionService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<ApiResponse<Disruption>> simulate(@Valid @RequestBody DisruptionRequest request) {
        Disruption disruption = disruptionService.simulateDisruption(request);
        return ResponseEntity.ok(ApiResponse.ok("Disruption scenario injected [SIMULATED]", disruption));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Disruption>> approve(@PathVariable String id) {
        Disruption approved = disruptionService.approveDisruption(id);
        return ResponseEntity.ok(ApiResponse.ok("Resolution approved and applied to itinerary", approved));
    }

    @GetMapping
    public ResponseEntity<List<Disruption>> getAll() {
        return ResponseEntity.ok(disruptionService.getAllDisruptions());
    }
}
