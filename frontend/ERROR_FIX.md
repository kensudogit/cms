# エラー対応ガイド

## 報告されたエラー

1. `Uncaught SyntaxError: Invalid or unexpected token`
2. `Failed to load resource: the server responded with a status of 404 (Not Found)` - favicon.ico
3. `Uncaught (in promise) Error: A listener indicated an asynchronous response` - ブラウザ拡張機能のエラー（無視してOK）

## 対応方法

### 1. 構文エラーの対処

#### ブラウザのキャッシュをクリア

1. ブラウザの開発者ツールを開く（F12）
2. ネットワークタブで「キャッシュを無効にする」にチェック
3. ページをハードリロード（Ctrl+Shift+R または Ctrl+F5）

#### Next.jsのビルドキャッシュをクリア

```bash
cd C:\devlop\cms\frontend
rm -rf .next
npm run dev
```

Windowsの場合：
```bash
cd C:\devlop\cms\frontend
rmdir /s /q .next
npm run dev
```

### 2. favicon.icoの404エラー

favicon.icoは`public`ディレクトリに配置するか、`app`ディレクトリに`icon.ico`として配置します。

現在、`layout.tsx`でfaviconの設定を追加しました。

### 3. ブラウザ拡張機能のエラー

このエラーはブラウザ拡張機能（例：広告ブロッカー、パスワードマネージャーなど）が原因です。無視して問題ありません。

## 確認事項

### コードの構文チェック

```bash
cd C:\devlop\cms\frontend
npm run type-check
```

### ビルドエラーの確認

```bash
cd C:\devlop\cms\frontend
npm run build
```

## トラブルシューティング

### まだ構文エラーが発生する場合

1. ブラウザのコンソールでエラーの詳細を確認
2. エラーが発生しているファイル名と行番号を確認
3. 該当ファイルの構文を確認

### よくある原因

- 引用符の不一致（`'`と`"`）
- 閉じ括弧の不足
- インポート文のエラー
- 特殊文字のエンコーディング問題



