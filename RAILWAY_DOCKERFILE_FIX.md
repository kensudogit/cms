# 🔧 Railway Dockerfile エラー修正

## エラー内容

```
ERROR: failed to build: failed to solve: lstat /build/libs: no such file or directory
```

Dockerfileが`build/libs/*.jar`をコピーしようとしていますが、ビルドプロセスが実行されていないため、JARファイルが存在しません。

## 実施した修正

### 各サービスのDockerfileを修正

マルチステージビルドを使用して、ビルドプロセスを含めるように修正しました：

1. **ビルドステージ**: Gradleを使用してJARファイルをビルド
2. **実行ステージ**: ビルド済みJARファイルのみをコピーして実行

### 修正内容

各サービスのDockerfileを以下のように修正：

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Gradle Wrapperとビルドファイルをコピー
COPY ../../gradlew ../../gradlew.bat ../../gradle ../../gradle/
COPY ../../build.gradle ../../settings.gradle ./
COPY ../../services ./services

# ビルド
RUN chmod +x gradlew && ./gradlew :services:api-gateway:build -x test

# 実行用イメージ
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルド済みJARをコピー
COPY --from=build /app/build/libs/api-gateway.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 次のステップ

### 1. 変更をコミットしてプッシュ

```bash
cd C:\devlop\cms

# 変更を追加
git add services/*/Dockerfile

# コミット
git commit -m "Fix Dockerfile: Add build process for Railway deployment"

# プッシュ
git push
```

### 2. Railwayで再デプロイ

1. Railwayのダッシュボードにアクセス
2. 各サービスを再デプロイ
3. ビルドログを確認して、ビルドプロセスが実行されていることを確認

### 3. ビルドログの確認

正常にビルドされると、以下のようなログが表示されます：

```
[inf] Using Detected Dockerfile
[inf] [build] Building...
[inf] [build] > Task :services:api-gateway:build
[inf] [build] BUILD SUCCESSFUL
[inf] [3/3] COPY --from=build /app/build/libs/api-gateway.jar app.jar
```

## 代替案: Nixpacksを使用

Dockerfileの代わりにNixpacksを使用する場合は、`railway.json`で明示的に指定：

```json
{
  "build": {
    "builder": "NIXPACKS"
  }
}
```

または、Dockerfileを削除してNixpacksを使用することもできます。

## トラブルシューティング

### まだエラーが発生する場合

#### オプション1: Dockerfileのパスを確認

Railwayが正しいディレクトリからDockerfileを読み込んでいることを確認してください。

#### オプション2: Nixpacksを使用

`railway.json`で`"builder": "NIXPACKS"`を指定し、Dockerfileを削除または無視する

#### オプション3: ビルドコンテキストを確認

Railwayのサービス設定で、ビルドコンテキストが正しく設定されていることを確認してください。

## 注意事項

- Dockerfileは各サービスディレクトリから実行されるため、ルートディレクトリのファイルを参照するには`../../`を使用します
- マルチステージビルドを使用することで、最終イメージのサイズを小さくできます
- `jre-alpine`を使用することで、実行時イメージを軽量化できます
- 変更をプッシュした後、Railwayで再デプロイが必要です



