package com.cms.content.controller;

import com.cms.content.dto.PaymentReconciliationRequest;
import com.cms.content.dto.PaymentReconciliationResponse;
import com.cms.content.service.PaymentReconciliationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-reconciliation")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentReconciliationController {
    private final PaymentReconciliationService reconciliationService;

    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<List<PaymentReconciliationResponse>> getReconciliationsByPayment(
            @PathVariable Long paymentId) {
        return ResponseEntity.ok(reconciliationService.getReconciliationsByPayment(paymentId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentReconciliationResponse>> getReconciliationsByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(reconciliationService.getReconciliationsByUser(userId));
    }

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<PaymentReconciliationResponse>> getReconciliationsByUniversity(
            @PathVariable Long universityId) {
        return ResponseEntity.ok(reconciliationService.getReconciliationsByUniversity(universityId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentReconciliationResponse> getReconciliationById(@PathVariable Long id) {
        return ResponseEntity.ok(reconciliationService.getReconciliationById(id));
    }

    @PostMapping
    public ResponseEntity<PaymentReconciliationResponse> createReconciliation(
            @Valid @RequestBody PaymentReconciliationRequest request) {
        PaymentReconciliationResponse response = reconciliationService.createReconciliation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentReconciliationResponse> updateReconciliation(
            @PathVariable Long id,
            @Valid @RequestBody PaymentReconciliationRequest request) {
        return ResponseEntity.ok(reconciliationService.updateReconciliation(id, request));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<PaymentReconciliationResponse> completeReconciliation(
            @PathVariable Long id,
            @RequestParam Long reconciledBy) {
        return ResponseEntity.ok(reconciliationService.completeReconciliation(id, reconciledBy));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReconciliation(@PathVariable Long id) {
        reconciliationService.deleteReconciliation(id);
        return ResponseEntity.noContent().build();
    }
}

