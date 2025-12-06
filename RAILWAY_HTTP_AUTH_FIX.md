# Railway HTTP認証の完全無効化手順

## 問題
401 Unauthorized エラーが発生し、ブラウザのHTTP Basic認証ダイアログが表示される。

## 原因
RailwayのHTTP認証機能が有効になっています。

## 解決方法（詳細手順）

### 方法1: Railway Web UIで無効化（推奨）

#### ステップ1: Railwayダッシュボードにアクセス
1. https://railway.app にアクセス
2. ログイン
3. CMSプロジェクトを選択

#### ステップ2: フロントエンドサービスを選択
1. プロジェクト内のサービス一覧から **フロントエンドサービス** をクリック
2. サービス名は通常 `frontend` または `cms-frontend` など

#### ステップ3: Settingsタブを開く
1. 上部のタブから **"Settings"** をクリック
2. 下にスクロールして **"HTTP Authentication"** セクションを探す

#### ステップ4: HTTP認証を無効化
1. **"Enable HTTP Authentication"** のトグルスイッチを **OFF** にする
2. または、**"HTTP Authentication"** セクション全体を削除

#### ステップ5: 変更を保存
1. ページ下部の **"Save"** または **"Update"** ボタンをクリック
2. サービスが自動的に再デプロイされます

### 方法2: 環境変数で無効化

#### ステップ1: Variablesタブを開く
1. フロントエンドサービスの **"Variables"** タブをクリック

#### ステップ2: HTTP認証関連の環境変数を削除
以下の環境変数が存在する場合は削除：

- `RAILWAY_HTTP_AUTH_USERNAME`
- `RAILWAY_HTTP_AUTH_PASSWORD`
- `HTTP_AUTH_ENABLED`
- `RAILWAY_HTTP_AUTH_ENABLED`

#### ステップ3: 削除方法
1. 各環境変数の右側にある **"..."** メニューをクリック
2. **"Delete"** を選択
3. 確認ダイアログで **"Delete"** をクリック

### 方法3: Railway CLIで無効化

```bash
# Railway CLIにログイン
railway login

# プロジェクトを選択
railway link

# フロントエンドサービスを選択
railway service

# 環境変数を削除
railway variables unset RAILWAY_HTTP_AUTH_USERNAME
railway variables unset RAILWAY_HTTP_AUTH_PASSWORD
railway variables unset HTTP_AUTH_ENABLED
railway variables unset RAILWAY_HTTP_AUTH_ENABLED
```

## 確認方法

### 1. ブラウザで確認
1. フロントエンドURLにアクセス（例: `https://cms-production-4a51.up.railway.app`）
2. HTTP Basic認証ダイアログが表示されないことを確認
3. ログインページが表示されることを確認

### 2. 開発者ツールで確認
1. ブラウザの開発者ツール（F12）を開く
2. **Network** タブを開く
3. ページをリロード
4. リクエストのステータスコードを確認
   - 401 Unauthorized が表示されないことを確認
   - 200 OK が表示されることを確認

### 3. コンソールで確認
1. 開発者ツールの **Console** タブを開く
2. エラーメッセージがないことを確認
3. `net::ERR_HTTP_RESPONSE_CODE_FAILURE 401` が表示されないことを確認

## トラブルシューティング

### HTTP認証が無効化できない場合

1. **サービスを再デプロイ**
   - Settings → "Redeploy" をクリック
   - または、GitHubにプッシュして自動デプロイをトリガー

2. **ブラウザのキャッシュをクリア**
   - Ctrl + Shift + Delete でキャッシュをクリア
   - または、シークレットモードでアクセス

3. **他のサービスも確認**
   - API GatewayサービスにもHTTP認証が有効になっていないか確認
   - すべてのバックエンドサービスも確認

### まだ401エラーが表示される場合

1. **API Gatewayの設定を確認**
   - API GatewayサービスのSettingsを確認
   - HTTP認証が無効になっているか確認

2. **CORS設定を確認**
   - API Gatewayの環境変数 `ALLOWED_ORIGINS` が `*` または正しいフロントエンドURLに設定されているか確認

3. **環境変数を確認**
   - フロントエンドの `NEXT_PUBLIC_API_BASE_URL` が正しく設定されているか確認
   - API GatewayのURLが正しいか確認

## 追加の確認事項

### フロントエンドの環境変数
以下の環境変数が正しく設定されているか確認：

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
NODE_ENV=production
PORT=3000
```

### API Gatewayの環境変数
以下の環境変数が正しく設定されているか確認：

```
ALLOWED_ORIGINS=*
AUTH_SERVICE_URL=https://your-auth-service-url.railway.app
CONTENT_SERVICE_URL=https://your-content-service-url.railway.app
```

## 緊急対応（一時的な回避策）

HTTP認証を無効化できない場合、一時的に認証情報を使用：

1. ブラウザのHTTP Basic認証ダイアログで：
   - ユーザー名: Railwayダッシュボードで確認した値
   - パスワード: Railwayダッシュボードで確認した値
2. ログイン後、アプリケーションのログインページにアクセス

**注意**: これは一時的な回避策です。根本的な解決のためには、RailwayのHTTP認証を無効化する必要があります。

