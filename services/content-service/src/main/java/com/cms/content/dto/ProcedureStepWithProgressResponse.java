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
public class ProcedureStepWithProgressResponse {
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
    private ProcedureProgress.ProgressStatus progressStatus;
    private LocalDateTime progressStartedAt;
    private LocalDateTime progressCompletedAt;
    private String progressNotes;
    private Boolean canStart; // 依存ステップが完了しているか
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


