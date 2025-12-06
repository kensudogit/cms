# Railway HTTP認証の無効化方法

## 問題
ブラウザのHTTP Basic認証ダイアログが表示され、アプリケーションのログイン画面にアクセスできません。

## 原因
RailwayのHTTP認証機能が有効になっています。

## 解決方法

### 方法1: Railway Web UIで無効化

1. Railwayダッシュボード（https://railway.app）にアクセス
2. フロントエンドサービスを選択
3. **Settings** タブを開く
4. **"HTTP Authentication"** または **"Basic Authentication"** セクションを探す
5. **"Enable HTTP Authentication"** を **OFF** にする
6. 変更を保存

### 方法2: 環境変数で無効化

1. フロントエンドサービスの **Variables** タブを開く
2. 以下の環境変数を削除または無効化：
   - `RAILWAY_HTTP_AUTH_USERNAME`
   - `RAILWAY_HTTP_AUTH_PASSWORD`
   - `HTTP_AUTH_ENABLED`
3. サービスを再デプロイ

### 方法3: Railway CLIで無効化

```bash
railway variables unset RAILWAY_HTTP_AUTH_USERNAME
railway variables unset RAILWAY_HTTP_AUTH_PASSWORD
railway variables unset HTTP_AUTH_ENABLED
```

## 確認

HTTP認証を無効化した後：
1. ブラウザでフロントエンドURLにアクセス
2. HTTP Basic認証ダイアログが表示されないことを確認
3. アプリケーションのログイン画面が表示されることを確認

