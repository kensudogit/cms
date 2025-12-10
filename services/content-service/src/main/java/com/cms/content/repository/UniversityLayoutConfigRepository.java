package com.cms.content.repository;

import com.cms.content.entity.UniversityLayoutConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniversityLayoutConfigRepository extends JpaRepository<UniversityLayoutConfig, Long> {
    List<UniversityLayoutConfig> findByUniversityId(Long universityId);
    
    List<UniversityLayoutConfig> findByUniversityIdAndLayoutTypeAndVisibleTrueOrderByDisplayOrderAsc(
            Long universityId, 
            UniversityLayoutConfig.LayoutType layoutType);
    
    Optional<UniversityLayoutConfig> findByUniversityIdAndLayoutTypeAndSectionKey(
            Long universityId, 
            UniversityLayoutConfig.LayoutType layoutType, 
            String sectionKey);
    
    boolean existsByUniversityIdAndLayoutTypeAndSectionKey(
            Long universityId, 
            UniversityLayoutConfig.LayoutType layoutType, 
            String sectionKey);
    
    void deleteByUniversityId(Long universityId);
}

