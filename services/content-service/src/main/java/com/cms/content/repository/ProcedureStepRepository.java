package com.cms.content.repository;

import com.cms.content.entity.ProcedureStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcedureStepRepository extends JpaRepository<ProcedureStep, Long> {
    List<ProcedureStep> findByFlowIdAndActiveTrueOrderByStepOrderAsc(Long flowId);
    Optional<ProcedureStep> findByIdAndFlowId(Long id, Long flowId);
    List<ProcedureStep> findByFlowId(Long flowId);
}


