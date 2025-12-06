package com.cms.content.dto;

import com.cms.content.entity.Content;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentResponse {
    private Long id;
    private String title;
    private String body;
    private String slug;
    private Content.Status status;
    private Long authorId;
    private Long universityId;
    private Long categoryId;
    private String contentType;
    private String metaDescription;
    private String metaKeywords;
    private LocalDateTime scheduledPublishAt;
    private LocalDateTime scheduledUnpublishAt;
    private Integer versionNumber;
    private Long templateId;
    private String customFields;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}



