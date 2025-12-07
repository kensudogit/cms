package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "procedure_flows")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureFlow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long universityId; // 大学ID

    @Column(nullable = false)
    private String name; // フロー名（例: "入学手続きフロー", "卒業手続きフロー"）

    @Column(columnDefinition = "TEXT")
    private String description; // フローの説明

    @Column(nullable = false)
    private String flowType; // フロータイプ（例: "入学", "卒業", "在学中"）

    @Column
    private Integer displayOrder; // 表示順序

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


