# CORSエラー修正ガイド

## 🔴 問題
- `Access-Control-Allow-Origin` ヘッダーが存在しない
- フロントエンド（localhost:3002）からバックエンドAPI（localhost:8080）へのリクエストがブロックされる
- ログインができない

## ✅ 実施した修正

### 1. CorsConfig.java の修正
- `allowedOrigins("*")` と `allowCredentials(true)` の競合を解決
- 具体的なオリジンを指定（localhost:3000, 3001, 3002）
- `PATCH` メソッドを追加
- `exposedHeaders` を追加

### 2. SecurityConfig.java の修正
- CORSを有効化（`.cors(cors -> cors.configure(http))`）

### 3. application.yml の修正
- `allowedOrigins` に複数のオリジンを追加
- `maxAge` を追加

## 📋 次のステップ

### 1. API Gatewayが再起動するまで待つ

新しいコマンドプロンプトウィンドウが開いているはずです。以下のメッセージが表示されるまで待ってください（通常30-60秒）：

```
Started ApiGatewayApplication in X.XXX seconds
```

### 2. サービスが起動したことを確認

新しいターミナルで以下を実行：

```bash
netstat -ano | findstr ":8080"
```

「LISTENING」と表示されれば起動しています。

### 3. ブラウザで再試行

1. **ブラウザをリフレッシュ**（F5）
2. **開発者ツールを開く**（F12）
3. **Networkタブを確認**
   - リクエストが成功しているか確認
   - CORSエラーが表示されないことを確認
4. **ログインを再試行**
   - メール: `admin@example.com`
   - パスワード: `password`

## 🔍 確認チェックリスト

- [ ] API Gatewayが再起動した（「Started ApiGatewayApplication」と表示）
- [ ] ポート8080が「LISTENING」状態
- [ ] ブラウザをリフレッシュした
- [ ] 開発者ツールでCORSエラーが表示されない
- [ ] ログインを再試行した
- [ ] ログインが成功した

## 💡 技術的な詳細

### CORS設定のポイント

1. **allowCredentials(true) と allowedOrigins("*") は同時に使用できない**
   - セキュリティ上の理由で、認証情報を送信する場合は具体的なオリジンを指定する必要があります

2. **複数のオリジンを許可**
   - 開発環境では複数のポート（3000, 3001, 3002）からアクセスする可能性があるため

3. **OPTIONS リクエスト（プリフライト）の処理**
   - ブラウザは実際のリクエストの前にOPTIONSリクエストを送信します
   - API Gatewayがこのリクエストを正しく処理する必要があります

## 🆘 それでも解決しない場合

### 方法1: すべてのサービスを再起動

```bash
cd C:\devlop\cms
START_BACKEND_SERVICES.bat
```

### 方法2: ブラウザのキャッシュを完全にクリア

1. Ctrl + Shift + Delete
2. 「時間の範囲」を「全期間」に設定
3. 「キャッシュされた画像とファイル」にチェック
4. 「データを消去」をクリック
5. ブラウザを再起動

### 方法3: シークレットモードで試す

- Chrome: Ctrl + Shift + N
- Edge: Ctrl + Shift + P

### 方法4: 開発者ツールで確認

1. F12で開発者ツールを開く
2. Networkタブを開く
3. ログインを試行
4. `/api/auth/login` リクエストを確認
5. Response Headersに以下が含まれているか確認：
   - `Access-Control-Allow-Origin: http://localhost:3002`
   - `Access-Control-Allow-Credentials: true`

## 📝 修正されたファイル

1. `services/api-gateway/src/main/java/com/cms/apigateway/config/CorsConfig.java`
2. `services/api-gateway/src/main/java/com/cms/apigateway/config/SecurityConfig.java`
3. `services/api-gateway/src/main/resources/application.yml`

