# AWS デプロイメントガイド

## 概要

CMSプロジェクトはAWS LambdaとFargateの両方のデプロイメント方式をサポートしています。

## デプロイメント方式の選択

### Lambda
- **メリット**: サーバーレス、自動スケーリング、使用量ベースの課金
- **適用サービス**: Auth Service, Content Service, Media Service, User Service
- **制約**: 15分のタイムアウト制限、コールドスタート

### Fargate
- **メリット**: 長時間実行、より柔軟な設定、コンテナベース
- **適用サービス**: API Gateway, 長時間実行が必要なサービス
- **制約**: 常時実行のためコストが高い

## Lambda デプロイ

### 前提条件

- AWS CLI がインストール・設定済み
- SAM CLI がインストール済み
- AWS認証情報が設定済み

### デプロイ手順

```bash
cd aws/lambda

# ビルド
sam build

# デプロイ（初回はガイド付き）
sam deploy --guided

# 以降のデプロイ
sam deploy
```

### 環境変数の設定

`samconfig.toml` または環境変数で以下を設定：

- `DatabaseUrl`: PostgreSQL接続URL
- `DatabaseUsername`: データベースユーザー名
- `DatabasePassword`: データベースパスワード
- `JwtSecret`: JWT秘密鍵
- `S3Bucket`: メディアファイル用S3バケット名

## Fargate デプロイ

### 前提条件

- Docker がインストール済み
- AWS ECR へのアクセス権限
- ECS クラスターが作成済み

### デプロイ手順

```bash
cd aws/fargate

# Dockerイメージのビルドとプッシュ
./build-and-push.sh

# ECSタスク定義の更新とデプロイ
./deploy.sh
```

## ローカル開発環境

### Docker Compose を使用

```bash
cd aws/fargate
docker-compose up -d
```

すべてのサービスとPostgreSQLデータベースが起動します。

## モニタリング

- CloudWatch Logs: 各Lambda関数のログ
- CloudWatch Metrics: パフォーマンスメトリクス
- X-Ray: 分散トレーシング（オプション）

## セキュリティ

- IAMロール: 各サービスに最小権限のIAMロールを設定
- VPC: 必要に応じてVPC内にデプロイ
- Secrets Manager: 機密情報はSecrets Managerを使用



