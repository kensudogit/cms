package com.cms.content.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UniversityRequest {
    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;
    private String domain;
    private String settings;
    private Boolean active = true;
}


