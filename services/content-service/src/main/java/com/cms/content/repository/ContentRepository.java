package com.cms.content.repository;

import com.cms.content.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    Optional<Content> findBySlug(String slug);
    List<Content> findByStatus(Content.Status status);
    List<Content> findByAuthorId(Long authorId);
    boolean existsBySlug(String slug);
}

