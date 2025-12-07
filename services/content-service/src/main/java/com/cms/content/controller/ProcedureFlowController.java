package com.cms.content.controller;

import com.cms.content.dto.ProcedureFlowDetailResponse;
import com.cms.content.dto.ProcedureFlowRequest;
import com.cms.content.dto.ProcedureFlowResponse;
import com.cms.content.service.ProcedureFlowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedure-flow")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProcedureFlowController {
    private final ProcedureFlowService flowService;

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<ProcedureFlowResponse>> getFlowsByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(flowService.getFlowsByUniversity(universityId));
    }

    @GetMapping("/university/{universityId}/type/{flowType}")
    public ResponseEntity<List<ProcedureFlowResponse>> getFlowsByType(
            @PathVariable Long universityId,
            @PathVariable String flowType) {
        return ResponseEntity.ok(flowService.getFlowsByType(universityId, flowType));
    }

    @GetMapping("/{id}/university/{universityId}")
    public ResponseEntity<ProcedureFlowDetailResponse> getFlowDetail(
            @PathVariable Long id,
            @PathVariable Long universityId,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(flowService.getFlowDetail(id, universityId, userId));
    }

    @PostMapping
    public ResponseEntity<ProcedureFlowResponse> createFlow(@Valid @RequestBody ProcedureFlowRequest request) {
        ProcedureFlowResponse response = flowService.createFlow(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProcedureFlowResponse> updateFlow(
            @PathVariable Long id,
            @Valid @RequestBody ProcedureFlowRequest request) {
        return ResponseEntity.ok(flowService.updateFlow(id, request));
    }

    @DeleteMapping("/{id}/university/{universityId}")
    public ResponseEntity<Void> deleteFlow(
            @PathVariable Long id,
            @PathVariable Long universityId) {
        flowService.deleteFlow(id, universityId);
        return ResponseEntity.noContent().build();
    }
}


