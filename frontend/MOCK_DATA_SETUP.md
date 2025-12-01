# モックデータ設定

## 概要

コンテンツ情報のモックデータを作成し、APIが利用できない場合でもダッシュボードを表示できるようにしました。

## 設定方法

### 1. 環境変数の設定

RailwayまたはVercelの環境変数に以下を追加：

```
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### 2. ローカル開発環境

`.env.local`ファイルを作成（または既存のファイルに追加）：

```
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 動作

- `NEXT_PUBLIC_USE_MOCK_DATA=true`の場合：
  - モックデータを直接使用
  - APIリクエストを送信しない

- `NEXT_PUBLIC_USE_MOCK_DATA=false`または未設定の場合：
  - APIからデータを取得を試みる
  - APIエラーの場合は自動的にモックデータにフォールバック

## モックデータの内容

6件のサンプルコンテンツが含まれています：

1. **Next.js入門ガイド** (公開)
2. **TypeScriptで型安全な開発** (公開)
3. **ダッシュボードの作成方法** (下書き)
4. **API設計のベストプラクティス** (公開)
5. **データベース設計の基礎** (下書き)
6. **セキュリティ対策の重要性** (公開)

## ファイル構成

- `lib/mockData.ts`: モックデータの定義
- `app/page.tsx`: モックデータを使用するロジックを追加

## Railwayでの設定

Railwayダッシュボードで環境変数を設定：

1. Railwayダッシュボードにアクセス
2. フロントエンドサービスを選択
3. 「Variables」タブを開く
4. 以下の環境変数を追加：
   - `NEXT_PUBLIC_USE_MOCK_DATA` = `true`
   - `NEXT_PUBLIC_API_BASE_URL` = バックエンドAPIのURL（オプション）

## 確認

環境変数を設定後、Railwayに再デプロイすると、ログイン画面なしでダッシュボードが表示され、モックデータのコンテンツが表示されます。

