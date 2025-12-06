package com.cms.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentCategoryResponse {
    private Long id;
    private Long universityId;
    private String name;
    private String description;
    private String slug;
    private Integer displayOrder;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


