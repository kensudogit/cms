package com.cms.content.service;

import com.cms.content.dto.PaymentRequest;
import com.cms.content.dto.PaymentResponse;
import com.cms.content.dto.PaymentReconciliationResponse;
import com.cms.content.entity.Payment;
import com.cms.content.entity.PaymentReconciliation;
import com.cms.content.repository.PaymentRepository;
import com.cms.content.repository.PaymentReconciliationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentReconciliationRepository reconciliationRepository;

    public List<PaymentResponse> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsByUniversity(Long universityId) {
        return paymentRepository.findByUniversityId(universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsByUserAndUniversity(Long userId, Long universityId) {
        return paymentRepository.findByUserIdAndUniversityId(userId, universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsByFlow(Long flowId) {
        return paymentRepository.findByFlowId(flowId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PaymentResponse getPaymentById(Long id, Long userId) {
        Payment payment = paymentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return toResponse(payment);
    }

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Payment payment = Payment.builder()
                .userId(request.getUserId())
                .universityId(request.getUniversityId())
                .flowId(request.getFlowId())
                .paymentType(request.getPaymentType())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .status(request.getStatus())
                .paymentMethod(request.getPaymentMethod())
                .transactionId(request.getTransactionId())
                .notes(request.getNotes())
                .build();

        payment = paymentRepository.save(payment);
        return toResponse(payment);
    }

    @Transactional
    public PaymentResponse updatePayment(Long id, PaymentRequest request) {
        Payment payment = paymentRepository.findByIdAndUserId(id, request.getUserId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setPaymentType(request.getPaymentType());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency());
        payment.setStatus(request.getStatus());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionId(request.getTransactionId());
        payment.setNotes(request.getNotes());

        payment = paymentRepository.save(payment);
        return toResponse(payment);
    }

    @Transactional
    public PaymentResponse completePayment(Long id, Long userId) {
        Payment payment = paymentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment = paymentRepository.save(payment);
        return toResponse(payment);
    }

    @Transactional
    public void deletePayment(Long id, Long userId) {
        Payment payment = paymentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        paymentRepository.delete(payment);
    }

    private PaymentResponse toResponse(Payment payment) {
        PaymentReconciliation reconciliation = reconciliationRepository
                .findByPaymentIdAndStatus(payment.getId(), PaymentReconciliation.ReconciliationStatus.COMPLETED)
                .orElse(null);

        PaymentReconciliationResponse reconciliationResponse = null;
        if (reconciliation != null) {
            reconciliationResponse = PaymentReconciliationResponse.builder()
                    .id(reconciliation.getId())
                    .paymentId(reconciliation.getPaymentId())
                    .userId(reconciliation.getUserId())
                    .universityId(reconciliation.getUniversityId())
                    .reconciledAmount(reconciliation.getReconciledAmount())
                    .status(reconciliation.getStatus())
                    .reconciliationMethod(reconciliation.getReconciliationMethod())
                    .reconciledAt(reconciliation.getReconciledAt())
                    .reconciledBy(reconciliation.getReconciledBy())
                    .notes(reconciliation.getNotes())
                    .createdAt(reconciliation.getCreatedAt())
                    .updatedAt(reconciliation.getUpdatedAt())
                    .build();
        }

        return PaymentResponse.builder()
                .id(payment.getId())
                .userId(payment.getUserId())
                .universityId(payment.getUniversityId())
                .flowId(payment.getFlowId())
                .paymentType(payment.getPaymentType())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .paidAt(payment.getPaidAt())
                .notes(payment.getNotes())
                .reconciliation(reconciliationResponse)
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}


