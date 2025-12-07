package com.cms.content.dto;

import com.cms.content.entity.ProcedureProgress;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProcedureProgressRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Step ID is required")
    private Long stepId;

    @NotNull(message = "Flow ID is required")
    private Long flowId;

    @NotNull(message = "University ID is required")
    private Long universityId;

    private ProcedureProgress.ProgressStatus status = ProcedureProgress.ProgressStatus.NOT_STARTED;
    private String notes;
}

