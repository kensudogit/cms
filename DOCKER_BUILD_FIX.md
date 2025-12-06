# Dockerビルドエラーの修正

## 🔴 発生していたエラー

```
ERROR: failed to build: failed to solve: lstat /build/libs: no such file or directory
```

## 🔍 原因

`user-service`と`media-service`のDockerfileが、マルチステージビルドを使用せず、直接`build/libs/*.jar`をコピーしようとしていました。しかし、ビルドステップがないため、`build/libs`ディレクトリが存在しませんでした。

### 問題のあったDockerfile（修正前）

```dockerfile
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY build/libs/*.jar app.jar  # ← ビルドステップがないため、このディレクトリが存在しない

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]
```

## ✅ 修正内容

### 1. user-service/Dockerfile

マルチステージビルドを使用するように修正：

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Gradle Wrapperとビルドファイルをコピー
COPY ../../gradlew ../../gradlew.bat ../../gradle ../../gradle/
COPY ../../build.gradle ../../settings.gradle ./
COPY ../../services ./services

# ビルド
RUN chmod +x gradlew && ./gradlew :services:user-service:build -x test

# 実行用イメージ
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルド済みJARをコピー
COPY --from=build /app/services/user-service/build/libs/user-service.jar app.jar

EXPOSE 8084

# Railway環境変数に対応
ENV PORT=8084
ENV SPRING_PROFILES_ACTIVE=railway

ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT:-8084} app.jar --spring.profiles.active=railway"]
```

### 2. media-service/Dockerfile

同様にマルチステージビルドを使用するように修正：

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Gradle Wrapperとビルドファイルをコピー
COPY ../../gradlew ../../gradlew.bat ../../gradle ../../gradle/
COPY ../../build.gradle ../../settings.gradle ./
COPY ../../services ./services

# ビルド
RUN chmod +x gradlew && ./gradlew :services:media-service:build -x test

# 実行用イメージ
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルド済みJARをコピー
COPY --from=build /app/services/media-service/build/libs/media-service.jar app.jar

EXPOSE 8083

# Railway環境変数に対応
ENV PORT=8083
ENV SPRING_PROFILES_ACTIVE=railway

ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT:-8083} app.jar --spring.profiles.active=railway"]
```

## 📋 修正のポイント

1. **マルチステージビルドの採用**
   - ビルドステージでGradleを使用してJARファイルをビルド
   - 実行ステージでビルド済みJARファイルのみをコピー

2. **Railway環境変数への対応**
   - `PORT`環境変数に対応
   - `SPRING_PROFILES_ACTIVE=railway`を設定

3. **他のサービスとの統一**
   - `api-gateway`、`auth-service`、`content-service`と同じパターンに統一

## 🚀 デプロイ後の確認

### ビルドログの確認

1. Railwayダッシュボードで**Deployments**タブを開く
2. ビルドログを確認
3. エラーが表示されないことを確認

### サービス起動の確認

1. **Deployments**タブでデプロイが成功していることを確認
2. **Metrics**タブでサービスが起動していることを確認
3. エンドポイントにアクセスして動作を確認

## 🆘 トラブルシューティング

### ビルドがまだ失敗する場合

1. **Dockerfileのパスを確認**
   - Railwayの**Settings** → **Dockerfile Path**が正しいか確認
   - `services/user-service/Dockerfile`または`services/media-service/Dockerfile`

2. **ビルドコンテキストを確認**
   - **Settings** → **Root Directory**が正しいか確認
   - プロジェクトルート（`/`）またはサービスディレクトリ（`services/user-service`など）

3. **ビルドログを詳細に確認**
   - エラーメッセージを確認
   - Gradleビルドが成功しているか確認

### サービスが起動しない場合

1. **環境変数を確認**
   - すべての必須環境変数が設定されているか確認
   - データベース接続情報が正しいか確認

2. **ログを確認**
   - Railwayダッシュボードの**Deployments**タブでログを確認
   - エラーメッセージを確認

## 📝 確認チェックリスト

- [ ] `user-service/Dockerfile`をマルチステージビルドに修正した
- [ ] `media-service/Dockerfile`をマルチステージビルドに修正した
- [ ] Railwayでビルドが成功することを確認した
- [ ] サービスが起動することを確認した
- [ ] エンドポイントにアクセスできることを確認した

## 🎯 まとめ

`user-service`と`media-service`のDockerfileを、他のサービスと同じマルチステージビルドパターンに統一しました。これにより、Dockerビルドエラーが解消され、Railwayでのデプロイが正常に動作するようになります。

