package com.cms.content.service;

import com.cms.content.dto.ProcedureProgressRequest;
import com.cms.content.dto.ProcedureProgressResponse;
import com.cms.content.dto.ProcedureStepResponse;
import com.cms.content.entity.ProcedureFlow;
import com.cms.content.entity.ProcedureProgress;
import com.cms.content.entity.ProcedureStep;
import com.cms.content.repository.ProcedureFlowRepository;
import com.cms.content.repository.ProcedureProgressRepository;
import com.cms.content.repository.ProcedureStepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProcedureProgressService {
    private final ProcedureProgressRepository progressRepository;
    private final ProcedureStepRepository stepRepository;
    private final ProcedureFlowRepository flowRepository;

    public List<ProcedureProgressResponse> getProgressByUserAndFlow(Long userId, Long flowId) {
        return progressRepository.findByUserIdAndFlowId(userId, flowId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProcedureProgressResponse> getProgressByUser(Long userId, Long universityId) {
        return progressRepository.findByUserIdAndUniversityId(userId, universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProcedureProgressResponse getProgress(Long userId, Long stepId) {
        ProcedureProgress progress = progressRepository.findByUserIdAndStepId(userId, stepId)
                .orElse(null);
        
        if (progress == null) {
            return null;
        }
        
        return toResponse(progress);
    }

    @Transactional
    public ProcedureProgressResponse updateProgress(ProcedureProgressRequest request) {
        ProcedureProgress progress = progressRepository.findByUserIdAndStepId(
                request.getUserId(), request.getStepId()).orElse(null);

        if (progress == null) {
            // ステップからフローIDを取得
            ProcedureStep step = stepRepository.findById(request.getStepId())
                    .orElseThrow(() -> new RuntimeException("Step not found"));
            
            progress = ProcedureProgress.builder()
                    .userId(request.getUserId())
                    .stepId(request.getStepId())
                    .flowId(step.getFlowId())
                    .universityId(request.getUniversityId())
                    .status(request.getStatus())
                    .notes(request.getNotes())
                    .build();
        } else {
            progress.setStatus(request.getStatus());
            progress.setNotes(request.getNotes());
        }

        progress = progressRepository.save(progress);
        return toResponse(progress);
    }

    @Transactional
    public ProcedureProgressResponse startStep(Long userId, Long stepId, Long universityId) {
        ProcedureProgress progress = progressRepository.findByUserIdAndStepId(userId, stepId)
                .orElse(null);

        if (progress == null) {
            ProcedureStep step = stepRepository.findById(stepId)
                    .orElseThrow(() -> new RuntimeException("Step not found"));
            
            progress = ProcedureProgress.builder()
                    .userId(userId)
                    .stepId(stepId)
                    .flowId(step.getFlowId())
                    .universityId(universityId)
                    .status(ProcedureProgress.ProgressStatus.IN_PROGRESS)
                    .build();
        } else {
            progress.setStatus(ProcedureProgress.ProgressStatus.IN_PROGRESS);
        }

        progress = progressRepository.save(progress);
        return toResponse(progress);
    }

    @Transactional
    public ProcedureProgressResponse completeStep(Long userId, Long stepId) {
        ProcedureProgress progress = progressRepository.findByUserIdAndStepId(userId, stepId)
                .orElseThrow(() -> new RuntimeException("Progress not found"));

        progress.setStatus(ProcedureProgress.ProgressStatus.COMPLETED);
        progress = progressRepository.save(progress);
        return toResponse(progress);
    }

    @Transactional
    public void deleteProgress(Long userId, Long stepId) {
        ProcedureProgress progress = progressRepository.findByUserIdAndStepId(userId, stepId)
                .orElseThrow(() -> new RuntimeException("Progress not found"));
        progressRepository.delete(progress);
    }

    private ProcedureProgressResponse toResponse(ProcedureProgress progress) {
        ProcedureStep step = stepRepository.findById(progress.getStepId()).orElse(null);
        ProcedureStepResponse stepResponse = null;
        if (step != null) {
            stepResponse = ProcedureStepResponse.builder()
                    .id(step.getId())
                    .flowId(step.getFlowId())
                    .contentId(step.getContentId())
                    .name(step.getName())
                    .description(step.getDescription())
                    .stepOrder(step.getStepOrder())
                    .requiredRole(step.getRequiredRole())
                    .isRequired(step.getIsRequired())
                    .dependsOnStepIds(step.getDependsOnStepIds())
                    .active(step.getActive())
                    .createdAt(step.getCreatedAt())
                    .updatedAt(step.getUpdatedAt())
                    .build();
        }

        return ProcedureProgressResponse.builder()
                .id(progress.getId())
                .userId(progress.getUserId())
                .stepId(progress.getStepId())
                .flowId(progress.getFlowId())
                .universityId(progress.getUniversityId())
                .status(progress.getStatus())
                .startedAt(progress.getStartedAt())
                .completedAt(progress.getCompletedAt())
                .notes(progress.getNotes())
                .step(stepResponse)
                .createdAt(progress.getCreatedAt())
                .updatedAt(progress.getUpdatedAt())
                .build();
    }
}

