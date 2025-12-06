# 🚨 緊急: 401エラー解決方法

## 問題
```
GET https://cms-production-4a51.up.railway.app/
401 (Unauthorized)
```

## ⚡ 即座に実行すべきこと

### 1. Railwayダッシュボードにアクセス
https://railway.app → ログイン → CMSプロジェクトを選択

### 2. フロントエンドサービスを開く
URLが `cms-production-4a51.up.railway.app` のサービスをクリック

### 3. Settingsタブを開く
ページ上部の **"Settings"** タブをクリック

### 4. HTTP Authenticationを探す
ページを下にスクロール → **"HTTP Authentication"** セクションを探す

### 5. 無効化
**"Enable HTTP Authentication"** を **OFF** にする

### 6. 保存
**"Save"** ボタンをクリック

### 7. Variablesタブも確認
**"Variables"** タブ → 以下を削除：
- `RAILWAY_HTTP_AUTH_USERNAME`
- `RAILWAY_HTTP_AUTH_PASSWORD`
- `HTTP_AUTH_ENABLED`

### 8. ブラウザで確認
1. キャッシュをクリア（Ctrl + Shift + Delete）
2. シークレットモードでアクセス（Ctrl + Shift + N）
3. `https://cms-production-4a51.up.railway.app` にアクセス

## ✅ 成功の確認

- HTTP Basic認証ダイアログが表示されない
- アプリケーションのログインページが表示される
- 開発者ツール（F12）のConsoleに401エラーが表示されない

## 🆘 それでも解決しない場合

### 一時的な回避策
HTTP Basic認証ダイアログで認証情報を入力して通過してください。
認証情報はRailwayダッシュボードのSettings → HTTP Authenticationセクションで確認できます。

---

**重要**: この問題はRailwayの設定でしか解決できません。フロントエンドのコードを変更しても解決しません。

