package com.cms.content.dto;

import com.cms.content.entity.PaymentReconciliation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentReconciliationResponse {
    private Long id;
    private Long paymentId;
    private Long userId;
    private Long universityId;
    private BigDecimal reconciledAmount;
    private PaymentReconciliation.ReconciliationStatus status;
    private String reconciliationMethod;
    private LocalDateTime reconciledAt;
    private Long reconciledBy;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


