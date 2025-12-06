# CORSエラーとサービス起動の修正

## 🔴 現在の問題

1. **500 Internal Server Error** (`/api/auth/login`)
   - Auth Serviceが起動していないため、API Gatewayがリクエストを転送できない

2. **CORS Policy Error**
   - `Access-Control-Allow-Origin`ヘッダーがレスポンスに含まれていない
   - プリフライトリクエスト（OPTIONS）が失敗している

3. **サービス未起動**
   - Auth Service (ポート8081) - 未起動
   - Content Service (ポート8082) - 未起動

## ✅ 実施した修正

### 1. CORS設定の改善

**`CorsConfig.java`** を更新：
- `X-User-Id` を `exposedHeaders` に追加

**`application.yml`** を更新：
- `exposedHeaders` を明示的に設定
  - Authorization
  - Content-Type
  - X-User-Id

### 2. サービス起動

Auth ServiceとContent Serviceを起動しました。

## 📋 解決手順

### ステップ1: サービス起動を確認

新しいコマンドプロンプトで以下を実行：

```bash
netstat -ano | findstr ":8081 :8082"
```

両方のポートで「LISTENING」と表示されるまで待ってください（通常60-90秒）。

### ステップ2: API Gatewayを再起動（CORS設定を反映）

**方法1: 自動スクリプトを使用（推奨）**

`C:\devlop\cms\RESTART_API_GATEWAY_FOR_CORS.bat` をダブルクリックしてください。

**方法2: 手動で再起動**

1. API Gatewayのコマンドプロンプトウィンドウを見つける
2. `Ctrl+C` で停止
3. 新しいウィンドウで以下を実行：
   ```bash
   cd C:\devlop\cms
   gradlew.bat :services:api-gateway:bootRun
   ```

### ステップ3: サービス起動の確認

すべてのサービスが起動していることを確認：

```bash
# ポートの確認
netstat -ano | findstr ":8080 :8081 :8082"

# 期待される出力：
# TCP    0.0.0.0:8080   ... LISTENING  (API Gateway)
# TCP    0.0.0.0:8081   ... LISTENING  (Auth Service)
# TCP    0.0.0.0:8082   ... LISTENING  (Content Service)
```

### ステップ4: データベース接続の確認

サービスが起動すると、自動的に以下が実行されます：

1. **JPAがテーブルを作成**
   - Auth Service: `users` テーブル
   - Content Service: `contents` テーブル

2. **初期データが投入される**
   - `data.sql` が自動実行される

データベースの状態を確認：

```bash
# Auth Serviceのデータベース
docker exec cms-postgres-auth psql -U postgres -d auth_db -c "SELECT COUNT(*) FROM users;"

# Content Serviceのデータベース
docker exec cms-postgres-content psql -U postgres -d content_db -c "SELECT COUNT(*) FROM contents;"
```

### ステップ5: ブラウザで再試行

1. **ブラウザのキャッシュをクリア**
   - `Ctrl+Shift+Delete` → キャッシュをクリア
   - または、シークレット/プライベートモードで開く

2. **ページをリロード**
   - `F5` または `Ctrl+R`

3. **ログインを試行**
   - メール: `admin@example.com`
   - パスワード: `password`

4. **エラーが解消されたか確認**
   - ブラウザの開発者ツール（F12）でエラーを確認
   - CORSエラーが表示されないことを確認

## 🔍 CORS設定の詳細

### 現在のCORS設定

**許可されているオリジン:**
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`

**許可されているメソッド:**
- GET, POST, PUT, DELETE, OPTIONS, PATCH

**許可されているヘッダー:**
- すべて (`*`)

**認証情報の送信:**
- 許可 (`allowCredentials: true`)

**公開されるヘッダー:**
- Authorization
- Content-Type
- X-User-Id

## 🆘 トラブルシューティング

### CORSエラーが続く場合

1. **API Gatewayが再起動されたか確認**
   ```bash
   netstat -ano | findstr ":8080"
   ```

2. **ブラウザのキャッシュを完全にクリア**
   - 開発者ツール（F12）を開く
   - 「Network」タブで「Disable cache」にチェック
   - ページをリロード

3. **プリフライトリクエスト（OPTIONS）を確認**
   - 開発者ツールの「Network」タブで `/api/auth/login` のリクエストを確認
   - OPTIONSリクエストが成功しているか確認
   - レスポンスヘッダーに `Access-Control-Allow-Origin` が含まれているか確認

### 500エラーが続く場合

1. **Auth ServiceとContent Serviceが起動しているか確認**
   ```bash
   netstat -ano | findstr ":8081 :8082"
   ```

2. **サービスのログを確認**
   - Auth Serviceのコマンドプロンプトウィンドウでエラーメッセージを確認
   - Content Serviceのコマンドプロンプトウィンドウでエラーメッセージを確認

3. **データベース接続を確認**
   ```bash
   docker ps | findstr "cms-postgres"
   ```

### サービスが起動しない場合

1. **ポートの競合を確認**
   ```bash
   netstat -ano | findstr ":8081 :8082"
   ```

2. **Javaプロセスを確認**
   ```bash
   tasklist | findstr "java.exe"
   ```

3. **サービスを再起動**
   - 各サービスのコマンドプロンプトウィンドウを閉じる
   - `START_BACKEND_SERVICES.bat` を実行

## 📝 確認チェックリスト

- [ ] Auth Serviceが起動した（ポート8081がLISTENING）
- [ ] Content Serviceが起動した（ポート8082がLISTENING）
- [ ] API Gatewayが再起動された（CORS設定が反映された）
- [ ] ブラウザのキャッシュをクリアした
- [ ] ページをリロードした
- [ ] ログインを再試行した
- [ ] CORSエラーが表示されない
- [ ] 500エラーが表示されない
- [ ] コンテンツ一覧が表示される

## 🎯 まとめ

1. **Auth ServiceとContent Serviceを起動** - これにより500エラーが解消されます
2. **API Gatewayを再起動** - これによりCORS設定が反映されます
3. **ブラウザのキャッシュをクリア** - これにより古いCORS設定がクリアされます

すべてのサービスが起動し、API Gatewayが再起動されれば、CORSエラーと500エラーが解消されるはずです。

