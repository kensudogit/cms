package com.cms.media;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MediaServiceApplication {
    public static void main(String[] args) {
        // Railway環境ではrailwayプロファイルを使用
        String profile = System.getenv("RAILWAY_ENVIRONMENT") != null ? "railway" : "default";
        System.setProperty("spring.profiles.active", profile);
        
        SpringApplication.run(MediaServiceApplication.class, args);
    }
}
