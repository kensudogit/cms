package com.cms.content.dto;

import com.cms.content.entity.Payment;
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
public class PaymentResponse {
    private Long id;
    private Long userId;
    private Long universityId;
    private Long flowId;
    private String paymentType;
    private BigDecimal amount;
    private String currency;
    private Payment.PaymentStatus status;
    private String paymentMethod;
    private String transactionId;
    private LocalDateTime paidAt;
    private String notes;
    private PaymentReconciliationResponse reconciliation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

