package com.cms.content.repository;

import com.cms.content.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);
    List<Payment> findByUniversityId(Long universityId);
    List<Payment> findByUserIdAndUniversityId(Long userId, Long universityId);
    List<Payment> findByFlowId(Long flowId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    Optional<Payment> findByIdAndUserId(Long id, Long userId);
}

