# AWS Lambda + Java ベストプラクティス

## 概要

このドキュメントでは、CMSプロジェクトでJava Lambdaを使用する際のベストプラクティスを説明します。

## 1. Lambda SnapStartの活用

### 設定方法

```yaml
# template.yaml
Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      SnapStart:
        ApplyOn: PublishedVersions
```

### 効果

- コールドスタート時間を最大10倍短縮
- Java 11, 17, 21で利用可能
- 初回実行後のスナップショットを保存

### 注意点

- 初回デプロイ時に最適化が実行される（数分かかる場合も）
- 環境変数の変更時は再最適化が必要

## 2. メモリとタイムアウトの最適化

### 推奨設定

```yaml
# 軽量なAPI
MemorySize: 512
Timeout: 30

# ファイル処理など重い処理
MemorySize: 1024-2048
Timeout: 60-300
```

### メモリとCPUの関係

- メモリが多い = CPUも多く割り当てられる
- 適切なメモリサイズでコストとパフォーマンスのバランスを取る

## 3. パッケージサイズの最適化

### 問題

- Lambdaのデプロイパッケージサイズ制限: 50MB（ZIP）、250MB（解凍後）
- Spring Bootアプリは大きくなりがち

### 対策

1. **不要な依存関係の削除**
   ```gradle
   // build.gradle
   configurations {
       all {
           exclude group: 'org.springframework.boot', module: 'spring-boot-starter-logging'
       }
   }
   ```

2. **Lambda Layerの活用**
   - 共通ライブラリをLayerに分離
   - 複数の関数で共有

3. **軽量フレームワークの検討**
   - Micronaut: コンパイル時DI、軽量
   - Quarkus: ネイティブイメージ対応

## 4. コールドスタート対策

### プロビジョンドコンテナ

```yaml
Resources:
  MyFunction:
    Properties:
      ProvisionedConcurrencyConfig:
        ProvisionedConcurrentExecutions: 2
```

- 常時ウォームな状態を維持
- コストが高くなる（24時間実行と同等）

### 初期化の最適化

```java
// アプリケーションコンテキストを再利用
public class LambdaHandler implements RequestHandler<...> {
    private static final ApplicationContext context = 
        new SpringApplicationBuilder(Application.class)
            .web(WebApplicationType.NONE)
            .run();
    
    @Override
    public APIGatewayProxyResponseEvent handleRequest(...) {
        // 処理
    }
}
```

## 5. データベース接続の最適化

### コネクションプール

```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 2  # Lambdaでは小さいプールで十分
      minimum-idle: 1
      connection-timeout: 3000
```

### RDS Proxyの活用

- コネクションプーリングの管理をAWSに委譲
- コールドスタート時の接続確立を高速化

## 6. ロギングとモニタリング

### CloudWatch Logs

```java
import com.amazonaws.services.lambda.runtime.LambdaLogger;

public class LambdaHandler implements RequestHandler<...> {
    public APIGatewayProxyResponseEvent handleRequest(
        APIGatewayProxyRequestEvent request,
        Context context
    ) {
        LambdaLogger logger = context.getLogger();
        logger.log("Processing request: " + request.getPath());
        // 処理
    }
}
```

### X-Rayの有効化

```yaml
Resources:
  MyFunction:
    Properties:
      Tracing: Active
```

## 7. エラーハンドリング

### リトライ戦略

```java
@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
public void processData() {
    // 処理
}
```

### Dead Letter Queue (DLQ)

```yaml
Resources:
  MyFunction:
    Properties:
      DeadLetterQueue:
        Type: SQS
        TargetArn: !GetAtt DLQ.Arn
```

## 8. セキュリティ

### IAMロール

```yaml
Resources:
  MyFunction:
    Properties:
      Role: !GetAtt LambdaExecutionRole.Arn
      Policies:
        - S3ReadPolicy:
            BucketName: !Ref S3Bucket
        - SecretsManagerReadWrite:
            SecretArn: !Ref SecretArn
```

### VPC設定

```yaml
Resources:
  MyFunction:
    Properties:
      VpcConfig:
        SecurityGroupIds:
          - !Ref SecurityGroup
        SubnetIds:
          - !Ref Subnet1
          - !Ref Subnet2
```

**注意**: VPC内のLambdaはコールドスタートがさらに長くなる

## 9. 環境変数とシークレット管理

### Secrets Manager

```yaml
Resources:
  MyFunction:
    Properties:
      Environment:
        Variables:
          SECRET_ARN: !Ref SecretArn
```

```java
// Javaコード
SecretsManagerClient client = SecretsManagerClient.builder()
    .region(Region.AP_NORTHEAST_1)
    .build();
String secret = client.getSecretValue(...);
```

## 10. テスト戦略

### ローカルテスト

```bash
# SAM CLI
sam local invoke MyFunction --event event.json

# Docker
docker run -p 9000:8080 my-lambda:latest
```

### 統合テスト

- Lambda Layersでテスト用のモックを分離
- ローカル環境でSpring Bootアプリとして実行

## CMSプロジェクトでの推奨構成

### サービス別の最適化

1. **Auth Service** (Lambda)
   - 軽量、高頻度
   - SnapStart有効
   - メモリ: 512MB

2. **Content Service** (Lambda / Fargate)
   - 中程度の処理
   - SnapStart有効
   - メモリ: 1024MB

3. **Media Service** (Fargate推奨)
   - ファイル処理、長時間実行
   - Lambdaの15分制限を超える可能性

4. **User Service** (Lambda)
   - 軽量、高頻度
   - SnapStart有効
   - メモリ: 512MB

## まとめ

Java Lambdaは実用的で一般的ですが、以下の最適化が重要：

1. ✅ Lambda SnapStartでコールドスタート短縮
2. ✅ 適切なメモリサイズの設定
3. ✅ パッケージサイズの最適化
4. ✅ データベース接続の最適化
5. ✅ モニタリングとロギングの設定
6. ✅ セキュリティベストプラクティスの適用

