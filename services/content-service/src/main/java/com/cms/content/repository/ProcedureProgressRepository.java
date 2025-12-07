package com.cms.content.repository;

import com.cms.content.entity.ProcedureProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcedureProgressRepository extends JpaRepository<ProcedureProgress, Long> {
    List<ProcedureProgress> findByUserIdAndFlowId(Long userId, Long flowId);
    List<ProcedureProgress> findByUserIdAndUniversityId(Long userId, Long universityId);
    Optional<ProcedureProgress> findByUserIdAndStepId(Long userId, Long stepId);
    List<ProcedureProgress> findByStepId(Long stepId);
    Long countByFlowIdAndStatus(Long flowId, ProcedureProgress.ProgressStatus status);
    Long countByUserIdAndFlowIdAndStatus(Long userId, Long flowId, ProcedureProgress.ProgressStatus status);
}

