# 🔧 Railwayデプロイエラー修正

## エラー内容

```
/bin/bash: line 1: ./gradlew: Permission denied
```

`gradlew`ファイルに実行権限がないため、Railwayのビルドが失敗しています。

## 実施した修正

### 1. `.gitattributes`ファイルを作成

`gradlew`ファイルがGitで実行権限を保持するように設定しました。

### 2. `nixpacks.toml`ファイルを作成

Nixpacksビルド時に`gradlew`に実行権限を付与するように設定しました。

## 次のステップ

### 方法1: Gitで権限を設定（推奨）

```bash
cd C:\devlop\cms

# gradlewに実行権限を付与（Gitで追跡）
git update-index --chmod=+x gradlew

# 変更をコミット
git add .gitattributes nixpacks.toml gradlew
git commit -m "Fix gradlew permissions for Railway deployment"
git push
```

### 方法2: Railwayで直接修正

Railwayのデプロイ設定で、ビルドコマンドの前に権限設定を追加：

```bash
chmod +x gradlew && ./gradlew build -x test
```

または、Railwayの環境変数で設定：
- `RAILWAY_BUILD_COMMAND`: `chmod +x gradlew && ./gradlew build -x test`

### 方法3: 各サービスディレクトリにgradlewをコピー

各サービスディレクトリに`gradlew`をコピーして、権限を設定：

```bash
# 各サービスディレクトリにgradlewをコピー
cp gradlew services/api-gateway/
cp gradlew services/auth-service/
cp gradlew services/content-service/

# 権限を設定（Gitで追跡）
git update-index --chmod=+x services/*/gradlew
```

## 確認方法

### ローカルで確認

```bash
# gradlewの権限を確認
ls -l gradlew

# 実行可能であることを確認
./gradlew --version
```

### Railwayで確認

1. Railwayのデプロイログを確認
2. `chmod +x gradlew`が実行されていることを確認
3. `./gradlew build -x test`が成功することを確認

## トラブルシューティング

### まだ権限エラーが発生する場合

#### オプション1: Dockerfileを使用

各サービスでDockerfileを使用するように設定：

```dockerfile
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# gradlewをコピーして権限を設定
COPY gradlew .
COPY gradle gradle
RUN chmod +x gradlew

# プロジェクトファイルをコピー
COPY build.gradle settings.gradle ./
COPY services ./services

# ビルド
RUN ./gradlew build -x test

# JARファイルをコピー
COPY build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### オプション2: Railwayのビルドコマンドを変更

Railwayのサービス設定で、ビルドコマンドを以下に変更：

```bash
chmod +x gradlew && ./gradlew :services:api-gateway:build -x test
```

## 注意事項

- Windowsでは`chmod`コマンドが使えないため、Gitで権限を設定する必要があります
- `git update-index --chmod=+x gradlew`を実行すると、Gitで実行権限が追跡されます
- RailwayはLinux環境でビルドするため、実行権限が必要です

