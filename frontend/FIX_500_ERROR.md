# 500 Internal Server Error 修正ガイド

## 🔴 問題
- `/api/auth/login` で500 Internal Server Errorが発生
- ログインができない

## 🔍 原因
- API Gatewayは起動しているが、Auth Service（ポート8081）が起動していない
- API GatewayがAuth Serviceにリクエストを転送しようとするが、サービスが応答しない

## ✅ 解決方法

### ステップ1: バックエンドサービスを起動

**方法1: 自動起動スクリプトを使用（推奨）**

`C:\devlop\cms\START_BACKEND_SERVICES.bat` をダブルクリックしてください。

**方法2: 手動で起動**

新しいコマンドプロンプトウィンドウを3つ開いて、それぞれで以下を実行：

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

**ウィンドウ3 - API Gateway（既に起動中の場合）:**
```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

### ステップ2: サービスが起動したことを確認

各サービスのログに以下のようなメッセージが表示されるまで待ちます（通常60-90秒）：

```
Started AuthServiceApplication in X.XXX seconds
Started ContentServiceApplication in X.XXX seconds
Started ApiGatewayApplication in X.XXX seconds
```

### ステップ3: ポートがLISTENING状態であることを確認

新しいターミナルで以下を実行：

```bash
netstat -ano | findstr ":8080 :8081 :8082"
```

すべてのポートで「LISTENING」と表示されれば起動しています。

### ステップ4: サービスURLを確認

ブラウザまたはcurlで以下にアクセスして確認：

- API Gateway: http://localhost:8080/actuator/health
- Auth Service: http://localhost:8081/api/auth/health
- Content Service: http://localhost:8082/actuator/health

### ステップ5: フロントエンドで再試行

1. ブラウザをリフレッシュ（F5）
2. ログインページで再度ログインを試行
   - メール: `admin@example.com`
   - パスワード: `password`

## 📋 サービス起動順序

1. **PostgreSQLデータベース**（既に起動中）
   - postgres-auth: ポート5432
   - postgres-content: ポート5433
   - postgres-media: ポート5434
   - postgres-user: ポート5435

2. **Auth Service**（ポート8081）
   - 認証・認可を担当
   - `/api/auth/login` エンドポイントを提供

3. **Content Service**（ポート8082）
   - コンテンツ管理を担当

4. **API Gateway**（ポート8080）
   - すべてのリクエストのエントリーポイント
   - 各サービスにリクエストをルーティング

## ⚠️ 注意事項

- 各サービスは起動に時間がかかります（通常30-60秒）
- サービスが完全に起動する前にリクエストを送信すると500エラーになります
- サービスを停止する場合は、各コマンドプロンプトウィンドウで `Ctrl + C` を押してください

## 🔍 トラブルシューティング

### ポートが既に使用されている場合

```bash
# ポート8081を使用しているプロセスを確認
netstat -ano | findstr :8081

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

### サービスが起動しない場合

1. 各サービスのログを確認
2. エラーメッセージを確認
3. データベース接続を確認
4. ポートの競合を確認

## 💡 ヒント

- サービスを起動した後、ログを確認してエラーがないかチェックしてください
- 初回起動時は、依存関係のダウンロードに時間がかかることがあります
- サービスが正常に起動したら、ブラウザの開発者ツール（F12）でネットワークリクエストを確認してください

## 📝 確認チェックリスト

- [ ] PostgreSQLデータベースが起動している
- [ ] Auth Serviceが起動している（ポート8081がLISTENING）
- [ ] Content Serviceが起動している（ポート8082がLISTENING）
- [ ] API Gatewayが起動している（ポート8080がLISTENING）
- [ ] 各サービスが「Started ... Application」と表示されている
- [ ] ブラウザをリフレッシュした
- [ ] ログインを再試行した
- [ ] 500エラーが表示されない
- [ ] ログインが成功した

