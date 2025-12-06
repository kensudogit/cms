package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "content_templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long universityId; // 大学ID（マルチテナント対応）

    @Column(nullable = false)
    private String name; // テンプレート名

    @Column(columnDefinition = "TEXT")
    private String content; // テンプレートコンテンツ

    @Column
    private Long categoryId; // カテゴリID（オプション）

    @Column(nullable = false)
    private String type; // テンプレートタイプ（例: "入学手続き", "卒業手続き"）

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


