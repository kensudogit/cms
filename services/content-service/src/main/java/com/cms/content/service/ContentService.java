package com.cms.content.service;

import com.cms.content.dto.ContentRequest;
import com.cms.content.dto.ContentResponse;
import com.cms.content.entity.Content;
import com.cms.content.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentService {
    private final ContentRepository contentRepository;

    public List<ContentResponse> getAllContents() {
        return contentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ContentResponse> getPublishedContents() {
        return contentRepository.findByStatus(Content.Status.PUBLISHED).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ContentResponse getContentById(Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        return toResponse(content);
    }

    public ContentResponse getContentBySlug(String slug) {
        Content content = contentRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        return toResponse(content);
    }

    @Transactional
    public ContentResponse createContent(ContentRequest request, Long authorId) {
        if (contentRepository.existsBySlug(request.getSlug())) {
            throw new RuntimeException("Slug already exists");
        }

        Content content = Content.builder()
                .title(request.getTitle())
                .body(request.getBody())
                .slug(request.getSlug())
                .status(request.getStatus())
                .authorId(authorId)
                .build();

        content = contentRepository.save(content);
        return toResponse(content);
    }

    @Transactional
    public ContentResponse updateContent(Long id, ContentRequest request, Long authorId) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!content.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You don't have permission to update this content");
        }

        if (!content.getSlug().equals(request.getSlug()) && contentRepository.existsBySlug(request.getSlug())) {
            throw new RuntimeException("Slug already exists");
        }

        content.setTitle(request.getTitle());
        content.setBody(request.getBody());
        content.setSlug(request.getSlug());
        content.setStatus(request.getStatus());

        content = contentRepository.save(content);
        return toResponse(content);
    }

    @Transactional
    public void deleteContent(Long id, Long authorId) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!content.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You don't have permission to delete this content");
        }

        contentRepository.delete(content);
    }

    private ContentResponse toResponse(Content content) {
        return ContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .body(content.getBody())
                .slug(content.getSlug())
                .status(content.getStatus())
                .authorId(content.getAuthorId())
                .createdAt(content.getCreatedAt())
                .updatedAt(content.getUpdatedAt())
                .publishedAt(content.getPublishedAt())
                .build();
    }
}



