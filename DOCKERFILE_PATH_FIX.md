# Dockerfileパス指定の修正

## 🔴 発生していたエラー

```
chmod: cannot access 'gradlew': No such file or directory
```

## 🔍 原因

Dockerfileで`COPY ../../gradlew`を使用していましたが、Railwayのビルドコンテキストがプロジェクトルート（`/`）に設定されている場合、相対パス`../../`が正しく解決されませんでした。

## ✅ 修正内容

すべてのサービスのDockerfileで、相対パス`../../`を削除し、プロジェクトルートからの直接パスに変更しました。

### 修正前

```dockerfile
COPY ../../gradlew ../../gradlew.bat ../../gradle ../../gradle/
COPY ../../build.gradle ../../settings.gradle ./
COPY ../../services ./services
```

### 修正後

```dockerfile
COPY gradlew gradlew.bat ./
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
COPY services ./services
```

## 📋 修正したファイル

1. ✅ `services/api-gateway/Dockerfile`
2. ✅ `services/auth-service/Dockerfile`
3. ✅ `services/content-service/Dockerfile`
4. ✅ `services/user-service/Dockerfile`
5. ✅ `services/media-service/Dockerfile`

## 🎯 修正のポイント

### 1. ビルドコンテキストの理解

RailwayでRoot Directoryを`/`（プロジェクトルート）に設定した場合：
- ビルドコンテキストはプロジェクトルート
- Dockerfile内の`COPY`コマンドは、プロジェクトルートからの相対パスで指定

### 2. パスの統一

すべてのサービスで同じパターンを使用：
- `COPY gradlew gradlew.bat ./` - プロジェクトルートの`gradlew`を`/app/gradlew`にコピー
- `COPY gradle ./gradle` - プロジェクトルートの`gradle`ディレクトリを`/app/gradle`にコピー
- `COPY build.gradle settings.gradle ./` - プロジェクトルートのビルドファイルを`/app`にコピー
- `COPY services ./services` - プロジェクトルートの`services`ディレクトリを`/app/services`にコピー

## 🚀 Railway設定

### Root Directoryの設定

すべてのサービスで：

1. **Settings**タブを開く
2. **Root Directory**を`/`（プロジェクトルート）または空欄に設定
3. **Dockerfile Path**を設定：
   - `services/api-gateway/Dockerfile`
   - `services/auth-service/Dockerfile`
   - `services/content-service/Dockerfile`
   - `services/user-service/Dockerfile`
   - `services/media-service/Dockerfile`

## ✅ 確認方法

### ビルドログの確認

ビルドログで以下が成功することを確認：

```
[build 3/6] COPY gradlew gradlew.bat ./
[build 4/6] COPY gradle ./gradle
[build 5/6] COPY build.gradle settings.gradle ./
[build 6/6] COPY services ./services
[build 7/6] RUN chmod +x gradlew && ./gradlew :services:user-service:build -x test
```

### エラーの確認

以下のエラーが表示されないことを確認：

- ❌ `chmod: cannot access 'gradlew': No such file or directory`
- ❌ `COPY failed: file not found in build context`

## 🆘 トラブルシューティング

### まだエラーが発生する場合

1. **Root Directoryを確認**
   - Railwayの**Settings**で**Root Directory**が`/`に設定されているか確認
   - 空欄の場合は、プロジェクトルートが使用されます

2. **Dockerfile Pathを確認**
   - **Settings**で**Dockerfile Path**が正しく設定されているか確認
   - 例: `services/user-service/Dockerfile`

3. **ファイルの存在を確認**
   - GitHubリポジトリに`gradlew`が含まれているか確認
   - `.gitignore`で`gradlew`が除外されていないか確認

4. **ビルドログを詳細に確認**
   - どのディレクトリからビルドが実行されているか確認
   - `COPY`コマンドが成功しているか確認

## 📝 確認チェックリスト

- [ ] すべてのサービスのDockerfileを修正した
- [ ] RailwayのRoot Directoryが`/`に設定されている
- [ ] RailwayのDockerfile Pathが正しく設定されている
- [ ] サービスを再デプロイした
- [ ] ビルドログでエラーが解消されたことを確認した
- [ ] `chmod +x gradlew`が成功することを確認した
- [ ] Gradleビルドが成功することを確認した

## 🎯 まとめ

すべてのサービスのDockerfileで、相対パス`../../`を削除し、プロジェクトルートからの直接パスに変更しました。これにより、Railwayのビルドコンテキストがプロジェクトルートに設定されている場合でも、正しくファイルがコピーされ、ビルドが成功するようになります。

