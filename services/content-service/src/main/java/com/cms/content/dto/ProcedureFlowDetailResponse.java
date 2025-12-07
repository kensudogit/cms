package com.cms.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureFlowDetailResponse {
    private Long id;
    private Long universityId;
    private String name;
    private String description;
    private String flowType;
    private Integer displayOrder;
    private Boolean active;
    private List<ProcedureStepWithProgressResponse> steps;
    private Long totalSteps;
    private Long completedSteps;
    private Long inProgressSteps;
    private Long notStartedSteps;
    private Double completionRate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


