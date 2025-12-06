package com.cms.content.repository;

import com.cms.content.entity.ContentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentCategoryRepository extends JpaRepository<ContentCategory, Long> {
    List<ContentCategory> findByUniversityIdAndActiveTrue(Long universityId);
    Optional<ContentCategory> findByUniversityIdAndSlug(Long universityId, String slug);
    boolean existsByUniversityIdAndSlug(Long universityId, String slug);
}


