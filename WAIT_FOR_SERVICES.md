# ⏳ サービス起動待ち

## 現在の状況

バックエンドサービスを再起動しました。以下の3つのウィンドウが開いています：

1. **CMS - Auth Service** (port 8081)
2. **CMS - Content Service** (port 8082)
3. **CMS - API Gateway** (port 8080)

## 次のステップ

### 1. 起動完了を待つ（60-90秒）

各ウィンドウで、以下のようなメッセージが表示されるまで**待ってください**：

```
Started AuthServiceApplication in X.XXX seconds
Started ContentServiceApplication in X.XXX seconds
Started ApiGatewayApplication in X.XXX seconds
```

### 2. 起動中の確認

各ウィンドウで以下のようなログが表示されているはずです：

- `Tomcat started on port(s): 8081 (http)`
- `Started AuthServiceApplication`
- エラーメッセージがないこと

### 3. 動作確認（起動後）

ブラウザで以下にアクセス：

- ✅ http://localhost:8080/api/auth/health
- ✅ http://localhost:8081/api/auth/health
- ✅ http://localhost:8082/api/content

すべてが正常に応答したら成功です。

### 4. フロントエンドをリロード

ブラウザでフロントエンドページを**完全にリロード（Ctrl+F5）**してください。

## エラーが表示される場合

### データベース接続エラー

```
Connection to localhost:5432 refused
```

**解決方法:**
```bash
docker-compose up -d
```

### ポートが使用中

```
Port 8080 is already in use
```

**解決方法:**
```bash
netstat -ano | findstr ":8080"
taskkill /F /PID <プロセスID>
```

### ビルドエラー

**解決方法:**
```bash
cd C:\devlop\cms
gradlew.bat clean build -x test
```

## サービスが起動しない場合

各ウィンドウの最後のエラーメッセージを確認し、`URGENT_FIX.md`を参照してください。

## 確認コマンド

```bash
# ポートの確認
netstat -ano | findstr ":8080"
netstat -ano | findstr ":8081"
netstat -ano | findstr ":8082"

# APIテスト
test-api.bat
```

