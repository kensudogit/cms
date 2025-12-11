package com.cms.content.controller;

import com.cms.content.dto.UniversityFieldConfigRequest;
import com.cms.content.dto.UniversityFieldConfigResponse;
import com.cms.content.service.UniversityFieldConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/university-field-config")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UniversityFieldConfigController {
    private final UniversityFieldConfigService fieldConfigService;

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<UniversityFieldConfigResponse>> getFieldConfigsByUniversity(
            @PathVariable Long universityId) {
        return ResponseEntity.ok(fieldConfigService.getFieldConfigsByUniversity(universityId));
    }

    @GetMapping("/university/{universityId}/visible")
    public ResponseEntity<List<UniversityFieldConfigResponse>> getVisibleFieldConfigsByUniversity(
            @PathVariable Long universityId) {
        return ResponseEntity.ok(fieldConfigService.getVisibleFieldConfigsByUniversity(universityId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityFieldConfigResponse> getFieldConfigById(@PathVariable Long id) {
        return ResponseEntity.ok(fieldConfigService.getFieldConfigById(id));
    }

    @GetMapping("/university/{universityId}/field/{fieldKey}")
    public ResponseEntity<UniversityFieldConfigResponse> getFieldConfigByUniversityAndKey(
            @PathVariable Long universityId,
            @PathVariable String fieldKey) {
        return ResponseEntity.ok(fieldConfigService.getFieldConfigByUniversityAndKey(universityId, fieldKey));
    }

    @PostMapping
    public ResponseEntity<UniversityFieldConfigResponse> createFieldConfig(
            @Valid @RequestBody UniversityFieldConfigRequest request) {
        UniversityFieldConfigResponse response = fieldConfigService.createFieldConfig(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UniversityFieldConfigResponse> updateFieldConfig(
            @PathVariable Long id,
            @Valid @RequestBody UniversityFieldConfigRequest request) {
        return ResponseEntity.ok(fieldConfigService.updateFieldConfig(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFieldConfig(@PathVariable Long id) {
        fieldConfigService.deleteFieldConfig(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/university/{universityId}")
    public ResponseEntity<Void> deleteFieldConfigsByUniversity(@PathVariable Long universityId) {
        fieldConfigService.deleteFieldConfigsByUniversity(universityId);
        return ResponseEntity.noContent().build();
    }
}
