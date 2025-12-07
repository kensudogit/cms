package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "procedure_progress", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "stepId"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; // ユーザーID（学生、父兄、大学関係者）

    @Column(nullable = false)
    private Long stepId; // 手続きステップID

    @Column(nullable = false)
    private Long flowId; // 手続きフローID

    @Column(nullable = false)
    private Long universityId; // 大学ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgressStatus status = ProgressStatus.NOT_STARTED;

    @Column
    private LocalDateTime startedAt; // 開始日時

    @Column
    private LocalDateTime completedAt; // 完了日時

    @Column(columnDefinition = "TEXT")
    private String notes; // メモ・備考

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
        if (status == ProgressStatus.COMPLETED && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
        if (status == ProgressStatus.IN_PROGRESS && startedAt == null) {
            startedAt = LocalDateTime.now();
        }
    }

    public enum ProgressStatus {
        NOT_STARTED,    // 未開始
        IN_PROGRESS,    // 進行中
        COMPLETED,      // 完了
        SKIPPED,        // スキップ
        BLOCKED         // ブロック（依存ステップが未完了）
    }
}

