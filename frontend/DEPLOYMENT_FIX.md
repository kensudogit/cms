# デプロイエラー修正

## 問題

「Resource provisioning failed」エラーが発生していました。

## 対応内容

1. **vercel.jsonの最適化**
   - 不要な設定を削除
   - Vercelの自動検出に任せるように簡素化
   - CORSヘッダーのみを設定

2. **.vercelignoreの追加**
   - 不要なファイルをデプロイから除外
   - テストファイル、設定ファイルなどを除外

3. **ローカルビルドの確認**
   - `npm run build`が正常に完了することを確認

## 修正後の設定

### vercel.json
```json
{
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### .vercelignore
- node_modules
- .next
- .vercel
- *.log
- .DS_Store
- *.local
- .env*.local
- coverage
- .vscode
- .idea
- *.test.ts
- *.test.tsx
- vitest.config.ts
- vitest.setup.ts
- vitest.d.ts

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
vercel inspect https://frontend-hms0fxrx8-kensudogits-projects.vercel.app

# メインURLが指すデプロイを確認
vercel inspect https://frontend-kensudogits-projects.vercel.app
```

## Vercelダッシュボード

- **プロジェクト**: https://vercel.com/kensudogits-projects/frontend
- **デプロイ履歴**: https://vercel.com/kensudogits-projects/frontend/deployments
- **設定**: https://vercel.com/kensudogits-projects/frontend/settings

