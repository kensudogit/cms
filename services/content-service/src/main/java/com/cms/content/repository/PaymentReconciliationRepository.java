package com.cms.content.repository;

import com.cms.content.entity.PaymentReconciliation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentReconciliationRepository extends JpaRepository<PaymentReconciliation, Long> {
    List<PaymentReconciliation> findByPaymentId(Long paymentId);
    List<PaymentReconciliation> findByUserId(Long userId);
    List<PaymentReconciliation> findByUniversityId(Long universityId);
    List<PaymentReconciliation> findByUserIdAndUniversityId(Long userId, Long universityId);
    List<PaymentReconciliation> findByStatus(PaymentReconciliation.ReconciliationStatus status);
    Optional<PaymentReconciliation> findByPaymentIdAndStatus(Long paymentId, PaymentReconciliation.ReconciliationStatus status);
}


