package com.cms.content.controller;

import com.cms.content.dto.ProcedureStepRequest;
import com.cms.content.dto.ProcedureStepResponse;
import com.cms.content.service.ProcedureStepService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedure-step")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProcedureStepController {
    private final ProcedureStepService stepService;

    @GetMapping("/flow/{flowId}")
    public ResponseEntity<List<ProcedureStepResponse>> getStepsByFlow(@PathVariable Long flowId) {
        return ResponseEntity.ok(stepService.getStepsByFlow(flowId));
    }

    @GetMapping("/{id}/flow/{flowId}")
    public ResponseEntity<ProcedureStepResponse> getStepById(
            @PathVariable Long id,
            @PathVariable Long flowId) {
        return ResponseEntity.ok(stepService.getStepById(id, flowId));
    }

    @PostMapping
    public ResponseEntity<ProcedureStepResponse> createStep(@Valid @RequestBody ProcedureStepRequest request) {
        ProcedureStepResponse response = stepService.createStep(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProcedureStepResponse> updateStep(
            @PathVariable Long id,
            @Valid @RequestBody ProcedureStepRequest request) {
        return ResponseEntity.ok(stepService.updateStep(id, request));
    }

    @DeleteMapping("/{id}/flow/{flowId}")
    public ResponseEntity<Void> deleteStep(
            @PathVariable Long id,
            @PathVariable Long flowId) {
        stepService.deleteStep(id, flowId);
        return ResponseEntity.noContent().build();
    }
}


