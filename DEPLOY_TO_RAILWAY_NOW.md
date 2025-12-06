# Railway完全公開デプロイ - 実行手順

## 🚀 デプロイ前の準備

### 1. コードのコミットとプッシュ

まず、変更をGitHubにプッシュする必要があります：

```bash
cd C:\devlop\cms
git add .
git commit -m "Update: Modern design, login page, favicon fix"
git push origin main
```

### 2. Railwayプロジェクトの確認

1. https://railway.app にアクセス
2. ログイン
3. 既存のプロジェクトがあるか確認、なければ新規作成

## 📋 デプロイ手順

### ステップ1: データベースの作成（4つ）

Railwayダッシュボードで：

1. **New** → **Database** → **Add PostgreSQL**
2. サービス名: `cms-auth-db`
3. 同様に以下も作成：
   - `cms-content-db`
   - `cms-media-db`
   - `cms-user-db`

### ステップ2: バックエンドサービスのデプロイ

#### Auth Service

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/auth-service`
   - **Start Command**: `java -jar ../../services/auth-service/build/libs/auth-service.jar`
3. **Variables**:
   ```
   SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this
   JWT_EXPIRATION=86400000
   JWT_REFRESH_EXPIRATION=604800000
   PORT=8081
   ```
4. **Networking**: **Generate Domain** をクリック

#### Content Service

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/content-service`
   - **Start Command**: `java -jar ../../services/content-service/build/libs/content-service.jar`
3. **Variables**:
   ```
   SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
   PORT=8082
   ```
4. **Networking**: **Generate Domain** をクリック

#### Media Service

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/media-service`
   - **Start Command**: `java -jar ../../services/media-service/build/libs/media-service.jar`
3. **Variables**:
   ```
   SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-media-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-media-db.PGPASSWORD}}
   PORT=8083
   ```
4. **Networking**: **Generate Domain** をクリック

#### User Service

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/user-service`
   - **Start Command**: `java -jar ../../services/user-service/build/libs/user-service.jar`
3. **Variables**:
   ```
   SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-user-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-user-db.PGPASSWORD}}
   PORT=8084
   ```
4. **Networking**: **Generate Domain** をクリック

#### API Gateway（重要）

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/api-gateway`
   - **Start Command**: `java -jar ../../services/api-gateway/build/libs/api-gateway.jar`
3. **Variables**:
   ```
   AUTH_SERVICE_URL=https://実際のauth-service-url.railway.app
   CONTENT_SERVICE_URL=https://実際のcontent-service-url.railway.app
   MEDIA_SERVICE_URL=https://実際のmedia-service-url.railway.app
   USER_SERVICE_URL=https://実際のuser-service-url.railway.app
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this
   ALLOWED_ORIGINS=*
   PORT=8080
   ```
   **注意**: 上記のURLは各サービスをデプロイした後に生成されたURLに置き換えてください。
4. **Networking**: **Generate Domain** をクリック（**メイン公開URL**）

### ステップ3: フロントエンドのデプロイ

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. **Variables**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api-gateway-url.railway.app
   NODE_ENV=production
   PORT=3000
   ```
   **注意**: `NEXT_PUBLIC_API_BASE_URL` はステップ2で生成されたAPI GatewayのURLに置き換えてください。
4. **Networking**: **Generate Domain** をクリック
5. **Settings** → **HTTP Authentication** を **OFF** にする（重要！）

## ⚠️ 重要な設定

### HTTP認証の無効化（必須）

フロントエンドサービスの **Settings** → **HTTP Authentication** で：
- **"Enable HTTP Authentication"** を **OFF** にする
- これを行わないと、401エラーが発生します

### CORS設定

API Gatewayの環境変数で：
```
ALLOWED_ORIGINS=*
```
これにより、すべてのオリジンからのアクセスが許可されます。

## ✅ デプロイ後の確認

### 1. サービスヘルスチェック

各サービスの **Deployments** タブで：
- 最新のデプロイメントが **"Active"** になっているか確認
- **"Logs"** タブでエラーがないか確認

### 2. ブラウザで確認

1. フロントエンドURLにアクセス
2. HTTP Basic認証ダイアログが表示されないことを確認
3. ログインページが表示されることを確認
4. テストアカウントでログイン：
   - メール: `admin@example.com`
   - パスワード: `password`

### 3. 開発者ツールで確認

1. F12で開発者ツールを開く
2. **Console** タブでエラーがないか確認
3. **Network** タブでAPIリクエストが成功しているか確認

## 🆘 トラブルシューティング

### ビルドエラー

- **Logs** タブでエラーログを確認
- Java 21が使用されているか確認
- 環境変数が正しく設定されているか確認

### 401エラー

- フロントエンドサービスの **Settings** → **HTTP Authentication** が **OFF** になっているか確認
- VariablesタブでHTTP認証関連の環境変数を削除

### 502エラー

- サービスの **Deployments** タブで最新のデプロイメントが **"Active"** になっているか確認
- **Logs** タブでエラーログを確認
- サービスを再デプロイ

### サービス間通信エラー

- API Gatewayの環境変数で各サービスのURLが正しく設定されているか確認
- サービス名ではなく、実際のRailway URLを使用

## 📝 デプロイチェックリスト

- [ ] コードをGitHubにプッシュ
- [ ] データベース（4つ）を作成
- [ ] Auth Serviceをデプロイ
- [ ] Content Serviceをデプロイ
- [ ] Media Serviceをデプロイ
- [ ] User Serviceをデプロイ
- [ ] API Gatewayをデプロイ（URLを記録）
- [ ] フロントエンドをデプロイ（API Gateway URLを設定）
- [ ] フロントエンドのHTTP認証を無効化
- [ ] すべてのサービスのデプロイメントが "Active" になっている
- [ ] ブラウザでフロントエンドにアクセス
- [ ] ログインページが表示される
- [ ] テストアカウントでログインできる

