FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Gradle Wrapperとビルドファイルをコピー
COPY ../../gradlew ../../gradlew.bat ../../gradle ../../gradle/
COPY ../../build.gradle ../../settings.gradle ./
COPY ../../services ./services

# ビルド
RUN chmod +x gradlew && ./gradlew :services:content-service:build -x test

# 実行用イメージ
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルド済みJARをコピー
COPY --from=build /app/services/content-service/build/libs/content-service.jar app.jar

EXPOSE 8082

# Railway環境変数に対応
ENV PORT=8082
ENV SPRING_PROFILES_ACTIVE=railway

ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT:-8082} app.jar --spring.profiles.active=railway"]

