package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 大学ごとのレイアウト設定エンティティ
 * 各大学のレイアウト構造、セクション配置を定義
 */
@Entity
@Table(name = "university_layout_configs", uniqueConstraints = @UniqueConstraint(columnNames = { "university_id",
        "layout_type", "section_key" }))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UniversityLayoutConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long universityId; // 大学ID

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LayoutType layoutType; // レイアウトタイプ（コンテンツ編集、一覧表示など）

    @Column(nullable = false)
    private String sectionKey; // セクションキー（例: "header", "main", "sidebar", "footer"）

    @Column(nullable = false)
    private String sectionName; // セクション名（表示用）

    @Column(nullable = false)
    private Integer displayOrder = 0; // 表示順序

    @Column(nullable = false)
    private Boolean visible = true; // 表示するかどうか

    @Column(columnDefinition = "TEXT")
    private String layoutConfig; // レイアウト設定（JSON形式、幅、高さ、位置など）

    @Column(columnDefinition = "TEXT")
    private String fieldKeys; // このセクションに表示するフィールドキー（JSON配列形式）

    @Column(columnDefinition = "TEXT")
    private String styleConfig; // スタイル設定（JSON形式、CSSなど）

    @Column(columnDefinition = "TEXT")
    private String description; // セクションの説明

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

    /**
     * レイアウトタイプ
     */
    public enum LayoutType {
        CONTENT_EDIT, // コンテンツ編集画面
        CONTENT_LIST, // コンテンツ一覧画面
        CONTENT_DETAIL, // コンテンツ詳細画面
        DASHBOARD, // ダッシュボード
        ADMIN_PANEL // 管理パネル
    }
}
