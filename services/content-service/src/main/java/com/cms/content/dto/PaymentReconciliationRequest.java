package com.cms.content.dto;

import com.cms.content.entity.PaymentReconciliation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentReconciliationRequest {
    @NotNull(message = "Payment ID is required")
    private Long paymentId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "University ID is required")
    private Long universityId;

    @NotNull(message = "Reconciled amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    private BigDecimal reconciledAmount;

    private PaymentReconciliation.ReconciliationStatus status = PaymentReconciliation.ReconciliationStatus.PENDING;
    private String reconciliationMethod;
    private Long reconciledBy;
    private String notes;
}

