package com.cms.content.service;

import com.cms.content.dto.*;
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
public class ProcedureFlowService {
    private final ProcedureFlowRepository flowRepository;
    private final ProcedureStepRepository stepRepository;
    private final ProcedureProgressRepository progressRepository;

    public List<ProcedureFlowResponse> getFlowsByUniversity(Long universityId) {
        return flowRepository.findByUniversityIdAndActiveTrue(universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProcedureFlowResponse> getFlowsByType(Long universityId, String flowType) {
        return flowRepository.findByUniversityIdAndFlowTypeAndActiveTrue(universityId, flowType).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProcedureFlowDetailResponse getFlowDetail(Long id, Long universityId, Long userId) {
        ProcedureFlow flow = flowRepository.findByIdAndUniversityId(id, universityId)
                .orElseThrow(() -> new RuntimeException("Flow not found"));

        List<ProcedureStep> steps = stepRepository.findByFlowIdAndActiveTrueOrderByStepOrderAsc(id);
        
        List<ProcedureStepWithProgressResponse> stepsWithProgress = steps.stream()
                .map(step -> {
                    ProcedureProgress.ProgressStatus progressStatus = ProcedureProgress.ProgressStatus.NOT_STARTED;
                    ProcedureProgress progress = null;
                    if (userId != null) {
                        progress = progressRepository.findByUserIdAndStepId(userId, step.getId()).orElse(null);
                        if (progress != null) {
                            progressStatus = progress.getStatus();
                        }
                    }

                    // 依存ステップの完了チェック
                    Boolean canStart = true;
                    if (step.getDependsOnStepIds() != null && !step.getDependsOnStepIds().isEmpty()) {
                        String[] dependsOnIds = step.getDependsOnStepIds().split(",");
                        for (String dependsOnId : dependsOnIds) {
                            try {
                                Long dependsOnStepId = Long.parseLong(dependsOnId.trim());
                                ProcedureProgress dependsOnProgress = userId != null 
                                    ? progressRepository.findByUserIdAndStepId(userId, dependsOnStepId).orElse(null)
                                    : null;
                                if (dependsOnProgress == null || 
                                    dependsOnProgress.getStatus() != ProcedureProgress.ProgressStatus.COMPLETED) {
                                    canStart = false;
                                    if (progressStatus == ProcedureProgress.ProgressStatus.NOT_STARTED) {
                                        progressStatus = ProcedureProgress.ProgressStatus.BLOCKED;
                                    }
                                    break;
                                }
                            } catch (NumberFormatException e) {
                                // 無効なIDは無視
                            }
                        }
                    }

                    return ProcedureStepWithProgressResponse.builder()
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
                            .progressStatus(progressStatus)
                            .progressStartedAt(progress != null ? progress.getStartedAt() : null)
                            .progressCompletedAt(progress != null ? progress.getCompletedAt() : null)
                            .progressNotes(progress != null ? progress.getNotes() : null)
                            .canStart(canStart)
                            .createdAt(step.getCreatedAt())
                            .updatedAt(step.getUpdatedAt())
                            .build();
                })
                .collect(Collectors.toList());

        // 統計情報の計算
        Long totalSteps = (long) steps.size();
        Long completedSteps = userId != null 
            ? progressRepository.countByUserIdAndFlowIdAndStatus(userId, id, ProcedureProgress.ProgressStatus.COMPLETED)
            : 0L;
        Long inProgressSteps = userId != null
            ? progressRepository.countByUserIdAndFlowIdAndStatus(userId, id, ProcedureProgress.ProgressStatus.IN_PROGRESS)
            : 0L;
        Long notStartedSteps = totalSteps - completedSteps - inProgressSteps;
        Double completionRate = totalSteps > 0 ? (completedSteps.doubleValue() / totalSteps.doubleValue()) * 100 : 0.0;

        return ProcedureFlowDetailResponse.builder()
                .id(flow.getId())
                .universityId(flow.getUniversityId())
                .name(flow.getName())
                .description(flow.getDescription())
                .flowType(flow.getFlowType())
                .displayOrder(flow.getDisplayOrder())
                .active(flow.getActive())
                .steps(stepsWithProgress)
                .totalSteps(totalSteps)
                .completedSteps(completedSteps)
                .inProgressSteps(inProgressSteps)
                .notStartedSteps(notStartedSteps)
                .completionRate(completionRate)
                .createdAt(flow.getCreatedAt())
                .updatedAt(flow.getUpdatedAt())
                .build();
    }

    @Transactional
    public ProcedureFlowResponse createFlow(ProcedureFlowRequest request) {
        ProcedureFlow flow = ProcedureFlow.builder()
                .universityId(request.getUniversityId())
                .name(request.getName())
                .description(request.getDescription())
                .flowType(request.getFlowType())
                .displayOrder(request.getDisplayOrder())
                .active(request.getActive())
                .build();

        flow = flowRepository.save(flow);
        return toResponse(flow);
    }

    @Transactional
    public ProcedureFlowResponse updateFlow(Long id, ProcedureFlowRequest request) {
        ProcedureFlow flow = flowRepository.findByIdAndUniversityId(id, request.getUniversityId())
                .orElseThrow(() -> new RuntimeException("Flow not found"));

        flow.setName(request.getName());
        flow.setDescription(request.getDescription());
        flow.setFlowType(request.getFlowType());
        flow.setDisplayOrder(request.getDisplayOrder());
        flow.setActive(request.getActive());

        flow = flowRepository.save(flow);
        return toResponse(flow);
    }

    @Transactional
    public void deleteFlow(Long id, Long universityId) {
        ProcedureFlow flow = flowRepository.findByIdAndUniversityId(id, universityId)
                .orElseThrow(() -> new RuntimeException("Flow not found"));
        flowRepository.delete(flow);
    }

    private ProcedureFlowResponse toResponse(ProcedureFlow flow) {
        List<ProcedureStepResponse> steps = stepRepository.findByFlowIdAndActiveTrueOrderByStepOrderAsc(flow.getId())
                .stream()
                .map(this::stepToResponse)
                .collect(Collectors.toList());

        return ProcedureFlowResponse.builder()
                .id(flow.getId())
                .universityId(flow.getUniversityId())
                .name(flow.getName())
                .description(flow.getDescription())
                .flowType(flow.getFlowType())
                .displayOrder(flow.getDisplayOrder())
                .active(flow.getActive())
                .steps(steps)
                .createdAt(flow.getCreatedAt())
                .updatedAt(flow.getUpdatedAt())
                .build();
    }

    private ProcedureStepResponse stepToResponse(ProcedureStep step) {
        return ProcedureStepResponse.builder()
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
}

