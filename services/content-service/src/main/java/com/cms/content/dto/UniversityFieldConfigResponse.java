package com.cms.content.dto;

import com.cms.content.entity.UniversityFieldConfig;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UniversityFieldConfigResponse {
    private Long id;
    private Long universityId;
    private String fieldKey;
    private String fieldName;
    private UniversityFieldConfig.FieldType fieldType;
    private String defaultValue;
    private Boolean required;
    private Boolean visible;
    private Integer displayOrder;
    private UniversityFieldConfig.EditMethod editMethod;
    private String editOptions;
    private String validationRules;
    private String displayConfig;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

