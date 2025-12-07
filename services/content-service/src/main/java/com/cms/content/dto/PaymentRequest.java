package com.cms.content.dto;

import com.cms.content.entity.Payment;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "University ID is required")
    private Long universityId;

    @NotNull(message = "Flow ID is required")
    private Long flowId;

    @NotBlank(message = "Payment type is required")
    private String paymentType;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String currency = "JPY";
    private Payment.PaymentStatus status = Payment.PaymentStatus.PENDING;
    private String paymentMethod;
    private String transactionId;
    private String notes;
}


