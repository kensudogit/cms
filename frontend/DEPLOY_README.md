# Vercelデプロイ手順

## 完全公開モードでデプロイ

### 1. デプロイコマンド

```bash
cd C:\devlop\cms\frontend
vercel --prod --yes --force
```

### 2. デプロイ状態の確認

```bash
# 最新のデプロイを確認
vercel ls --prod

# メインURLが指すデプロイを確認
vercel inspect https://frontend-kensudogits-projects.vercel.app
```

### 3. メインURL（完全公開モード）

**https://frontend-kensudogits-projects.vercel.app**

このURLは常に最新の正常なデプロイを指します。

### 4. 設定ファイル

#### vercel.json
- CORSヘッダーを設定して完全公開モードを有効化
- `Access-Control-Allow-Origin: *` で全オリジンからのアクセスを許可

#### .vercelignore
- 不要なファイル（テストファイル、設定ファイルなど）をデプロイから除外

### 5. トラブルシューティング

#### ビルドエラーが発生する場合

```bash
# .nextディレクトリを削除
rmdir /s /q .next

# 再ビルド
npm run build

# 再デプロイ
vercel --prod --yes --force
```

#### Resource provisioning failed エラーが発生する場合

1. Vercelダッシュボードで確認: https://vercel.com/kensudogits-projects/frontend/deployments
2. 「Build Logs」タブでエラーの詳細を確認
3. 「2 Recommendations」を確認して推奨事項を適用

### 6. Vercelダッシュボード

- **プロジェクト**: https://vercel.com/kensudogits-projects/frontend
- **デプロイ履歴**: https://vercel.com/kensudogits-projects/frontend/deployments
- **設定**: https://vercel.com/kensudogits-projects/frontend/settings

### 7. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

- `NEXT_PUBLIC_API_BASE_URL`: バックエンドAPIのベースURL

設定方法：
1. https://vercel.com/kensudogits-projects/frontend/settings/environment-variables にアクセス
2. 「Add New」をクリック
3. 環境変数を追加（Production、Preview、Developmentすべてに設定）

