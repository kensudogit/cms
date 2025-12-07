package com.cms.content.service;

import com.cms.content.dto.PaymentReconciliationRequest;
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
public class PaymentReconciliationService {
    private final PaymentReconciliationRepository reconciliationRepository;
    private final PaymentRepository paymentRepository;

    public List<PaymentReconciliationResponse> getReconciliationsByPayment(Long paymentId) {
        return reconciliationRepository.findByPaymentId(paymentId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentReconciliationResponse> getReconciliationsByUser(Long userId) {
        return reconciliationRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentReconciliationResponse> getReconciliationsByUniversity(Long universityId) {
        return reconciliationRepository.findByUniversityId(universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PaymentReconciliationResponse getReconciliationById(Long id) {
        PaymentReconciliation reconciliation = reconciliationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reconciliation not found"));
        return toResponse(reconciliation);
    }

    @Transactional
    public PaymentReconciliationResponse createReconciliation(PaymentReconciliationRequest request) {
        // 支払いが存在するか確認
        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // 既に完了した消込があるか確認
        if (reconciliationRepository.findByPaymentIdAndStatus(
                request.getPaymentId(), PaymentReconciliation.ReconciliationStatus.COMPLETED).isPresent()) {
            throw new RuntimeException("Payment already reconciled");
        }

        PaymentReconciliation reconciliation = PaymentReconciliation.builder()
                .paymentId(request.getPaymentId())
                .userId(request.getUserId())
                .universityId(request.getUniversityId())
                .reconciledAmount(request.getReconciledAmount())
                .status(request.getStatus())
                .reconciliationMethod(request.getReconciliationMethod())
                .reconciledBy(request.getReconciledBy())
                .notes(request.getNotes())
                .build();

        reconciliation = reconciliationRepository.save(reconciliation);

        // 消込が完了した場合、支払いステータスを更新
        if (reconciliation.getStatus() == PaymentReconciliation.ReconciliationStatus.COMPLETED) {
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            paymentRepository.save(payment);
        }

        return toResponse(reconciliation);
    }

    @Transactional
    public PaymentReconciliationResponse updateReconciliation(Long id, PaymentReconciliationRequest request) {
        PaymentReconciliation reconciliation = reconciliationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reconciliation not found"));

        reconciliation.setReconciledAmount(request.getReconciledAmount());
        reconciliation.setStatus(request.getStatus());
        reconciliation.setReconciliationMethod(request.getReconciliationMethod());
        reconciliation.setReconciledBy(request.getReconciledBy());
        reconciliation.setNotes(request.getNotes());

        reconciliation = reconciliationRepository.save(reconciliation);

        // 消込が完了した場合、支払いステータスを更新
        if (reconciliation.getStatus() == PaymentReconciliation.ReconciliationStatus.COMPLETED) {
            Payment payment = paymentRepository.findById(reconciliation.getPaymentId())
                    .orElseThrow(() -> new RuntimeException("Payment not found"));
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            paymentRepository.save(payment);
        }

        return toResponse(reconciliation);
    }

    @Transactional
    public PaymentReconciliationResponse completeReconciliation(Long id, Long reconciledBy) {
        PaymentReconciliation reconciliation = reconciliationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reconciliation not found"));

        reconciliation.setStatus(PaymentReconciliation.ReconciliationStatus.COMPLETED);
        reconciliation.setReconciledBy(reconciledBy);
        reconciliation = reconciliationRepository.save(reconciliation);

        // 支払いステータスを更新
        Payment payment = paymentRepository.findById(reconciliation.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        paymentRepository.save(payment);

        return toResponse(reconciliation);
    }

    @Transactional
    public void deleteReconciliation(Long id) {
        PaymentReconciliation reconciliation = reconciliationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reconciliation not found"));
        reconciliationRepository.delete(reconciliation);
    }

    private PaymentReconciliationResponse toResponse(PaymentReconciliation reconciliation) {
        return PaymentReconciliationResponse.builder()
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
}

