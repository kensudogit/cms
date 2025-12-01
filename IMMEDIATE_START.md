# 🚨 接続拒否エラー - 即座に解決する方法

## 現在の状況

✅ PostgreSQLデータベース: 起動中  
❌ API Gateway (port 8080): 未起動  
❌ Auth Service (port 8081): 未起動  
❌ Content Service (port 8082): 未起動  

## 解決方法（3ステップ）

### ステップ1: バックエンドサービスを起動

以下のコマンドを実行してください：

```bash
cd C:\devlop\cms
start-all-services.bat
```

これで3つのウィンドウが開き、各サービスが起動します。

### ステップ2: 起動を待つ

各サービスが起動するまで**30-60秒**待ってください。

起動中のログに以下が表示されます：
- `Started AuthServiceApplication`
- `Started ContentServiceApplication`
- `Started ApiGatewayApplication`

### ステップ3: 動作確認

ブラウザで以下にアクセスして確認：

- ✅ http://localhost:8080/api/auth/health
- ✅ http://localhost:8081/api/auth/health
- ✅ http://localhost:8082/api/content

すべてが正常に応答したら、フロントエンドページを**リロード**してください。

## 手動起動（自動起動が失敗する場合）

### ウィンドウ1: Auth Service
```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

### ウィンドウ2: Content Service
```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

### ウィンドウ3: API Gateway
```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

## トラブルシューティング

### Gradle Wrapperが見つからない

```bash
cd C:\devlop\cms
gradlew.bat wrapper --gradle-version 8.5
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

## 確認コマンド

```bash
# サービスステータス確認
check-services.bat

# または手動で
curl http://localhost:8080/api/auth/health
```



