package com.cms.content.controller;

import com.cms.content.dto.ContentRequest;
import com.cms.content.dto.ContentResponse;
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

    @GetMapping("/published")
    public ResponseEntity<List<ContentResponse>> getPublishedContents() {
        return ResponseEntity.ok(contentService.getPublishedContents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentResponse> getContentById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getContentById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ContentResponse> getContentBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(contentService.getContentBySlug(slug));
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



