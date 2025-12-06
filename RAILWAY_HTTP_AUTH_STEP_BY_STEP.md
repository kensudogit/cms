# Railway HTTP認証無効化 - ステップバイステップ

## ⚠️ 現在の状況
ブラウザのHTTP Basic認証ダイアログが表示されています。これは**アプリケーションのログインページではありません**。RailwayのHTTP認証機能です。

## 🔧 解決方法（詳細手順）

### ステップ1: Railwayダッシュボードにアクセス

1. ブラウザで https://railway.app を開く
2. ログイン（GitHubアカウントなど）
3. プロジェクト一覧から **CMSプロジェクト** を選択

### ステップ2: フロントエンドサービスを特定

プロジェクト内のサービス一覧で、以下のいずれかを探してください：
- `frontend`
- `cms-frontend`
- `frontend-production`
- または、Next.jsアプリケーションとしてデプロイされたサービス

**確認方法:**
- サービス名の横に「Web Service」と表示されている
- または、URLが `cms-production-4a51.up.railway.app` のようなもの

### ステップ3: サービスを開く

1. フロントエンドサービスを**クリック**
2. サービス詳細ページが開きます

### ステップ4: Settingsタブを開く

1. ページ上部のタブから **"Settings"** をクリック
2. Settingsページが表示されます

### ステップ5: HTTP Authenticationセクションを探す

Settingsページを下にスクロールして、以下のセクションを探してください：

**探すべきセクション:**
- "HTTP Authentication"
- "Basic Authentication"
- "Authentication"
- "Security"

**見つからない場合:**
- ページの右上にある検索ボックスで "HTTP" または "Authentication" を検索
- または、すべてのセクションを確認

### ステップ6: HTTP認証を無効化

見つかったセクションで：

1. **"Enable HTTP Authentication"** というトグルスイッチを探す
2. スイッチが **ON（青）** になっている場合は、**クリックしてOFF（グレー）** にする
3. または、**"Disable HTTP Authentication"** ボタンをクリック

### ステップ7: 変更を保存

1. ページ下部または上部にある **"Save"** または **"Update"** ボタンをクリック
2. 確認ダイアログが表示された場合は **"Confirm"** をクリック
3. サービスが自動的に再デプロイされます（1-2分かかります）

### ステップ8: Variablesタブも確認

1. 同じサービスの **"Variables"** タブをクリック
2. 以下の環境変数が存在する場合は削除：
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

1. ブラウザのキャッシュをクリア：
   - **Ctrl + Shift + Delete** を押す
   - 「キャッシュされた画像とファイル」にチェック
   - 「データを消去」をクリック

2. シークレットモードでアクセス：
   - **Ctrl + Shift + N**（Chrome）または **Ctrl + Shift + P**（Firefox）
   - フロントエンドURLにアクセス

3. 確認：
   - ✅ HTTP Basic認証ダイアログが表示されない
   - ✅ アプリケーションのログインページが表示される
   - ✅ 開発者ツール（F12）のConsoleに401エラーが表示されない

## 🆘 それでも解決しない場合

### 方法A: 一時的に認証情報を入力

1. HTTP Basic認証ダイアログで認証情報を入力
2. Railwayダッシュボードの **Settings** → **"HTTP Authentication"** セクションで認証情報を確認
3. 入力後、アプリケーションのログインページにアクセスできるはずです

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

## 📝 確認チェックリスト

- [ ] Railwayダッシュボードにアクセスできた
- [ ] フロントエンドサービスを特定できた
- [ ] Settingsタブを開いた
- [ ] HTTP Authenticationセクションを見つけた
- [ ] Enable HTTP AuthenticationをOFFにした
- [ ] 変更を保存した
- [ ] VariablesタブでHTTP認証関連の環境変数を削除した
- [ ] サービスが再デプロイされた
- [ ] ブラウザのキャッシュをクリアした
- [ ] HTTP Basic認証ダイアログが表示されなくなった

## 💡 ヒント

- Railwayの設定変更は即座に反映されない場合があります（1-2分かかる）
- ブラウザのキャッシュが原因で古い認証ダイアログが表示されることがあります
- シークレットモードを使用すると、キャッシュの影響を受けません

