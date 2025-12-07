package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_reconciliations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentReconciliation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long paymentId; // 支払いID

    @Column(nullable = false)
    private Long userId; // 学生ID

    @Column(nullable = false)
    private Long universityId; // 大学ID

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal reconciledAmount; // 消込金額

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReconciliationStatus status = ReconciliationStatus.PENDING;

    @Column
    private String reconciliationMethod; // 消込方法（自動、手動）

    @Column
    private LocalDateTime reconciledAt; // 消込日時

    @Column
    private Long reconciledBy; // 消込実施者ID（大学職員など）

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
        if (status == ReconciliationStatus.COMPLETED && reconciledAt == null) {
            reconciledAt = LocalDateTime.now();
        }
    }

    public enum ReconciliationStatus {
        PENDING,       // 未消込
        IN_PROGRESS,   // 消込中
        COMPLETED,     // 消込完了
        FAILED,        // 消込失敗
        CANCELLED      // キャンセル
    }
}

