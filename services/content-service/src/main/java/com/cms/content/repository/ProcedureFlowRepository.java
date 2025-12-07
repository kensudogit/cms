package com.cms.content.repository;

import com.cms.content.entity.ProcedureFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcedureFlowRepository extends JpaRepository<ProcedureFlow, Long> {
    List<ProcedureFlow> findByUniversityIdAndActiveTrue(Long universityId);
    List<ProcedureFlow> findByUniversityIdAndFlowTypeAndActiveTrue(Long universityId, String flowType);
    Optional<ProcedureFlow> findByIdAndUniversityId(Long id, Long universityId);
}


