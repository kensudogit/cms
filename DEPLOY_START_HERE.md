# Railway完全公開デプロイ - 開始ガイド

## ✅ 現在の状態

- ✅ Railway CLIがインストール済み
- ✅ Railway CLIにログイン済み
- ✅ コードはGitHubにプッシュ済み
- ⚠️ プロジェクトがリンクされていない

## 🚀 デプロイ方法の選択

### 方法1: Railway Web UIを使用（推奨・簡単）

**最も簡単で確実な方法です。**

1. **Railwayダッシュボードにアクセス**
   - https://railway.app にアクセス
   - ログイン（既にログイン済み）

2. **プロジェクトを作成または選択**
   - 既存のプロジェクトがある場合：選択
   - 新規プロジェクトの場合：「New Project」→「Deploy from GitHub repo」→ CMSリポジトリを選択

3. **詳細な手順に従う**
   - `DEPLOY_TO_RAILWAY_NOW.md` を参照
   - ステップバイステップでデプロイを実行

### 方法2: Railway CLIを使用

**コマンドラインからデプロイしたい場合。**

#### ステップ1: プロジェクトをリンク

既存のプロジェクトがある場合：
```bash
cd C:\devlop\cms
railway link
```

新規プロジェクトを作成する場合：
```bash
cd C:\devlop\cms
railway init
```

#### ステップ2: デプロイを実行

詳細は `RAILWAY_DEPLOY_EXECUTE.md` を参照してください。

## 📋 デプロイ手順の概要

### 1. データベースの作成（4つ）
- `cms-auth-db`
- `cms-content-db`
- `cms-media-db`
- `cms-user-db`

### 2. バックエンドサービスのデプロイ（5つ）
- Auth Service
- Content Service
- Media Service
- User Service
- API Gateway

### 3. フロントエンドのデプロイ
- Next.jsアプリケーション
- **重要**: HTTP認証を無効化

## ⚠️ 重要な注意事項

### HTTP認証の無効化（必須）

フロントエンドサービスの **Settings** → **HTTP Authentication** で：
- **"Enable HTTP Authentication"** を **OFF** にする

これを行わないと、401エラーが発生します。

### 完全公開モードの設定

1. **すべてのサービスでパブリックドメインを生成**
   - 各サービスの **Networking** → **Generate Domain**

2. **CORS設定**
   - API Gatewayの環境変数: `ALLOWED_ORIGINS=*`

3. **環境変数の設定**
   - 各サービスに必要な環境変数を設定
   - API Gatewayの環境変数で各サービスのURLを設定

## 📚 参考ドキュメント

- **`DEPLOY_TO_RAILWAY_NOW.md`** - 詳細なデプロイ手順（Web UI）
- **`RAILWAY_DEPLOY_EXECUTE.md`** - CLIを使用したデプロイ手順
- **`RAILWAY_DEPLOY_COMPLETE.md`** - 完全なデプロイガイド
- **`RAILWAY_DEPLOY_CHECKLIST.md`** - デプロイチェックリスト

## 🎯 次のステップ

1. **Railwayダッシュボードにアクセス**
   - https://railway.app

2. **プロジェクトを作成または選択**

3. **`DEPLOY_TO_RAILWAY_NOW.md` を開いて、ステップバイステップでデプロイを実行**

4. **デプロイ完了後、フロントエンドのHTTP認証を無効化**

5. **ブラウザで確認**
   - フロントエンドURLにアクセス
   - ログインページが表示されることを確認

## 🆘 トラブルシューティング

### 401エラーが発生する場合
- フロントエンドサービスのHTTP認証を無効化
- `URGENT_401_FIX.md` を参照

### 502エラーが発生する場合
- サービスのデプロイメント状態を確認
- `ERROR_502_FIX.md` を参照

### ビルドエラーが発生する場合
- Logsタブでエラーログを確認
- 環境変数が正しく設定されているか確認

