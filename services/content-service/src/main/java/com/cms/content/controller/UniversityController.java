package com.cms.content.controller;

import com.cms.content.dto.UniversityRequest;
import com.cms.content.dto.UniversityResponse;
import com.cms.content.service.UniversityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/university")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UniversityController {
    private final UniversityService universityService;

    @GetMapping
    public ResponseEntity<List<UniversityResponse>> getAllUniversities() {
        return ResponseEntity.ok(universityService.getAllUniversities());
    }

    @GetMapping("/active")
    public ResponseEntity<List<UniversityResponse>> getActiveUniversities() {
        return ResponseEntity.ok(universityService.getActiveUniversities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityResponse> getUniversityById(@PathVariable Long id) {
        return ResponseEntity.ok(universityService.getUniversityById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<UniversityResponse> getUniversityByCode(@PathVariable String code) {
        return ResponseEntity.ok(universityService.getUniversityByCode(code));
    }

    @PostMapping
    public ResponseEntity<UniversityResponse> createUniversity(@Valid @RequestBody UniversityRequest request) {
        UniversityResponse response = universityService.createUniversity(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UniversityResponse> updateUniversity(
            @PathVariable Long id,
            @Valid @RequestBody UniversityRequest request) {
        return ResponseEntity.ok(universityService.updateUniversity(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        universityService.deleteUniversity(id);
        return ResponseEntity.noContent().build();
    }
}

