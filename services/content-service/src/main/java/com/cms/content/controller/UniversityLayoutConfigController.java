package com.cms.content.controller;

import com.cms.content.dto.UniversityLayoutConfigRequest;
import com.cms.content.dto.UniversityLayoutConfigResponse;
import com.cms.content.entity.UniversityLayoutConfig;
import com.cms.content.service.UniversityLayoutConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/university-layout-config")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UniversityLayoutConfigController {
    private final UniversityLayoutConfigService layoutConfigService;

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<UniversityLayoutConfigResponse>> getLayoutConfigsByUniversity(
            @PathVariable Long universityId) {
        return ResponseEntity.ok(layoutConfigService.getLayoutConfigsByUniversity(universityId));
    }

    @GetMapping("/university/{universityId}/layout-type/{layoutType}")
    public ResponseEntity<List<UniversityLayoutConfigResponse>> getLayoutConfigsByUniversityAndType(
            @PathVariable Long universityId,
            @PathVariable UniversityLayoutConfig.LayoutType layoutType) {
        return ResponseEntity.ok(layoutConfigService.getLayoutConfigsByUniversityAndType(universityId, layoutType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityLayoutConfigResponse> getLayoutConfigById(@PathVariable Long id) {
        return ResponseEntity.ok(layoutConfigService.getLayoutConfigById(id));
    }

    @GetMapping("/university/{universityId}/layout-type/{layoutType}/section/{sectionKey}")
    public ResponseEntity<UniversityLayoutConfigResponse> getLayoutConfigByUniversityTypeAndKey(
            @PathVariable Long universityId,
            @PathVariable UniversityLayoutConfig.LayoutType layoutType,
            @PathVariable String sectionKey) {
        return ResponseEntity.ok(layoutConfigService.getLayoutConfigByUniversityTypeAndKey(
                universityId, layoutType, sectionKey));
    }

    @PostMapping
    public ResponseEntity<UniversityLayoutConfigResponse> createLayoutConfig(
            @Valid @RequestBody UniversityLayoutConfigRequest request) {
        UniversityLayoutConfigResponse response = layoutConfigService.createLayoutConfig(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UniversityLayoutConfigResponse> updateLayoutConfig(
            @PathVariable Long id,
            @Valid @RequestBody UniversityLayoutConfigRequest request) {
        return ResponseEntity.ok(layoutConfigService.updateLayoutConfig(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLayoutConfig(@PathVariable Long id) {
        layoutConfigService.deleteLayoutConfig(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/university/{universityId}")
    public ResponseEntity<Void> deleteLayoutConfigsByUniversity(@PathVariable Long universityId) {
        layoutConfigService.deleteLayoutConfigsByUniversity(universityId);
        return ResponseEntity.noContent().build();
    }
}

