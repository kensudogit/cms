package com.cms.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProcedureStepRequest {
    @NotNull(message = "Flow ID is required")
    private Long flowId;

    @NotNull(message = "Content ID is required")
    private Long contentId;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Step order is required")
    private Integer stepOrder;

    private String requiredRole;
    private Boolean isRequired = true;
    private String dependsOnStepIds;
    private Boolean active = true;
}

