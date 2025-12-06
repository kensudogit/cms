package com.cms.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ContentTemplateRequest {
    @NotNull(message = "University ID is required")
    private Long universityId;

    @NotBlank(message = "Name is required")
    private String name;

    private String content;
    private Long categoryId;

    @NotBlank(message = "Type is required")
    private String type;

    private Boolean active = true;
}


