# ChunkLoadErrorとHydrationエラー対応

## 発生しているエラー

1. **ChunkLoadError**: `Loading chunk app/layout failed. (timeout)`
2. **Hydration Error**: サーバーとクライアントのHTMLが一致しない
3. **Next.jsバージョン警告**: Next.js 14.2.33が古い

## 対応方法

### 1. ビルドキャッシュのクリア

```bash
cd C:\devlop\cms\frontend
rmdir /s /q .next
npm run build
```

### 2. 開発サーバーの再起動

```bash
# すべてのNode.jsプロセスを停止
taskkill /F /IM node.exe

# 開発サーバーを再起動
npm run dev
```

### 3. ブラウザのキャッシュをクリア

- Ctrl+Shift+Delete でキャッシュをクリア
- またはシークレットモードでアクセス

## 原因

- `.next`ディレクトリのビルドキャッシュが破損している
- 開発サーバーが古いキャッシュを使用している
- ポート3001で実行されているが、通常は3000

## 予防策

定期的に`.next`ディレクトリをクリアして再ビルドすることで、この問題を防げます。

