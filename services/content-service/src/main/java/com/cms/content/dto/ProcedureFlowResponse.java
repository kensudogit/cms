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
public class ProcedureFlowResponse {
    private Long id;
    private Long universityId;
    private String name;
    private String description;
    private String flowType;
    private Integer displayOrder;
    private Boolean active;
    private List<ProcedureStepResponse> steps;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

