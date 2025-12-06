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
public class UniversityResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String domain;
    private String settings;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


