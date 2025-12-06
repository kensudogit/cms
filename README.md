# Webシステムリプレース（CMS設計）

ユーザー企画向けWebシステムのリプレース案件におけるCMS機能の開発プロジェクト

## プロジェクト概要

- **案件名**: Webシステムリプレース（CMS設計）
- **目的**: 既存Web画面に準拠する30パターンのWeb画面セットの開発
- **技術スタック**:
  - フロントエンド: React + Next.js + TypeScript
  - バックエンド: Java (Spring Boot) - マイクロサービスアーキテクチャ
  - データベース: PostgreSQL
  - API: REST API
  - インフラ: AWS (Lambda、Fargate、API Gateway)

## アーキテクチャ

### マイクロサービスアーキテクチャ採用のメリット

AWS Lambda環境でのマイクロサービスアーキテクチャ採用により、以下のメリットを享受できます：

1. **自動スケーリング**: Lambdaの自動スケーリング機能により、各サービスを独立してスケール可能
2. **コスト効率**: 使用した分だけ課金されるため、小規模なサービスでもコストが抑えられる
3. **独立デプロイ**: 各マイクロサービスを独立してデプロイ・更新できるため、開発速度が向上
4. **障害分離**: 一つのサービスの障害が他に影響しにくい
5. **技術選択の柔軟性**: 各サービスで異なるランタイムや技術を選択可能

## プロジェクト構造

```
cms/
├── frontend/                    # Next.js + TypeScript フロントエンド
├── services/                    # マイクロサービス群
│   ├── api-gateway/            # API Gateway サービス（統合エンドポイント）
│   ├── auth-service/           # 認証・認可サービス
│   ├── content-service/        # コンテンツ管理サービス
│   ├── media-service/          # メディアファイル管理サービス
│   └── user-service/           # ユーザー管理サービス
├── aws/                        # AWS設定
│   ├── lambda/                 # Lambda関数設定
│   ├── fargate/                # Fargate設定
│   ├── api-gateway/            # API Gateway設定
│   └── terraform/              # Infrastructure as Code
├── shared/                     # 共通ライブラリ
│   ├── common/                 # 共通DTO、エンティティ
│   └── security/               # セキュリティ共通機能
├── docs/                       # ドキュメント
│   ├── api/                    # API仕様書
│   └── design/                 # 設計ドキュメント
└── patterns/                   # 30パターンのWeb画面セット
```

## マイクロサービス一覧

### 1. API Gateway Service
- **役割**: 全APIリクエストの統合エンドポイント
- **機能**: ルーティング、認証、レート制限、ログ集約
- **デプロイ**: API Gateway + Lambda

### 2. Auth Service
- **役割**: 認証・認可処理
- **機能**: JWT発行、リフレッシュトークン、パスワード管理
- **デプロイ**: Lambda
- **データベース**: PostgreSQL (auth_db)

### 3. Content Service
- **役割**: コンテンツ管理
- **機能**: CRUD操作、バージョン管理、公開管理
- **デプロイ**: Lambda / Fargate
- **データベース**: PostgreSQL (content_db)

### 4. Media Service
- **役割**: メディアファイル管理
- **機能**: ファイルアップロード、画像処理、S3連携
- **デプロイ**: Lambda / Fargate
- **ストレージ**: S3

### 5. User Service
- **役割**: ユーザー管理
- **機能**: ユーザーCRUD、プロフィール管理、権限管理
- **デプロイ**: Lambda
- **データベース**: PostgreSQL (user_db)

## 開発環境セットアップ

### 前提条件

- Node.js 18以上
- Java 21以上（LTS）
- PostgreSQL 14以上
- Docker (オプション)
- AWS CLI
- SAM CLI (Lambda開発用)

### フロントエンドセットアップ

```bash
cd frontend
npm install
npm run dev
```

### バックエンドセットアップ

各サービスを個別に起動：

```bash
# Auth Service
cd services/auth-service
./gradlew build
./gradlew bootRun

# Content Service
cd services/content-service
./gradlew build
./gradlew bootRun

# Media Service
cd services/media-service
./gradlew build
./gradlew bootRun

# User Service
cd services/user-service
./gradlew build
./gradlew bootRun
```

### データベースセットアップ

各サービス用のPostgreSQLデータベースをセットアップ：

```bash
# 各サービスのapplication.ymlでデータベース接続情報を設定
```

### ローカル開発環境（Docker Compose）

```bash
docker-compose up -d
```

## AWSデプロイ

### Lambda関数のデプロイ

```bash
# SAM CLIを使用
cd aws/lambda
sam build
sam deploy --guided
```

### Fargateのデプロイ

```bash
cd aws/fargate
./deploy.sh
```

詳細は `aws/README.md` を参照してください。

## 🚀 完全公開モードデプロイ

### アーキテクチャ

- **フロントエンド**: Vercel（Next.js）
- **バックエンド**: Railway（Spring Boot マイクロサービス）

### クイックスタート

**5分でデプロイ**: `DEPLOY_QUICK_START.md` を参照

### 詳細手順

1. **完全なデプロイ手順**: `DEPLOYMENT_GUIDE.md` を参照
2. **デプロイチェックリスト**: `DEPLOYMENT_CHECKLIST.md` を参照

### デプロイ手順概要

#### Railway（バックエンド）

1. PostgreSQLデータベースを作成（各サービス用）
2. 各マイクロサービスをデプロイ:
   - Content Service
   - Auth Service
   - User Service
   - Media Service
   - API Gateway（重要）
3. 各サービスのパブリックドメインを生成
4. API GatewayのURLをメモ（フロントエンドで使用）

#### Vercel（フロントエンド）

1. Vercelでプロジェクトを作成
2. Root Directory: `frontend`
3. 環境変数を設定:
   - `NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-url].railway.app`
4. デプロイ

#### CORS設定

RailwayのAPI Gatewayで:
- `ALLOWED_ORIGINS=*`（完全公開モード）
- または `ALLOWED_ORIGINS=https://[vercel-url].vercel.app`（特定ドメイン）

詳細は `DEPLOYMENT_GUIDE.md` を参照してください。

## 30パターンのWeb画面セット

各パターンは `patterns/` ディレクトリに配置されています。

## ドキュメント

- API仕様書: `docs/api/`
- 設計ドキュメント: `docs/design/`
- アーキテクチャ設計: `docs/design/architecture.md`
"# cms" 
