package com.cms.content.service;

import com.cms.content.dto.ProcedureStepRequest;
import com.cms.content.dto.ProcedureStepResponse;
import com.cms.content.entity.ProcedureStep;
import com.cms.content.repository.ProcedureStepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProcedureStepService {
    private final ProcedureStepRepository stepRepository;

    public List<ProcedureStepResponse> getStepsByFlow(Long flowId) {
        return stepRepository.findByFlowIdAndActiveTrueOrderByStepOrderAsc(flowId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProcedureStepResponse getStepById(Long id, Long flowId) {
        ProcedureStep step = stepRepository.findByIdAndFlowId(id, flowId)
                .orElseThrow(() -> new RuntimeException("Step not found"));
        return toResponse(step);
    }

    @Transactional
    public ProcedureStepResponse createStep(ProcedureStepRequest request) {
        ProcedureStep step = ProcedureStep.builder()
                .flowId(request.getFlowId())
                .contentId(request.getContentId())
                .name(request.getName())
                .description(request.getDescription())
                .stepOrder(request.getStepOrder())
                .requiredRole(request.getRequiredRole())
                .isRequired(request.getIsRequired())
                .dependsOnStepIds(request.getDependsOnStepIds())
                .active(request.getActive())
                .build();

        step = stepRepository.save(step);
        return toResponse(step);
    }

    @Transactional
    public ProcedureStepResponse updateStep(Long id, ProcedureStepRequest request) {
        ProcedureStep step = stepRepository.findByIdAndFlowId(id, request.getFlowId())
                .orElseThrow(() -> new RuntimeException("Step not found"));

        step.setContentId(request.getContentId());
        step.setName(request.getName());
        step.setDescription(request.getDescription());
        step.setStepOrder(request.getStepOrder());
        step.setRequiredRole(request.getRequiredRole());
        step.setIsRequired(request.getIsRequired());
        step.setDependsOnStepIds(request.getDependsOnStepIds());
        step.setActive(request.getActive());

        step = stepRepository.save(step);
        return toResponse(step);
    }

    @Transactional
    public void deleteStep(Long id, Long flowId) {
        ProcedureStep step = stepRepository.findByIdAndFlowId(id, flowId)
                .orElseThrow(() -> new RuntimeException("Step not found"));
        stepRepository.delete(step);
    }

    private ProcedureStepResponse toResponse(ProcedureStep step) {
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

