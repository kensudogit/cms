# 401エラー 最終解決ガイド

## 🔴 現在の問題
```
GET https://cms-production-4a51.up.railway.app/
net::ERR_HTTP_RESPONSE_CODE_FAILURE 401 (Unauthorized)
```

これは**RailwayのHTTP認証**が有効になっているためです。

## ✅ 解決方法（必須）

### ステップ1: Railwayダッシュボードにアクセス

1. ブラウザで https://railway.app を開く
2. ログイン（GitHubアカウントなど）
3. プロジェクト一覧から **CMSプロジェクト** をクリック

### ステップ2: フロントエンドサービスを特定

プロジェクト内のサービス一覧で、URLが `cms-production-4a51.up.railway.app` のサービスを探します。

**見つけ方:**
- サービス名の横に表示されているURLを確認
- または、サービス名が `frontend`、`cms-frontend`、`frontend-production` など

### ステップ3: サービスを開く

1. フロントエンドサービスを**クリック**
2. サービス詳細ページが開きます

### ステップ4: Settingsタブを開く

1. ページ上部のタブから **"Settings"** をクリック
2. Settingsページが表示されます

### ステップ5: HTTP Authenticationを探す

Settingsページを**下にスクロール**して、以下のいずれかを探してください：

- **"HTTP Authentication"**
- **"Basic Authentication"**
- **"Authentication"**
- **"Security"**

**見つからない場合:**
- ページ内検索（Ctrl + F）で "HTTP" または "Authentication" を検索
- すべてのセクションを確認

### ステップ6: HTTP認証を無効化

見つかったセクションで：

1. **"Enable HTTP Authentication"** というトグルスイッチを探す
2. スイッチが **ON（青）** になっている場合は、**クリックしてOFF（グレー）** にする
3. または、**"Disable"** ボタンをクリック

### ステップ7: 変更を保存

1. ページ下部または上部にある **"Save"** または **"Update"** ボタンをクリック
2. 確認ダイアログが表示された場合は **"Confirm"** をクリック
3. サービスが自動的に再デプロイされます（1-2分）

### ステップ8: Variablesタブも確認

1. 同じサービスの **"Variables"** タブをクリック
2. 以下の環境変数が存在する場合は**すべて削除**：
   - `RAILWAY_HTTP_AUTH_USERNAME`
   - `RAILWAY_HTTP_AUTH_PASSWORD`
   - `HTTP_AUTH_ENABLED`
   - `RAILWAY_HTTP_AUTH_ENABLED`

**削除方法:**
- 各環境変数の右側にある **"..."** メニューをクリック
- **"Delete"** を選択
- 確認ダイアログで **"Delete"** をクリック

### ステップ9: 再デプロイを確認

1. **"Deployments"** タブをクリック
2. 最新のデプロイメントが **"Building"** または **"Deploying"** になっていることを確認
3. **"Active"** になるまで待つ（通常1-2分）

### ステップ10: ブラウザで確認

1. **ブラウザのキャッシュを完全にクリア**：
   - **Ctrl + Shift + Delete** を押す
   - 「キャッシュされた画像とファイル」にチェック
   - 「データを消去」をクリック

2. **シークレットモードでアクセス**：
   - **Ctrl + Shift + N**（Chrome）または **Ctrl + Shift + P**（Firefox）
   - フロントエンドURLにアクセス：`https://cms-production-4a51.up.railway.app`

3. **確認**：
   - ✅ HTTP Basic認証ダイアログが表示されない
   - ✅ アプリケーションのログインページが表示される
   - ✅ 開発者ツール（F12）のConsoleに401エラーが表示されない

## 🆘 それでも解決しない場合

### 方法A: 一時的に認証情報を入力

1. HTTP Basic認証ダイアログが表示されたら：
   - Railwayダッシュボードの **Settings** → **"HTTP Authentication"** セクションで認証情報を確認
   - または **Variables** タブで `RAILWAY_HTTP_AUTH_USERNAME` と `RAILWAY_HTTP_AUTH_PASSWORD` を確認
2. 認証情報を入力して通過
3. その後、アプリケーションのログインページにアクセスできるはずです

### 方法B: API Gatewayも確認

1. **API Gatewayサービス**を選択
2. **Settings** → **HTTP Authentication** を無効化
3. **Variables** → HTTP認証関連の環境変数を削除

### 方法C: Railway CLIを使用

```bash
# Railway CLIをインストール（未インストールの場合）
npm install -g @railway/cli

# ログイン
railway login

# プロジェクトを選択
railway link

# フロントエンドサービスを選択
railway service

# 環境変数を削除
railway variables unset RAILWAY_HTTP_AUTH_USERNAME
railway variables unset RAILWAY_HTTP_AUTH_PASSWORD
railway variables unset HTTP_AUTH_ENABLED
```

## 📋 確認チェックリスト

- [ ] Railwayダッシュボードにアクセスできた
- [ ] フロントエンドサービス（URL: cms-production-4a51.up.railway.app）を特定できた
- [ ] Settingsタブを開いた
- [ ] HTTP Authenticationセクションを見つけた
- [ ] Enable HTTP AuthenticationをOFFにした
- [ ] 変更を保存した
- [ ] VariablesタブでHTTP認証関連の環境変数を削除した
- [ ] サービスが再デプロイされた（Deploymentsタブで確認）
- [ ] ブラウザのキャッシュをクリアした
- [ ] シークレットモードでアクセスした
- [ ] HTTP Basic認証ダイアログが表示されなくなった
- [ ] アプリケーションのログインページが表示された
- [ ] 開発者ツールのConsoleに401エラーが表示されなくなった

## ⚠️ 重要な注意事項

1. **HTTP認証の無効化は必須です**
   - これを行わない限り、401エラーは解決しません
   - フロントエンドのコードを変更しても解決しません（サーバー側の設定です）

2. **設定変更の反映には時間がかかります**
   - 通常1-2分かかります
   - ブラウザのキャッシュをクリアする必要があります

3. **すべてのサービスを確認してください**
   - フロントエンドサービスだけでなく、API Gatewayサービスも確認してください

## 💡 ヒント

- Railwayの設定変更は即座に反映されない場合があります（1-2分かかる）
- ブラウザのキャッシュが原因で古い認証ダイアログが表示されることがあります
- シークレットモードを使用すると、キャッシュの影響を受けません
- 複数のブラウザで試してみてください

