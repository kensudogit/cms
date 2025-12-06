package com.cms.content.service;

import com.cms.content.dto.ContentTemplateRequest;
import com.cms.content.dto.ContentTemplateResponse;
import com.cms.content.entity.ContentTemplate;
import com.cms.content.repository.ContentTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentTemplateService {
    private final ContentTemplateRepository templateRepository;

    public List<ContentTemplateResponse> getTemplatesByUniversity(Long universityId) {
        return templateRepository.findByUniversityIdAndActiveTrue(universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ContentTemplateResponse> getTemplatesByType(Long universityId, String type) {
        return templateRepository.findByUniversityIdAndTypeAndActiveTrue(universityId, type).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ContentTemplateResponse getTemplateById(Long id, Long universityId) {
        ContentTemplate template = templateRepository.findByIdAndUniversityId(id, universityId)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        return toResponse(template);
    }

    @Transactional
    public ContentTemplateResponse createTemplate(ContentTemplateRequest request) {
        ContentTemplate template = ContentTemplate.builder()
                .universityId(request.getUniversityId())
                .name(request.getName())
                .content(request.getContent())
                .categoryId(request.getCategoryId())
                .type(request.getType())
                .active(request.getActive())
                .build();

        template = templateRepository.save(template);
        return toResponse(template);
    }

    @Transactional
    public ContentTemplateResponse updateTemplate(Long id, ContentTemplateRequest request) {
        ContentTemplate template = templateRepository.findByIdAndUniversityId(id, request.getUniversityId())
                .orElseThrow(() -> new RuntimeException("Template not found"));

        template.setName(request.getName());
        template.setContent(request.getContent());
        template.setCategoryId(request.getCategoryId());
        template.setType(request.getType());
        template.setActive(request.getActive());

        template = templateRepository.save(template);
        return toResponse(template);
    }

    @Transactional
    public void deleteTemplate(Long id, Long universityId) {
        ContentTemplate template = templateRepository.findByIdAndUniversityId(id, universityId)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        templateRepository.delete(template);
    }

    private ContentTemplateResponse toResponse(ContentTemplate template) {
        return ContentTemplateResponse.builder()
                .id(template.getId())
                .universityId(template.getUniversityId())
                .name(template.getName())
                .content(template.getContent())
                .categoryId(template.getCategoryId())
                .type(template.getType())
                .active(template.getActive())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }
}

