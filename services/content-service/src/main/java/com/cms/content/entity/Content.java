package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.DRAFT;

    @Column(nullable = false)
    private Long authorId;

    @Column(nullable = false)
    private Long universityId; // 大学ID（マルチテナント対応）

    @Column
    private Long categoryId; // カテゴリID（オプション）

    @Column
    private String contentType; // コンテンツタイプ（例: "入学手続き", "卒業手続き", "お知らせ"）

    @Column(columnDefinition = "TEXT")
    private String metaDescription; // SEO用メタ説明

    @Column
    private String metaKeywords; // SEO用キーワード

    @Column
    private LocalDateTime scheduledPublishAt; // スケジュール公開日時

    @Column
    private LocalDateTime scheduledUnpublishAt; // スケジュール非公開日時

    @Column
    private Integer versionNumber = 1; // 現在のバージョン番号

    @Column
    private Long templateId; // 使用したテンプレートID（オプション）

    @Column(columnDefinition = "TEXT")
    private String customFields; // JSON形式のカスタムフィールド

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime publishedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (status == Status.PUBLISHED && publishedAt == null) {
            publishedAt = LocalDateTime.now();
        }
    }

    public enum Status {
        DRAFT, PUBLISHED, ARCHIVED
    }
}



