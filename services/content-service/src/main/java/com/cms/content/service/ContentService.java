package com.cms.content.service;

import com.cms.content.dto.ContentRequest;
import com.cms.content.dto.ContentResponse;
import com.cms.content.dto.ContentVersionResponse;
import com.cms.content.entity.Content;
import com.cms.content.entity.ContentVersion;
import com.cms.content.repository.ContentRepository;
import com.cms.content.repository.ContentVersionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentService {
    private final ContentRepository contentRepository;
    private final ContentVersionRepository contentVersionRepository;

    public List<ContentResponse> getAllContents() {
        return contentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ContentResponse> getContentsByUniversity(Long universityId) {
        return contentRepository.findByUniversityId(universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ContentResponse> getPublishedContents() {
        return contentRepository.findByStatus(Content.Status.PUBLISHED).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ContentResponse> getPublishedContentsByUniversity(Long universityId) {
        return contentRepository.findByUniversityIdAndStatus(universityId, Content.Status.PUBLISHED).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ContentResponse> getContentsByCategory(Long universityId, Long categoryId) {
        return contentRepository.findByUniversityIdAndCategoryId(universityId, categoryId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ContentResponse> getContentsByType(Long universityId, String contentType) {
        return contentRepository.findByUniversityIdAndContentType(universityId, contentType).stream()
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

    public ContentResponse getContentByUniversityAndSlug(Long universityId, String slug) {
        Content content = contentRepository.findByUniversityIdAndSlug(universityId, slug)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        return toResponse(content);
    }

    @Transactional
    public ContentResponse createContent(ContentRequest request, Long authorId) {
        // 大学単位でスラッグの重複チェック
        if (contentRepository.existsByUniversityIdAndSlug(request.getUniversityId(), request.getSlug())) {
            throw new RuntimeException("Slug already exists for this university");
        }

        Content content = Content.builder()
                .title(request.getTitle())
                .body(request.getBody())
                .slug(request.getSlug())
                .status(request.getStatus())
                .authorId(authorId)
                .universityId(request.getUniversityId())
                .categoryId(request.getCategoryId())
                .contentType(request.getContentType())
                .metaDescription(request.getMetaDescription())
                .metaKeywords(request.getMetaKeywords())
                .scheduledPublishAt(request.getScheduledPublishAt())
                .scheduledUnpublishAt(request.getScheduledUnpublishAt())
                .templateId(request.getTemplateId())
                .customFields(request.getCustomFields())
                .versionNumber(1)
                .build();

        // スケジュール公開の場合は自動的にPUBLISHEDにしない
        if (request.getScheduledPublishAt() != null && 
            request.getScheduledPublishAt().isBefore(LocalDateTime.now())) {
            content.setStatus(Content.Status.PUBLISHED);
        }

        content = contentRepository.save(content);
        
        // 初回バージョンを作成
        createVersion(content, authorId, "Initial version");
        
        return toResponse(content);
    }

    @Transactional
    public ContentResponse updateContent(Long id, ContentRequest request, Long authorId) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!content.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You don't have permission to update this content");
        }

        // 大学単位でスラッグの重複チェック
        if (!content.getSlug().equals(request.getSlug()) && 
            contentRepository.existsByUniversityIdAndSlug(request.getUniversityId(), request.getSlug())) {
            throw new RuntimeException("Slug already exists for this university");
        }

        // バージョン管理：変更がある場合は新しいバージョンを作成
        boolean hasChanges = !content.getTitle().equals(request.getTitle()) ||
                            !content.getBody().equals(request.getBody()) ||
                            !content.getSlug().equals(request.getSlug());

        if (hasChanges) {
            content.setVersionNumber(content.getVersionNumber() + 1);
            createVersion(content, authorId, "Content updated");
        }

        content.setTitle(request.getTitle());
        content.setBody(request.getBody());
        content.setSlug(request.getSlug());
        content.setStatus(request.getStatus());
        content.setCategoryId(request.getCategoryId());
        content.setContentType(request.getContentType());
        content.setMetaDescription(request.getMetaDescription());
        content.setMetaKeywords(request.getMetaKeywords());
        content.setScheduledPublishAt(request.getScheduledPublishAt());
        content.setScheduledUnpublishAt(request.getScheduledUnpublishAt());
        content.setCustomFields(request.getCustomFields());

        // スケジュール公開の処理
        if (request.getScheduledPublishAt() != null && 
            request.getScheduledPublishAt().isBefore(LocalDateTime.now()) &&
            content.getStatus() == Content.Status.DRAFT) {
            content.setStatus(Content.Status.PUBLISHED);
        }

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

    public List<ContentVersionResponse> getContentVersions(Long contentId) {
        return contentVersionRepository.findByContentIdOrderByVersionNumberDesc(contentId).stream()
                .map(this::toVersionResponse)
                .collect(Collectors.toList());
    }

    public ContentVersionResponse getContentVersion(Long contentId, Integer versionNumber) {
        ContentVersion version = contentVersionRepository.findByContentIdAndVersionNumber(contentId, versionNumber)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        return toVersionResponse(version);
    }

    @Transactional
    public ContentResponse restoreFromVersion(Long contentId, Integer versionNumber, Long authorId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        ContentVersion version = contentVersionRepository.findByContentIdAndVersionNumber(contentId, versionNumber)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        content.setTitle(version.getTitle());
        content.setBody(version.getBody());
        content.setSlug(version.getSlug());
        content.setVersionNumber(content.getVersionNumber() + 1);

        content = contentRepository.save(content);
        createVersion(content, authorId, "Restored from version " + versionNumber);

        return toResponse(content);
    }

    private void createVersion(Content content, Long authorId, String changeNote) {
        ContentVersion version = ContentVersion.builder()
                .contentId(content.getId())
                .versionNumber(content.getVersionNumber())
                .title(content.getTitle())
                .body(content.getBody())
                .slug(content.getSlug())
                .authorId(authorId)
                .changeNote(changeNote)
                .build();
        contentVersionRepository.save(version);
    }

    private ContentResponse toResponse(Content content) {
        return ContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .body(content.getBody())
                .slug(content.getSlug())
                .status(content.getStatus())
                .authorId(content.getAuthorId())
                .universityId(content.getUniversityId())
                .categoryId(content.getCategoryId())
                .contentType(content.getContentType())
                .metaDescription(content.getMetaDescription())
                .metaKeywords(content.getMetaKeywords())
                .scheduledPublishAt(content.getScheduledPublishAt())
                .scheduledUnpublishAt(content.getScheduledUnpublishAt())
                .versionNumber(content.getVersionNumber())
                .templateId(content.getTemplateId())
                .customFields(content.getCustomFields())
                .createdAt(content.getCreatedAt())
                .updatedAt(content.getUpdatedAt())
                .publishedAt(content.getPublishedAt())
                .build();
    }

    private ContentVersionResponse toVersionResponse(ContentVersion version) {
        return ContentVersionResponse.builder()
                .id(version.getId())
                .contentId(version.getContentId())
                .versionNumber(version.getVersionNumber())
                .title(version.getTitle())
                .body(version.getBody())
                .slug(version.getSlug())
                .authorId(version.getAuthorId())
                .changeNote(version.getChangeNote())
                .createdAt(version.getCreatedAt())
                .build();
    }
}



