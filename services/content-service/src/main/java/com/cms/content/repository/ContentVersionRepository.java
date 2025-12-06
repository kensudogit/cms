package com.cms.content.repository;

import com.cms.content.entity.ContentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentVersionRepository extends JpaRepository<ContentVersion, Long> {
    List<ContentVersion> findByContentIdOrderByVersionNumberDesc(Long contentId);
    Optional<ContentVersion> findByContentIdAndVersionNumber(Long contentId, Integer versionNumber);
    Integer countByContentId(Long contentId);
}


