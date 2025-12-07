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
public class ContentTemplateResponse {
    private Long id;
    private Long universityId;
    private String name;
    private String content;
    private Long categoryId;
    private String type;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



