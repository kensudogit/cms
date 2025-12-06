package com.cms.content.controller;

import com.cms.content.dto.ContentRequest;
import com.cms.content.dto.ContentResponse;
import com.cms.content.dto.ContentVersionResponse;
import com.cms.content.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContentController {
    private final ContentService contentService;

    @GetMapping
    public ResponseEntity<List<ContentResponse>> getAllContents() {
        return ResponseEntity.ok(contentService.getAllContents());
    }

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<ContentResponse>> getContentsByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(contentService.getContentsByUniversity(universityId));
    }

    @GetMapping("/published")
    public ResponseEntity<List<ContentResponse>> getPublishedContents() {
        return ResponseEntity.ok(contentService.getPublishedContents());
    }

    @GetMapping("/published/university/{universityId}")
    public ResponseEntity<List<ContentResponse>> getPublishedContentsByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(contentService.getPublishedContentsByUniversity(universityId));
    }

    @GetMapping("/university/{universityId}/category/{categoryId}")
    public ResponseEntity<List<ContentResponse>> getContentsByCategory(
            @PathVariable Long universityId,
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(contentService.getContentsByCategory(universityId, categoryId));
    }

    @GetMapping("/university/{universityId}/type/{contentType}")
    public ResponseEntity<List<ContentResponse>> getContentsByType(
            @PathVariable Long universityId,
            @PathVariable String contentType) {
        return ResponseEntity.ok(contentService.getContentsByType(universityId, contentType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentResponse> getContentById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getContentById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ContentResponse> getContentBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(contentService.getContentBySlug(slug));
    }

    @GetMapping("/university/{universityId}/slug/{slug}")
    public ResponseEntity<ContentResponse> getContentByUniversityAndSlug(
            @PathVariable Long universityId,
            @PathVariable String slug) {
        return ResponseEntity.ok(contentService.getContentByUniversityAndSlug(universityId, slug));
    }

    @GetMapping("/{id}/versions")
    public ResponseEntity<List<ContentVersionResponse>> getContentVersions(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getContentVersions(id));
    }

    @GetMapping("/{id}/versions/{versionNumber}")
    public ResponseEntity<ContentVersionResponse> getContentVersion(
            @PathVariable Long id,
            @PathVariable Integer versionNumber) {
        return ResponseEntity.ok(contentService.getContentVersion(id, versionNumber));
    }

    @PostMapping("/{id}/restore/{versionNumber}")
    public ResponseEntity<ContentResponse> restoreFromVersion(
            @PathVariable Long id,
            @PathVariable Integer versionNumber,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long authorId) {
        return ResponseEntity.ok(contentService.restoreFromVersion(id, versionNumber, authorId));
    }

    @PostMapping
    public ResponseEntity<ContentResponse> createContent(
            @Valid @RequestBody ContentRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long authorId
    ) {
        ContentResponse response = contentService.createContent(request, authorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContentResponse> updateContent(
            @PathVariable Long id,
            @Valid @RequestBody ContentRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long authorId
    ) {
        ContentResponse response = contentService.updateContent(id, request, authorId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long authorId
    ) {
        contentService.deleteContent(id, authorId);
        return ResponseEntity.noContent().build();
    }
}



