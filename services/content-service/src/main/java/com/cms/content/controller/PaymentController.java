package com.cms.content.controller;

import com.cms.content.dto.PaymentRequest;
import com.cms.content.dto.PaymentResponse;
import com.cms.content.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUniversity(universityId));
    }

    @GetMapping("/user/{userId}/university/{universityId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByUserAndUniversity(
            @PathVariable Long userId,
            @PathVariable Long universityId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUserAndUniversity(userId, universityId));
    }

    @GetMapping("/flow/{flowId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByFlow(@PathVariable Long flowId) {
        return ResponseEntity.ok(paymentService.getPaymentsByFlow(flowId));
    }

    @GetMapping("/{id}/user/{userId}")
    public ResponseEntity<PaymentResponse> getPaymentById(
            @PathVariable Long id,
            @PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentById(id, userId));
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.updatePayment(id, request));
    }

    @PostMapping("/{id}/user/{userId}/complete")
    public ResponseEntity<PaymentResponse> completePayment(
            @PathVariable Long id,
            @PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.completePayment(id, userId));
    }

    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<Void> deletePayment(
            @PathVariable Long id,
            @PathVariable Long userId) {
        paymentService.deletePayment(id, userId);
        return ResponseEntity.noContent().build();
    }
}

