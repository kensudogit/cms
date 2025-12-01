# 🚀 バックエンドサービス起動 - クイックガイド

## エラー: ERR_CONNECTION_REFUSED

バックエンドサービスが起動していないため、フロントエンドからAPIに接続できません。

## 即座に解決する方法

### 方法1: 自動起動スクリプト（推奨）

```bash
cd C:\devlop\cms
SIMPLE_START.bat
```

### 方法2: 手動起動

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

## 起動確認

各サービスが起動したら（60-90秒後）、以下を確認：

- ✅ http://localhost:8080/api/auth/health
- ✅ http://localhost:8081/api/auth/health
- ✅ http://localhost:8082/api/content

すべてが正常に応答したら、フロントエンドページを**リロード（Ctrl+F5）**してください。

## トラブルシューティング

### PostgreSQLが起動していない

```bash
cd C:\devlop\cms
docker-compose up -d
```

### ポートが使用中

```bash
# ポートを確認
netstat -ano | findstr ":8080"

# プロセスを終了
taskkill /F /PID <プロセスID>
```

### サービスが起動しない

各サービスのウィンドウでエラーメッセージを確認してください。

詳細は `STEP_BY_STEP_START.md` を参照してください。



