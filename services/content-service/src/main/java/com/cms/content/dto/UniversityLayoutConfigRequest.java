package com.cms.content.dto;

import com.cms.content.entity.UniversityLayoutConfig;
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
public class UniversityLayoutConfigRequest {
    @NotNull(message = "University ID is required")
    private Long universityId;

    @NotNull(message = "Layout type is required")
    private UniversityLayoutConfig.LayoutType layoutType;

    @NotBlank(message = "Section key is required")
    private String sectionKey;

    @NotBlank(message = "Section name is required")
    private String sectionName;

    private Integer displayOrder = 0;

    private Boolean visible = true;

    private String layoutConfig; // JSON形式

    private String fieldKeys; // JSON配列形式

    private String styleConfig; // JSON形式

    private String description;
}

