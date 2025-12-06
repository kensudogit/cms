# 401エラー緊急対応ガイド

## 現在の問題
- 401 Unauthorized エラーが発生
- HTTP Basic認証ダイアログが表示される
- ログインページにアクセスできない

## 即座に試すべきこと

### 1. RailwayダッシュボードでHTTP認証を無効化

**最も重要な対応:**

1. https://railway.app にアクセス
2. プロジェクトを選択
3. **フロントエンドサービス**をクリック
4. **Settings**タブを開く
5. 下にスクロールして **"HTTP Authentication"** を探す
6. **"Enable HTTP Authentication"** を **OFF** にする
7. **Save** をクリック

### 2. 環境変数を確認・削除

**Variables**タブで以下を削除：
- `RAILWAY_HTTP_AUTH_USERNAME`
- `RAILWAY_HTTP_AUTH_PASSWORD`
- `HTTP_AUTH_ENABLED`

### 3. サービスを再デプロイ

Settings → **"Redeploy"** をクリック

### 4. ブラウザで確認

1. ブラウザのキャッシュをクリア（Ctrl + Shift + Delete）
2. シークレットモードでアクセス
3. フロントエンドURLにアクセス
4. HTTP Basic認証ダイアログが表示されないことを確認

## それでも解決しない場合

### API Gatewayも確認

1. **API Gatewayサービス**を選択
2. Settings → HTTP Authentication を無効化
3. Variables → HTTP認証関連の環境変数を削除

### フロントエンドの環境変数を確認

**Variables**タブで以下が正しく設定されているか確認：

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
```

**注意**: `your-api-gateway-url` は実際のAPI GatewayのURLに置き換えてください。

## 確認方法

開発者ツール（F12）の **Console** タブで：
- ✅ エラーが表示されない
- ✅ 401 Unauthorized が表示されない
- ✅ ログインページが正常に表示される

## 連絡先

問題が解決しない場合は、以下を確認してください：
1. Railwayダッシュボードのログ（各サービスの "Logs" タブ）
2. ブラウザの開発者ツールの Network タブ
3. エラーメッセージの詳細

