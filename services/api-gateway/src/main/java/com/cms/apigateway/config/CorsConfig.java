package com.cms.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig {
    
    @Value("${ALLOWED_ORIGINS:http://localhost:3000,http://localhost:3001,http://localhost:3002}")
    private String allowedOrigins;

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // 環境変数から許可オリジンを取得
        if ("*".equals(allowedOrigins.trim())) {
            // 完全公開モード: すべてのオリジンを許可
            corsConfig.addAllowedOriginPattern("*");
            corsConfig.setAllowCredentials(false); // ワイルドカード使用時はfalse
        } else {
            // 特定のオリジンを許可（カンマ区切り）
            List<String> origins = Arrays.stream(allowedOrigins.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            corsConfig.setAllowedOrigins(origins);
            corsConfig.setAllowCredentials(true);
        }
        
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "X-User-Id"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}



