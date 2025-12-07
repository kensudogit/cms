package com.cms.content.service;

import com.cms.content.dto.ContentCategoryRequest;
import com.cms.content.dto.ContentCategoryResponse;
import com.cms.content.entity.ContentCategory;
import com.cms.content.repository.ContentCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentCategoryService {
    private final ContentCategoryRepository categoryRepository;

    public List<ContentCategoryResponse> getCategoriesByUniversity(Long universityId) {
        return categoryRepository.findByUniversityIdAndActiveTrue(universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ContentCategoryResponse getCategoryById(Long id) {
        ContentCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return toResponse(category);
    }

    public ContentCategoryResponse getCategoryBySlug(Long universityId, String slug) {
        ContentCategory category = categoryRepository.findByUniversityIdAndSlug(universityId, slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return toResponse(category);
    }

    @Transactional
    public ContentCategoryResponse createCategory(ContentCategoryRequest request) {
        if (categoryRepository.existsByUniversityIdAndSlug(request.getUniversityId(), request.getSlug())) {
            throw new RuntimeException("Category slug already exists for this university");
        }

        ContentCategory category = ContentCategory.builder()
                .universityId(request.getUniversityId())
                .name(request.getName())
                .description(request.getDescription())
                .slug(request.getSlug())
                .displayOrder(request.getDisplayOrder())
                .active(request.getActive())
                .build();

        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public ContentCategoryResponse updateCategory(Long id, ContentCategoryRequest request) {
        ContentCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getSlug().equals(request.getSlug()) && 
            categoryRepository.existsByUniversityIdAndSlug(request.getUniversityId(), request.getSlug())) {
            throw new RuntimeException("Category slug already exists for this university");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setSlug(request.getSlug());
        category.setDisplayOrder(request.getDisplayOrder());
        category.setActive(request.getActive());

        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        ContentCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }

    private ContentCategoryResponse toResponse(ContentCategory category) {
        return ContentCategoryResponse.builder()
                .id(category.getId())
                .universityId(category.getUniversityId())
                .name(category.getName())
                .description(category.getDescription())
                .slug(category.getSlug())
                .displayOrder(category.getDisplayOrder())
                .active(category.getActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}



