# バックエンドサービス起動ガイド

## 🔴 問題
- `ERR_CONNECTION_REFUSED` エラーが発生
- バックエンドAPI（ポート8080）に接続できない
- ログインができない

## ✅ 解決方法

### ステップ1: バックエンドサービスを起動

**方法1: 自動起動スクリプトを使用（推奨）**

1. `C:\devlop\cms\START_BACKEND_SERVICES.bat` をダブルクリック
2. 複数のコマンドプロンプトウィンドウが開きます
3. 各サービスが起動するまで60-90秒待ちます

**方法2: 手動で起動**

新しいターミナルウィンドウを3つ開いて、それぞれで以下を実行：

**ウィンドウ1 - Auth Service:**
```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

**ウィンドウ2 - Content Service:**
```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

**ウィンドウ3 - API Gateway:**
```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

### ステップ2: サービスが起動したことを確認

各サービスのログに以下のようなメッセージが表示されるまで待ちます：

```
Started ApiGatewayApplication in X.XXX seconds
Started AuthServiceApplication in X.XXX seconds
Started ContentServiceApplication in X.XXX seconds
```

### ステップ3: サービスURLを確認

ブラウザまたはcurlで以下にアクセスして確認：

- API Gateway: http://localhost:8080/actuator/health
- Auth Service: http://localhost:8081/actuator/health
- Content Service: http://localhost:8082/actuator/health

### ステップ4: フロントエンドで再試行

1. ブラウザをリフレッシュ（F5）
2. ログインページで再度ログインを試行

## 📋 サービス起動順序

1. **PostgreSQLデータベース**（既に起動中）
   - postgres-auth: ポート5432
   - postgres-content: ポート5433
   - postgres-media: ポート5434
   - postgres-user: ポート5435

2. **Auth Service**（ポート8081）
   - 認証・認可を担当

3. **Content Service**（ポート8082）
   - コンテンツ管理を担当

4. **API Gateway**（ポート8080）
   - すべてのリクエストのエントリーポイント

## ⚠️ 注意事項

- 各サービスは起動に時間がかかります（通常30-60秒）
- サービスが完全に起動する前にリクエストを送信するとエラーになります
- サービスを停止する場合は、各コマンドプロンプトウィンドウで `Ctrl + C` を押してください

## 🔍 トラブルシューティング

### ポートが既に使用されている場合

```bash
# ポート8080を使用しているプロセスを確認
netstat -ano | findstr :8080

# プロセスを終了（PIDを確認してから）
taskkill /PID <PID> /F
```

### データベース接続エラーが発生する場合

1. Dockerコンテナが起動していることを確認：
   ```bash
   docker ps
   ```

2. データベースを再起動：
   ```bash
   cd C:\devlop\cms
   docker-compose restart
   ```

### ビルドエラーが発生する場合

```bash
cd C:\devlop\cms
gradlew.bat clean build -x test
```

## 💡 ヒント

- サービスを起動した後、ログを確認してエラーがないかチェックしてください
- 初回起動時は、依存関係のダウンロードに時間がかかることがあります
- サービスが正常に起動したら、ブラウザの開発者ツール（F12）でネットワークリクエストを確認してください

