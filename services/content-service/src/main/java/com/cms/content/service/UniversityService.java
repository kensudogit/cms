package com.cms.content.service;

import com.cms.content.dto.UniversityRequest;
import com.cms.content.dto.UniversityResponse;
import com.cms.content.entity.University;
import com.cms.content.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityService {
    private final UniversityRepository universityRepository;

    public List<UniversityResponse> getAllUniversities() {
        return universityRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<UniversityResponse> getActiveUniversities() {
        return universityRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UniversityResponse getUniversityById(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));
        return toResponse(university);
    }

    public UniversityResponse getUniversityByCode(String code) {
        University university = universityRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("University not found"));
        return toResponse(university);
    }

    @Transactional
    public UniversityResponse createUniversity(UniversityRequest request) {
        if (universityRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("University code already exists");
        }

        University university = University.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .domain(request.getDomain())
                .settings(request.getSettings())
                .active(request.getActive())
                .build();

        university = universityRepository.save(university);
        return toResponse(university);
    }

    @Transactional
    public UniversityResponse updateUniversity(Long id, UniversityRequest request) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));

        if (!university.getCode().equals(request.getCode()) && 
            universityRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("University code already exists");
        }

        university.setCode(request.getCode());
        university.setName(request.getName());
        university.setDescription(request.getDescription());
        university.setDomain(request.getDomain());
        university.setSettings(request.getSettings());
        university.setActive(request.getActive());

        university = universityRepository.save(university);
        return toResponse(university);
    }

    @Transactional
    public void deleteUniversity(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));
        universityRepository.delete(university);
    }

    private UniversityResponse toResponse(University university) {
        return UniversityResponse.builder()
                .id(university.getId())
                .code(university.getCode())
                .name(university.getName())
                .description(university.getDescription())
                .domain(university.getDomain())
                .settings(university.getSettings())
                .active(university.getActive())
                .createdAt(university.getCreatedAt())
                .updatedAt(university.getUpdatedAt())
                .build();
    }
}


