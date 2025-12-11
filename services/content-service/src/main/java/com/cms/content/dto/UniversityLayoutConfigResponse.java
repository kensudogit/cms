package com.cms.content.dto;

import com.cms.content.entity.UniversityLayoutConfig;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UniversityLayoutConfigResponse {
    private Long id;
    private Long universityId;
    private UniversityLayoutConfig.LayoutType layoutType;
    private String sectionKey;
    private String sectionName;
    private Integer displayOrder;
    private Boolean visible;
    private String layoutConfig;
    private String fieldKeys;
    private String styleConfig;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
