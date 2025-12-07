package com.cms.content.controller;

import com.cms.content.dto.ContentTemplateRequest;
import com.cms.content.dto.ContentTemplateResponse;
import com.cms.content.service.ContentTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content-template")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContentTemplateController {
    private final ContentTemplateService templateService;

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<ContentTemplateResponse>> getTemplatesByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(templateService.getTemplatesByUniversity(universityId));
    }

    @GetMapping("/university/{universityId}/type/{type}")
    public ResponseEntity<List<ContentTemplateResponse>> getTemplatesByType(
            @PathVariable Long universityId,
            @PathVariable String type) {
        return ResponseEntity.ok(templateService.getTemplatesByType(universityId, type));
    }

    @GetMapping("/{id}/university/{universityId}")
    public ResponseEntity<ContentTemplateResponse> getTemplateById(
            @PathVariable Long id,
            @PathVariable Long universityId) {
        return ResponseEntity.ok(templateService.getTemplateById(id, universityId));
    }

    @PostMapping
    public ResponseEntity<ContentTemplateResponse> createTemplate(@Valid @RequestBody ContentTemplateRequest request) {
        ContentTemplateResponse response = templateService.createTemplate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContentTemplateResponse> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody ContentTemplateRequest request) {
        return ResponseEntity.ok(templateService.updateTemplate(id, request));
    }

    @DeleteMapping("/{id}/university/{universityId}")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable Long id,
            @PathVariable Long universityId) {
        templateService.deleteTemplate(id, universityId);
        return ResponseEntity.noContent().build();
    }
}



