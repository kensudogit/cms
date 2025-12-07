package com.cms.content.controller;

import com.cms.content.dto.ContentCategoryRequest;
import com.cms.content.dto.ContentCategoryResponse;
import com.cms.content.service.ContentCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content-category")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContentCategoryController {
    private final ContentCategoryService categoryService;

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<ContentCategoryResponse>> getCategoriesByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(categoryService.getCategoriesByUniversity(universityId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentCategoryResponse> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("/university/{universityId}/slug/{slug}")
    public ResponseEntity<ContentCategoryResponse> getCategoryBySlug(
            @PathVariable Long universityId,
            @PathVariable String slug) {
        return ResponseEntity.ok(categoryService.getCategoryBySlug(universityId, slug));
    }

    @PostMapping
    public ResponseEntity<ContentCategoryResponse> createCategory(@Valid @RequestBody ContentCategoryRequest request) {
        ContentCategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContentCategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody ContentCategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}



