package com.cms.content.repository;

import com.cms.content.entity.UniversityFieldConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniversityFieldConfigRepository extends JpaRepository<UniversityFieldConfig, Long> {
    List<UniversityFieldConfig> findByUniversityId(Long universityId);
    
    List<UniversityFieldConfig> findByUniversityIdAndVisibleTrueOrderByDisplayOrderAsc(Long universityId);
    
    Optional<UniversityFieldConfig> findByUniversityIdAndFieldKey(Long universityId, String fieldKey);
    
    boolean existsByUniversityIdAndFieldKey(Long universityId, String fieldKey);
    
    void deleteByUniversityId(Long universityId);
}

