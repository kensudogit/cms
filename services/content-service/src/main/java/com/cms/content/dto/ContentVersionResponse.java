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
public class ContentVersionResponse {
    private Long id;
    private Long contentId;
    private Integer versionNumber;
    private String title;
    private String body;
    private String slug;
    private Long authorId;
    private String changeNote;
    private LocalDateTime createdAt;
}


