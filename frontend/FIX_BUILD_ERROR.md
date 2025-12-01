# ビルドエラー修正手順

## 問題

`tailwindcss`モジュールが見つからないエラーが発生しています。

## 解決方法

### 手順1: package.jsonの修正

`package.json`の`overrides`セクションを削除しました（既に修正済み）。

### 手順2: 依存関係のインストール

ターミナルで以下のコマンドを実行してください：

```bash
cd C:\devlop\cms\frontend
npm install
```

### 手順3: ビルドの確認

インストールが完了したら、以下でビルドを確認：

```bash
npm run dev
```

## トラブルシューティング

### npm installが失敗する場合

1. `package-lock.json`を削除：
   ```bash
   del package-lock.json
   ```

2. `node_modules`フォルダを削除：
   ```bash
   rmdir /s node_modules
   ```

3. 再度インストール：
   ```bash
   npm install
   ```

### キャッシュの問題がある場合

```bash
npm cache clean --force
npm install
```

### Next.jsのバージョンが古い場合

`package.json`でNext.jsのバージョンを確認し、必要に応じて更新：

```json
"next": "^14.0.0"
```

最新版に更新する場合：

```bash
npm install next@latest
```

## 確認事項

- [ ] `package.json`に`tailwindcss`が含まれている（devDependencies）
- [ ] `postcss.config.js`が存在する
- [ ] `tailwind.config.js`が存在する
- [ ] `app/globals.css`に`@tailwind`ディレクティブが含まれている

