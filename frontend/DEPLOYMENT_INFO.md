# デプロイ情報

## メインURL（完全公開モード）⭐

**https://frontend-kensudogits-projects.vercel.app**

このURLは常に最新の正常なデプロイを指します。

## その他のアクセスURL

- https://frontend-kensudogit-kensudogits-projects.vercel.app
- https://frontend-lyart-five-20.vercel.app

## 最新のデプロイ

- **デプロイURL**: https://frontend-67k5q8q9b-kensudogits-projects.vercel.app
- **インスペクトURL**: https://vercel.com/kensudogits-projects/frontend/FHgaUQxiRAqh55wuNU2jEfijeiJJ

## 完全公開モードの設定

以下のCORSヘッダーが設定されています：

- `Access-Control-Allow-Origin: *` - すべてのオリジンからのアクセスを許可
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## デプロイコマンド

```bash
cd C:\devlop\cms\frontend
vercel --prod --yes --force
```

## デプロイ状態の確認

```bash
# 最新のデプロイを確認
vercel ls --prod

# 特定のデプロイの詳細を確認
vercel inspect https://frontend-67k5q8q9b-kensudogits-projects.vercel.app

# メインURLが指すデプロイを確認
vercel inspect https://frontend-kensudogits-projects.vercel.app
```

## Vercelダッシュボード

- **プロジェクト**: https://vercel.com/kensudogits-projects/frontend
- **デプロイ履歴**: https://vercel.com/kensudogits-projects/frontend/deployments
- **設定**: https://vercel.com/kensudogits-projects/frontend/settings

## 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

- `NEXT_PUBLIC_API_BASE_URL`: バックエンドAPIのベースURL

設定方法：
1. https://vercel.com/kensudogits-projects/frontend/settings/environment-variables にアクセス
2. 「Add New」をクリック
3. 環境変数を追加（Production、Preview、Developmentすべてに設定）

