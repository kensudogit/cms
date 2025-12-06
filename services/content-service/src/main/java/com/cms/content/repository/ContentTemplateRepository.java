package com.cms.content.repository;

import com.cms.content.entity.ContentTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentTemplateRepository extends JpaRepository<ContentTemplate, Long> {
    List<ContentTemplate> findByUniversityIdAndActiveTrue(Long universityId);
    List<ContentTemplate> findByUniversityIdAndTypeAndActiveTrue(Long universityId, String type);
    Optional<ContentTemplate> findByIdAndUniversityId(Long id, Long universityId);
}


