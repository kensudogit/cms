package com.cms.content.dto;

import com.cms.content.entity.Content;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContentRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String body;

    @NotBlank(message = "Slug is required")
    private String slug;

    private Content.Status status = Content.Status.DRAFT;
}



