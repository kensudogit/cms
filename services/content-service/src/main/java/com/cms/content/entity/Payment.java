package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; // 学生ID

    @Column(nullable = false)
    private Long universityId; // 大学ID

    @Column(nullable = false)
    private Long flowId; // 手続きフローID

    @Column(nullable = false)
    private String paymentType; // 支払い種別（入学金、授業料、その他）

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount; // 支払い金額

    @Column(nullable = false)
    private String currency = "JPY"; // 通貨

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column
    private String paymentMethod; // 支払い方法（銀行振込、クレジットカード、その他）

    @Column
    private String transactionId; // 取引ID

    @Column
    private LocalDateTime paidAt; // 支払い日時

    @Column(columnDefinition = "TEXT")
    private String notes; // 備考

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (status == PaymentStatus.COMPLETED && paidAt == null) {
            paidAt = LocalDateTime.now();
        }
    }

    public enum PaymentStatus {
        PENDING,       // 未払い
        PROCESSING,    // 処理中
        COMPLETED,     // 完了
        FAILED,        // 失敗
        REFUNDED,      // 返金済み
        CANCELLED      // キャンセル
    }
}


