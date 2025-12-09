# Railway HTTP認証の無効化手順

## 問題
ブラウザでRailwayのHTTP Basic認証ダイアログが表示され、アプリケーションのログイン画面にアクセスできません。

## 解決方法

### 方法1: Railway Web UIで無効化（推奨）

1. **Railwayダッシュボードにアクセス**
   - https://railway.app にログイン

2. **フロントエンドサービスを選択**
   - プロジェクト一覧から `cms-frontend` またはフロントエンドサービスを選択

3. **Settingsタブを開く**
   - 左側のメニューから **Settings** をクリック

4. **HTTP Authenticationを無効化**
   - **"HTTP Authentication"** または **"Basic Authentication"** セクションを探す
   - **"Enable HTTP Authentication"** のトグルを **OFF** にする
   - または、**"Public"** に設定する

5. **変更を保存**
   - 自動的に保存されるか、**Save** ボタンをクリック

6. **サービスを再デプロイ（必要に応じて）**
   - 変更が反映されない場合は、**Deployments** タブから再デプロイを実行

### 方法2: 環境変数で無効化

1. **Variablesタブを開く**
   - フロントエンドサービスの **Variables** タブを開く

2. **HTTP認証関連の環境変数を削除**
   以下の環境変数が存在する場合は削除：
   - `RAILWAY_HTTP_AUTH_USERNAME`
   - `RAILWAY_HTTP_AUTH_PASSWORD`
   - `HTTP_AUTH_ENABLED`
   - `RAILWAY_HTTP_AUTH_ENABLED`

3. **サービスを再デプロイ**
   - 変更を保存後、自動的に再デプロイされる

### 方法3: Railway CLIで無効化

```bash
# Railway CLIにログイン
railway login

# プロジェクトを選択
railway link

# フロントエンドサービスを選択
railway service

# HTTP認証関連の環境変数を削除
railway variables unset RAILWAY_HTTP_AUTH_USERNAME
railway variables unset RAILWAY_HTTP_AUTH_PASSWORD
railway variables unset HTTP_AUTH_ENABLED
railway variables unset RAILWAY_HTTP_AUTH_ENABLED
```

## 確認手順

1. **ブラウザでアクセス**
   - フロントエンドURL（例: `https://cms-production-67c0.up.railway.app`）にアクセス

2. **HTTP認証ダイアログが表示されないことを確認**
   - ブラウザのHTTP Basic認証ダイアログが表示されない
   - 直接アプリケーションのログイン画面が表示される

3. **ログイン画面が表示されることを確認**
   - 多言語対応のログイン画面が表示される
   - 言語切り替えボタンが表示される

## トラブルシューティング

### HTTP認証ダイアログがまだ表示される場合

1. **ブラウザのキャッシュをクリア**
   - ブラウザの開発者ツール（F12）を開く
   - ネットワークタブで「キャッシュを無効にする」をチェック
   - ページを再読み込み

2. **シークレット/プライベートモードで確認**
   - 新しいシークレット/プライベートウィンドウでアクセス

3. **環境変数を再確認**
   - Railwayダッシュボードの **Variables** タブで、HTTP認証関連の環境変数が完全に削除されているか確認

4. **サービスを再デプロイ**
   - **Deployments** タブから最新のデプロイを確認
   - 必要に応じて手動で再デプロイを実行

## 注意事項

- HTTP認証を無効化すると、アプリケーションが公開されます
- 本番環境では、アプリケーション側の認証（ログイン機能）でセキュリティを確保してください
- 開発環境でのみHTTP認証を使用する場合は、環境変数で制御できます


