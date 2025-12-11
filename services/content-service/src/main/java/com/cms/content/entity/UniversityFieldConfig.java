package com.cms.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 大学ごとのフィールド設定エンティティ
 * 各大学で出力される項目、編集方法、表示位置を定義
 */
@Entity
@Table(name = "university_field_configs", uniqueConstraints = @UniqueConstraint(columnNames = { "university_id",
        "field_key" }))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UniversityFieldConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long universityId; // 大学ID

    @Column(nullable = false)
    private String fieldKey; // フィールドキー（例: "title", "body", "custom_field_1"）

    @Column(nullable = false)
    private String fieldName; // フィールド名（表示用）

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FieldType fieldType; // フィールドタイプ

    @Column(columnDefinition = "TEXT")
    private String defaultValue; // デフォルト値

    @Column(nullable = false)
    private Boolean required = false; // 必須かどうか

    @Column(nullable = false)
    private Boolean visible = true; // 表示するかどうか

    @Column(nullable = false)
    private Integer displayOrder = 0; // 表示順序

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EditMethod editMethod; // 編集方法

    @Column(columnDefinition = "TEXT")
    private String editOptions; // 編集オプション（JSON形式、選択肢など）

    @Column(columnDefinition = "TEXT")
    private String validationRules; // バリデーションルール（JSON形式）

    @Column(columnDefinition = "TEXT")
    private String displayConfig; // 表示設定（JSON形式、位置、サイズなど）

    @Column(columnDefinition = "TEXT")
    private String description; // フィールドの説明

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
     * フィールドタイプ
     */
    public enum FieldType {
        TEXT, // テキスト
        TEXTAREA, // テキストエリア
        RICH_TEXT, // リッチテキスト（WYSIWYG）
        NUMBER, // 数値
        DATE, // 日付
        DATETIME, // 日時
        BOOLEAN, // 真偽値
        SELECT, // セレクトボックス
        MULTI_SELECT, // 複数選択
        FILE, // ファイル
        IMAGE, // 画像
        URL, // URL
        EMAIL, // メールアドレス
        JSON // JSON
    }

    /**
     * 編集方法
     */
    public enum EditMethod {
        INPUT, // 通常の入力
        WYSIWYG, // WYSIWYGエディタ
        MARKDOWN, // Markdownエディタ
        CODE, // コードエディタ
        DATE_PICKER, // 日付ピッカー
        DATETIME_PICKER, // 日時ピッカー
        FILE_UPLOAD, // ファイルアップロード
        IMAGE_UPLOAD, // 画像アップロード
        SELECT_DROPDOWN, // ドロップダウン選択
        CHECKBOX, // チェックボックス
        RADIO, // ラジオボタン
        SLIDER, // スライダー
        COLOR_PICKER // カラーピッカー
    }
}
