# バックエンドサービス手動起動ガイド

## 接続拒否エラーの解決

バックエンドサービスが起動していないため、接続が拒否されています。

## 起動方法

### 方法1: Gradle Wrapperを使用（推奨）

#### ステップ1: Gradle Wrapperの準備

```bash
cd C:\devlop\cms

# Gradle Wrapperを初期化（Gradleがインストールされている場合）
gradle wrapper --gradle-version 8.5

# または、既存のプロジェクトからコピー
copy C:\devlop\VideoStep\gradle\wrapper\gradle-wrapper.jar gradle\wrapper\gradle-wrapper.jar
```

#### ステップ2: サービスを起動

**3つの新しいコマンドプロンプトを開いて、それぞれで実行：**

**ウィンドウ1: Auth Service**
```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

**ウィンドウ2: Content Service**
```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

**ウィンドウ3: API Gateway**
```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

### 方法2: Gradleがインストールされている場合

```bash
cd C:\devlop\cms

# Auth Service
gradle :services:auth-service:bootRun

# Content Service（別ウィンドウ）
gradle :services:content-service:bootRun

# API Gateway（別ウィンドウ）
gradle :services:api-gateway:bootRun
```

### 方法3: IntelliJ IDEAやEclipseから起動

各サービスの`Application.java`を直接実行：
- `AuthServiceApplication.java`
- `ContentServiceApplication.java`
- `ApiGatewayApplication.java`

## 起動確認

各サービスが起動したら（30-60秒後）、以下を確認：

```bash
# API Gateway
curl http://localhost:8080/api/auth/health

# Auth Service
curl http://localhost:8080/api/auth/health

# Content Service
curl http://localhost:8082/api/content
```

または、ブラウザで直接アクセス：
- http://localhost:8080/api/auth/health
- http://localhost:8081/api/auth/health
- http://localhost:8082/api/content

## 起動順序

1. **PostgreSQL** - 既に起動中 ✅
2. **Auth Service** (port 8081)
3. **Content Service** (port 8082)
4. **API Gateway** (port 8080) - 最後に起動

## トラブルシューティング

### Gradle Wrapperが見つからない

```bash
# Gradleをインストール（Chocolateyを使用）
choco install gradle

# または、手動でダウンロード
# https://gradle.org/releases/
```

### ビルドエラー

```bash
cd C:\devlop\cms
gradlew.bat clean build -x test
```

### ポートが使用中

```bash
# ポートを確認
netstat -ano | findstr ":8080"

# プロセスを終了
taskkill /F /PID <プロセスID>
```

## サービスが起動したら

フロントエンドページを**リロード**してください。接続エラーが解消されます。

