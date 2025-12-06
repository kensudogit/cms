package com.cms.content.repository;

import com.cms.content.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    Optional<Content> findBySlug(String slug);
    Optional<Content> findByUniversityIdAndSlug(Long universityId, String slug);
    List<Content> findByStatus(Content.Status status);
    List<Content> findByUniversityIdAndStatus(Long universityId, Content.Status status);
    List<Content> findByAuthorId(Long authorId);
    List<Content> findByUniversityId(Long universityId);
    List<Content> findByUniversityIdAndCategoryId(Long universityId, Long categoryId);
    List<Content> findByUniversityIdAndContentType(Long universityId, String contentType);
    boolean existsBySlug(String slug);
    boolean existsByUniversityIdAndSlug(Long universityId, String slug);
}



