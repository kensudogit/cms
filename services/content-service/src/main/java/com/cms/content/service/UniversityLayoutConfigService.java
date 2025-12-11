package com.cms.content.service;

import com.cms.content.dto.UniversityLayoutConfigRequest;
import com.cms.content.dto.UniversityLayoutConfigResponse;
import com.cms.content.entity.UniversityLayoutConfig;
import com.cms.content.repository.UniversityLayoutConfigRepository;
import com.cms.content.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityLayoutConfigService {
    private final UniversityLayoutConfigRepository layoutConfigRepository;
    private final UniversityRepository universityRepository;

    public List<UniversityLayoutConfigResponse> getLayoutConfigsByUniversity(Long universityId) {
        return layoutConfigRepository.findByUniversityId(universityId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<UniversityLayoutConfigResponse> getLayoutConfigsByUniversityAndType(
            Long universityId,
            UniversityLayoutConfig.LayoutType layoutType) {
        return layoutConfigRepository
                .findByUniversityIdAndLayoutTypeAndVisibleTrueOrderByDisplayOrderAsc(universityId, layoutType)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UniversityLayoutConfigResponse getLayoutConfigById(Long id) {
        UniversityLayoutConfig config = layoutConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Layout config not found"));
        return toResponse(config);
    }

    public UniversityLayoutConfigResponse getLayoutConfigByUniversityTypeAndKey(
            Long universityId,
            UniversityLayoutConfig.LayoutType layoutType,
            String sectionKey) {
        UniversityLayoutConfig config = layoutConfigRepository
                .findByUniversityIdAndLayoutTypeAndSectionKey(universityId, layoutType, sectionKey)
                .orElseThrow(() -> new RuntimeException("Layout config not found"));
        return toResponse(config);
    }

    @Transactional
    public UniversityLayoutConfigResponse createLayoutConfig(UniversityLayoutConfigRequest request) {
        // 大学の存在確認
        if (!universityRepository.existsById(request.getUniversityId())) {
            throw new RuntimeException("University not found");
        }

        // 重複チェック
        if (layoutConfigRepository.existsByUniversityIdAndLayoutTypeAndSectionKey(
                request.getUniversityId(),
                request.getLayoutType(),
                request.getSectionKey())) {
            throw new RuntimeException("Layout config already exists for this university, layout type and section key");
        }

        UniversityLayoutConfig config = UniversityLayoutConfig.builder()
                .universityId(request.getUniversityId())
                .layoutType(request.getLayoutType())
                .sectionKey(request.getSectionKey())
                .sectionName(request.getSectionName())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .visible(request.getVisible() != null ? request.getVisible() : true)
                .layoutConfig(request.getLayoutConfig())
                .fieldKeys(request.getFieldKeys())
                .styleConfig(request.getStyleConfig())
                .description(request.getDescription())
                .build();

        config = layoutConfigRepository.save(config);
        return toResponse(config);
    }

    @Transactional
    public UniversityLayoutConfigResponse updateLayoutConfig(Long id, UniversityLayoutConfigRequest request) {
        UniversityLayoutConfig config = layoutConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Layout config not found"));

        // 大学ID、レイアウトタイプ、セクションキーの組み合わせが変更される場合の重複チェック
        if (!config.getUniversityId().equals(request.getUniversityId()) ||
                !config.getLayoutType().equals(request.getLayoutType()) ||
                !config.getSectionKey().equals(request.getSectionKey())) {
            if (layoutConfigRepository.existsByUniversityIdAndLayoutTypeAndSectionKey(
                    request.getUniversityId(),
                    request.getLayoutType(),
                    request.getSectionKey())) {
                throw new RuntimeException(
                        "Layout config already exists for this university, layout type and section key");
            }
        }

        config.setUniversityId(request.getUniversityId());
        config.setLayoutType(request.getLayoutType());
        config.setSectionKey(request.getSectionKey());
        config.setSectionName(request.getSectionName());
        config.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        config.setVisible(request.getVisible() != null ? request.getVisible() : true);
        config.setLayoutConfig(request.getLayoutConfig());
        config.setFieldKeys(request.getFieldKeys());
        config.setStyleConfig(request.getStyleConfig());
        config.setDescription(request.getDescription());

        config = layoutConfigRepository.save(config);
        return toResponse(config);
    }

    @Transactional
    public void deleteLayoutConfig(Long id) {
        UniversityLayoutConfig config = layoutConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Layout config not found"));
        layoutConfigRepository.delete(config);
    }

    @Transactional
    public void deleteLayoutConfigsByUniversity(Long universityId) {
        layoutConfigRepository.deleteByUniversityId(universityId);
    }

    private UniversityLayoutConfigResponse toResponse(UniversityLayoutConfig config) {
        return UniversityLayoutConfigResponse.builder()
                .id(config.getId())
                .universityId(config.getUniversityId())
                .layoutType(config.getLayoutType())
                .sectionKey(config.getSectionKey())
                .sectionName(config.getSectionName())
                .displayOrder(config.getDisplayOrder())
                .visible(config.getVisible())
                .layoutConfig(config.getLayoutConfig())
                .fieldKeys(config.getFieldKeys())
                .styleConfig(config.getStyleConfig())
                .description(config.getDescription())
                .createdAt(config.getCreatedAt())
                .updatedAt(config.getUpdatedAt())
                .build();
    }
}
