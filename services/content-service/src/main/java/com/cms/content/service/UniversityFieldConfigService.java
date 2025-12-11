package com.cms.content.service;

import com.cms.content.dto.UniversityFieldConfigRequest;
import com.cms.content.dto.UniversityFieldConfigResponse;
import com.cms.content.entity.UniversityFieldConfig;
import com.cms.content.repository.UniversityFieldConfigRepository;
import com.cms.content.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityFieldConfigService {
    private final UniversityFieldConfigRepository fieldConfigRepository;
    private final UniversityRepository universityRepository;

    public List<UniversityFieldConfigResponse> getFieldConfigsByUniversity(Long universityId) {
        return fieldConfigRepository.findByUniversityId(universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<UniversityFieldConfigResponse> getVisibleFieldConfigsByUniversity(Long universityId) {
        return fieldConfigRepository.findByUniversityIdAndVisibleTrueOrderByDisplayOrderAsc(universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UniversityFieldConfigResponse getFieldConfigById(Long id) {
        UniversityFieldConfig config = fieldConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field config not found"));
        return toResponse(config);
    }

    public UniversityFieldConfigResponse getFieldConfigByUniversityAndKey(Long universityId, String fieldKey) {
        UniversityFieldConfig config = fieldConfigRepository.findByUniversityIdAndFieldKey(universityId, fieldKey)
                .orElseThrow(() -> new RuntimeException("Field config not found"));
        return toResponse(config);
    }

    @Transactional
    public UniversityFieldConfigResponse createFieldConfig(UniversityFieldConfigRequest request) {
        // 大学の存在確認
        if (!universityRepository.existsById(request.getUniversityId())) {
            throw new RuntimeException("University not found");
        }

        // 重複チェック
        if (fieldConfigRepository.existsByUniversityIdAndFieldKey(
                request.getUniversityId(), request.getFieldKey())) {
            throw new RuntimeException("Field config already exists for this university and field key");
        }

        UniversityFieldConfig config = UniversityFieldConfig.builder()
                .universityId(request.getUniversityId())
                .fieldKey(request.getFieldKey())
                .fieldName(request.getFieldName())
                .fieldType(request.getFieldType())
                .defaultValue(request.getDefaultValue())
                .required(request.getRequired() != null ? request.getRequired() : false)
                .visible(request.getVisible() != null ? request.getVisible() : true)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .editMethod(request.getEditMethod())
                .editOptions(request.getEditOptions())
                .validationRules(request.getValidationRules())
                .displayConfig(request.getDisplayConfig())
                .description(request.getDescription())
                .build();

        config = fieldConfigRepository.save(config);
        return toResponse(config);
    }

    @Transactional
    public UniversityFieldConfigResponse updateFieldConfig(Long id, UniversityFieldConfigRequest request) {
        UniversityFieldConfig config = fieldConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field config not found"));

        // 大学IDとフィールドキーの組み合わせが変更される場合の重複チェック
        if (!config.getUniversityId().equals(request.getUniversityId()) ||
                !config.getFieldKey().equals(request.getFieldKey())) {
            if (fieldConfigRepository.existsByUniversityIdAndFieldKey(
                    request.getUniversityId(), request.getFieldKey())) {
                throw new RuntimeException("Field config already exists for this university and field key");
            }
        }

        config.setUniversityId(request.getUniversityId());
        config.setFieldKey(request.getFieldKey());
        config.setFieldName(request.getFieldName());
        config.setFieldType(request.getFieldType());
        config.setDefaultValue(request.getDefaultValue());
        config.setRequired(request.getRequired() != null ? request.getRequired() : false);
        config.setVisible(request.getVisible() != null ? request.getVisible() : true);
        config.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        config.setEditMethod(request.getEditMethod());
        config.setEditOptions(request.getEditOptions());
        config.setValidationRules(request.getValidationRules());
        config.setDisplayConfig(request.getDisplayConfig());
        config.setDescription(request.getDescription());

        config = fieldConfigRepository.save(config);
        return toResponse(config);
    }

    @Transactional
    public void deleteFieldConfig(Long id) {
        UniversityFieldConfig config = fieldConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field config not found"));
        fieldConfigRepository.delete(config);
    }

    @Transactional
    public void deleteFieldConfigsByUniversity(Long universityId) {
        fieldConfigRepository.deleteByUniversityId(universityId);
    }

    private UniversityFieldConfigResponse toResponse(UniversityFieldConfig config) {
        return UniversityFieldConfigResponse.builder()
                .id(config.getId())
                .universityId(config.getUniversityId())
                .fieldKey(config.getFieldKey())
                .fieldName(config.getFieldName())
                .fieldType(config.getFieldType())
                .defaultValue(config.getDefaultValue())
                .required(config.getRequired())
                .visible(config.getVisible())
                .displayOrder(config.getDisplayOrder())
                .editMethod(config.getEditMethod())
                .editOptions(config.getEditOptions())
                .validationRules(config.getValidationRules())
                .displayConfig(config.getDisplayConfig())
                .description(config.getDescription())
                .createdAt(config.getCreatedAt())
                .updatedAt(config.getUpdatedAt())
                .build();
    }
}
