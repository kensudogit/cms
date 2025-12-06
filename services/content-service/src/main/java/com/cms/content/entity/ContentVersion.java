package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "content_versions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long contentId; // 元のコンテンツID

    @Column(nullable = false)
    private Integer versionNumber; // バージョン番号

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false)
    private String slug;

    @Column(nullable = false)
    private Long authorId; // 変更したユーザーID

    @Column(columnDefinition = "TEXT")
    private String changeNote; // 変更メモ

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

