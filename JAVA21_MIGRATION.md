# Java 21 LTS 移行ガイド

## 概要

CMSプロジェクトをJava 17からJava 21 LTSに移行しました。

## 変更内容

### 1. Gradle設定の更新

すべてのサービスの`build.gradle`でJava 21を指定：

```gradle
java {
    sourceCompatibility = '21'
    targetCompatibility = '21'
}
```

### 2. Dockerfileの更新

すべてのサービスのDockerfileでJava 21のベースイメージを使用：

```dockerfile
FROM eclipse-temurin:21-jdk-alpine
```

### 3. AWS Lambda設定の更新

`aws/lambda/template.yaml`でJava 21ランタイムを指定：

```yaml
Runtime: java21
```

## Java 21の新機能

### 1. Virtual Threads（仮想スレッド）

Java 21では、Project Loomの仮想スレッドが正式に導入されました。高スループットの並行処理が可能になります。

**使用例:**
```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(() -> {
        // 非同期処理
    });
}
```

### 2. Pattern Matching for switch

より強力なパターンマッチングが利用可能：

```java
String result = switch (status) {
    case DRAFT -> "下書き";
    case PUBLISHED -> "公開済み";
    case ARCHIVED -> "アーカイブ";
    default -> "不明";
};
```

### 3. Record Patterns

レコードの分解がより柔軟に：

```java
if (content instanceof Content(Long id, String title, String body)) {
    // id, title, bodyを直接使用
}
```

### 4. Sequenced Collections

順序付きコレクションの新しいインターフェース：

```java
SequencedSet<String> set = new LinkedHashSet<>();
set.addFirst("first");
set.addLast("last");
```

## 移行チェックリスト

- [x] すべての`build.gradle`でJava 21を指定
- [x] すべての`Dockerfile`でJava 21ベースイメージを使用
- [x] AWS Lambda設定でJava 21ランタイムを指定
- [x] Railway設定でJava 21を指定（Nixpacksが自動検出）
- [ ] ローカル開発環境でJava 21をインストール
- [ ] CI/CDパイプラインでJava 21を使用
- [ ] 本番環境でJava 21を確認

## ローカル開発環境のセットアップ

### Java 21のインストール

#### Windows

1. [Eclipse Temurin 21](https://adoptium.net/temurin/releases/?version=21)からダウンロード
2. インストール
3. 環境変数`JAVA_HOME`を設定

#### macOS

```bash
brew install openjdk@21
```

#### Linux

```bash
sudo apt-get install openjdk-21-jdk
```

### バージョン確認

```bash
java -version
# 出力例: openjdk version "21.0.1" 2023-10-17
```

## ビルドと実行

### ビルド

```bash
cd services/auth-service
./gradlew clean build
```

### 実行

```bash
./gradlew bootRun
```

## 互換性

### Spring Boot 3.2.0

Spring Boot 3.2.0はJava 21を完全にサポートしています。

### 依存関係

以下の依存関係がJava 21と互換性があります：

- Spring Boot 3.2.0+
- PostgreSQL JDBC Driver
- JWT Libraries
- AWS SDK

## パフォーマンス向上

Java 21では以下のパフォーマンス改善が期待できます：

1. **G1GCの改善**: より効率的なガベージコレクション
2. **ZGCの改善**: 低レイテンシのガベージコレクション
3. **Virtual Threads**: 高スループットの並行処理
4. **Vector API**: SIMD命令の活用

## トラブルシューティング

### ビルドエラー

**エラー:** `Unsupported class file major version 65`

**解決:** Java 21がインストールされているか確認：

```bash
java -version
javac -version
```

### 実行時エラー

**エラー:** `UnsupportedClassVersionError`

**解決:** すべての依存関係がJava 21でビルドされているか確認

### IDE設定

IntelliJ IDEAやEclipseでJava 21をプロジェクトSDKとして設定してください。

## 参考リンク

- [Java 21 Release Notes](https://openjdk.org/projects/jdk/21/)
- [Spring Boot 3.2 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.2-Release-Notes)
- [Eclipse Temurin 21](https://adoptium.net/temurin/releases/?version=21)

