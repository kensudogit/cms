package com.cms.content.dto;

import com.cms.content.entity.ProcedureProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureProgressResponse {
    private Long id;
    private Long userId;
    private Long stepId;
    private Long flowId;
    private Long universityId;
    private ProcedureProgress.ProgressStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String notes;
    private ProcedureStepResponse step;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


