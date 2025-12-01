package com.cms.content;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ContentServiceApplication {
    public static void main(String[] args) {
        // Railway環境ではrailwayプロファイルを使用
        String profile = System.getenv("RAILWAY_ENVIRONMENT") != null ? "railway" : "default";
        System.setProperty("spring.profiles.active", profile);
        
        SpringApplication.run(ContentServiceApplication.class, args);
    }
}
