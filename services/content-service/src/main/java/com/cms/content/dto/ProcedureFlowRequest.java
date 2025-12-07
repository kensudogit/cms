package com.cms.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProcedureFlowRequest {
    @NotNull(message = "University ID is required")
    private Long universityId;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotBlank(message = "Flow type is required")
    private String flowType;

    private Integer displayOrder;
    private Boolean active = true;
}

