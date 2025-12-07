package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "procedure_steps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long flowId; // 手続きフローID

    @Column(nullable = false)
    private Long contentId; // 関連するコンテンツID

    @Column(nullable = false)
    private String name; // ステップ名

    @Column(columnDefinition = "TEXT")
    private String description; // ステップの説明

    @Column(nullable = false)
    private Integer stepOrder; // ステップの順序（1, 2, 3...）

    @Column
    private String requiredRole; // 必要な役割（例: "STUDENT", "PARENT", "STAFF"）

    @Column
    private Boolean isRequired = true; // 必須ステップかどうか

    @Column
    private String dependsOnStepIds; // 依存するステップID（カンマ区切り）

    @Column(nullable = false)
    private Boolean active = true;

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
    }
}


