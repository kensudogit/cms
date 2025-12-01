FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Gradle Wrapperとビルドファイルをコピー
COPY ../../gradlew ../../gradlew.bat ../../gradle ../../gradle/
COPY ../../build.gradle ../../settings.gradle ./
COPY ../../services ./services

# ビルド
RUN chmod +x gradlew && ./gradlew :services:auth-service:build -x test

# 実行用イメージ
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルド済みJARをコピー
COPY --from=build /app/build/libs/auth-service.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]

