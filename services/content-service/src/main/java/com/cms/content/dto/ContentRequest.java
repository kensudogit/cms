package com.cms.content.dto;

import com.cms.content.entity.Content;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ContentRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String body;

    @NotBlank(message = "Slug is required")
    private String slug;

    private Content.Status status = Content.Status.DRAFT;

    @NotNull(message = "University ID is required")
    private Long universityId;

    private Long categoryId;

    private String contentType;

    private String metaDescription;

    private String metaKeywords;

    private LocalDateTime scheduledPublishAt;

    private LocalDateTime scheduledUnpublishAt;

    private Long templateId;

    private String customFields;
}



