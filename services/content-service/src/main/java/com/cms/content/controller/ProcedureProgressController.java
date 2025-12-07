package com.cms.content.controller;

import com.cms.content.dto.ProcedureProgressRequest;
import com.cms.content.dto.ProcedureProgressResponse;
import com.cms.content.service.ProcedureProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedure-progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProcedureProgressController {
    private final ProcedureProgressService progressService;

    @GetMapping("/user/{userId}/flow/{flowId}")
    public ResponseEntity<List<ProcedureProgressResponse>> getProgressByUserAndFlow(
            @PathVariable Long userId,
            @PathVariable Long flowId) {
        return ResponseEntity.ok(progressService.getProgressByUserAndFlow(userId, flowId));
    }

    @GetMapping("/user/{userId}/university/{universityId}")
    public ResponseEntity<List<ProcedureProgressResponse>> getProgressByUser(
            @PathVariable Long userId,
            @PathVariable Long universityId) {
        return ResponseEntity.ok(progressService.getProgressByUser(userId, universityId));
    }

    @GetMapping("/user/{userId}/step/{stepId}")
    public ResponseEntity<ProcedureProgressResponse> getProgress(
            @PathVariable Long userId,
            @PathVariable Long stepId) {
        ProcedureProgressResponse response = progressService.getProgress(userId, stepId);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ProcedureProgressResponse> updateProgress(
            @Valid @RequestBody ProcedureProgressRequest request) {
        return ResponseEntity.ok(progressService.updateProgress(request));
    }

    @PostMapping("/start/user/{userId}/step/{stepId}/university/{universityId}")
    public ResponseEntity<ProcedureProgressResponse> startStep(
            @PathVariable Long userId,
            @PathVariable Long stepId,
            @PathVariable Long universityId) {
        return ResponseEntity.ok(progressService.startStep(userId, stepId, universityId));
    }

    @PostMapping("/complete/user/{userId}/step/{stepId}")
    public ResponseEntity<ProcedureProgressResponse> completeStep(
            @PathVariable Long userId,
            @PathVariable Long stepId) {
        return ResponseEntity.ok(progressService.completeStep(userId, stepId));
    }

    @DeleteMapping("/user/{userId}/step/{stepId}")
    public ResponseEntity<Void> deleteProgress(
            @PathVariable Long userId,
            @PathVariable Long stepId) {
        progressService.deleteProgress(userId, stepId);
        return ResponseEntity.noContent().build();
    }
}


