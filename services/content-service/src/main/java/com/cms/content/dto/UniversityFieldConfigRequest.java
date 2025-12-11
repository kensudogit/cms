package com.cms.content.dto;

import com.cms.content.entity.UniversityFieldConfig;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UniversityFieldConfigRequest {
    @NotNull(message = "University ID is required")
    private Long universityId;

    @NotBlank(message = "Field key is required")
    private String fieldKey;

    @NotBlank(message = "Field name is required")
    private String fieldName;

    @NotNull(message = "Field type is required")
    private UniversityFieldConfig.FieldType fieldType;

    private String defaultValue;

    private Boolean required = false;

    private Boolean visible = true;

    private Integer displayOrder = 0;

    @NotNull(message = "Edit method is required")
    private UniversityFieldConfig.EditMethod editMethod;

    private String editOptions; // JSON形式

    private String validationRules; // JSON形式

    private String displayConfig; // JSON形式

    private String description;
}
