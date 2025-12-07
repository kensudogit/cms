package com.cms.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureStepResponse {
    private Long id;
    private Long flowId;
    private Long contentId;
    private String name;
    private String description;
    private Integer stepOrder;
    private String requiredRole;
    private Boolean isRequired;
    private String dependsOnStepIds;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

