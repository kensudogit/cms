# Vercel完全公開デプロイガイド

## 🚀 概要

Vercelは主にフロントエンドアプリケーション（Next.js、React、Vueなど）のデプロイに特化したプラットフォームです。**Dockerコンテナの直接デプロイはサポートしていません**が、Next.jsアプリケーションは直接デプロイできます。

## 📋 アーキテクチャ

### フロントエンド（Next.js）
- **Vercel**にデプロイ
- Next.jsアプリケーションとして直接デプロイ

### バックエンド（Spring Boot）
- **Railway**、**Render**、**Fly.io**などのDockerコンテナをサポートするプラットフォームにデプロイ
- または、**Vercel Serverless Functions**として書き直す（大規模な変更が必要）

## ✅ 推奨アプローチ

### アプローチ1: フロントエンドをVercel、バックエンドをRailway（推奨）

既にRailwayにデプロイしているため、このアプローチが最も簡単です。

1. **フロントエンド**: Vercelにデプロイ
2. **バックエンド**: Railwayにデプロイ（既にデプロイ済み）
3. **環境変数**: VercelでバックエンドのURLを設定

### アプローチ2: すべてをVercel Serverless Functionsに移行

大規模な変更が必要ですが、すべてをVercelで管理できます。

## 📦 フロントエンドのVercelデプロイ

### ステップ1: Vercelアカウントの作成

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. アカウントを作成

### ステップ2: プロジェクトのインポート

1. **Add New...** → **Project**をクリック
2. GitHubリポジトリを選択
3. **Root Directory**を`frontend`に設定
4. **Framework Preset**を`Next.js`に設定
5. **Build Command**: `npm run build`（自動検出）
6. **Output Directory**: `.next`（自動検出）

### ステップ3: 環境変数の設定

**Environment Variables**セクションで以下を設定：

```
NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-domain].railway.app
NODE_ENV=production
```

**重要**: `NEXT_PUBLIC_API_BASE_URL`は、RailwayにデプロイしたAPI GatewayのURLに置き換えてください。

### ステップ4: デプロイ

1. **Deploy**ボタンをクリック
2. ビルドログを確認
3. デプロイが成功することを確認

## 🔧 Vercel設定ファイル

### vercel.jsonの作成

`frontend/vercel.json`を作成：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 🌐 完全公開モードの設定

### ステップ1: カスタムドメインの設定（オプション）

1. Vercelダッシュボードで**Settings** → **Domains**
2. カスタムドメインを追加
3. DNS設定を更新

### ステップ2: 環境変数の確認

1. **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_API_BASE_URL`が正しく設定されているか確認
3. 本番環境（Production）で有効になっているか確認

### ステップ3: CORS設定の確認

RailwayのAPI Gatewayで、Vercelのドメインを許可：

```
ALLOWED_ORIGINS=https://[your-vercel-domain].vercel.app,https://[your-custom-domain].com
```

## 🔄 バックエンドとの連携

### API Gatewayの環境変数を更新

RailwayのAPI Gatewayで、VercelのフロントエンドURLを許可：

```
ALLOWED_ORIGINS=https://[your-vercel-domain].vercel.app,https://[your-custom-domain].com
```

### フロントエンドの環境変数を設定

Vercelで：

```
NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-domain].railway.app
```

## 📝 デプロイ手順

### ステップ1: コードの準備

```bash
cd C:\devlop\cms
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### ステップ2: Vercelでプロジェクトを作成

1. Vercelダッシュボードにアクセス
2. **Add New...** → **Project**
3. GitHubリポジトリを選択
4. **Root Directory**: `frontend`
5. **Framework Preset**: `Next.js`
6. 環境変数を設定
7. **Deploy**をクリック

### ステップ3: デプロイの確認

1. ビルドログを確認
2. デプロイが成功することを確認
3. 生成されたURLにアクセス
4. アプリケーションが正常に動作することを確認

## 🆘 トラブルシューティング

### ビルドエラーが発生する場合

1. **ビルドログを確認**
   - エラーメッセージを確認
   - 依存関係の問題がないか確認

2. **Node.jsバージョンを確認**
   - Vercelの設定でNode.jsバージョンを指定
   - `package.json`で`engines`を指定

3. **環境変数を確認**
   - すべての必須環境変数が設定されているか確認

### API接続エラーが発生する場合

1. **CORS設定を確認**
   - RailwayのAPI GatewayでVercelのドメインが許可されているか確認

2. **環境変数を確認**
   - `NEXT_PUBLIC_API_BASE_URL`が正しく設定されているか確認
   - 本番環境で有効になっているか確認

3. **ネットワークを確認**
   - RailwayのAPI Gatewayが起動しているか確認
   - エンドポイントにアクセスできるか確認

## 📋 確認チェックリスト

### Vercel設定
- [ ] Vercelアカウントを作成した
- [ ] プロジェクトをインポートした
- [ ] Root Directoryを`frontend`に設定した
- [ ] Framework Presetを`Next.js`に設定した
- [ ] 環境変数を設定した
- [ ] デプロイが成功した

### バックエンド連携
- [ ] RailwayのAPI Gatewayが起動している
- [ ] CORS設定でVercelのドメインが許可されている
- [ ] フロントエンドからAPI Gatewayにアクセスできる

### 完全公開モード
- [ ] カスタムドメインを設定した（オプション）
- [ ] 環境変数が正しく設定されている
- [ ] アプリケーションが正常に動作する

## 🎯 まとめ

1. **フロントエンドをVercelにデプロイ** - Next.jsアプリケーションとして直接デプロイ
2. **バックエンドはRailwayにデプロイ** - 既にデプロイ済み
3. **環境変数を設定** - フロントエンドとバックエンドを連携
4. **CORS設定を確認** - バックエンドでVercelのドメインを許可

VercelはDockerコンテナを直接サポートしていませんが、Next.jsアプリケーションは直接デプロイでき、Railwayのバックエンドと連携して完全公開モードで動作します。

