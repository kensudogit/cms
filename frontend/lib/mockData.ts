import { Content, User } from './types';

// ユーザー情報のモックデータ
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    name: '管理者',
    role: 'ADMIN',
  },
  {
    id: 2,
    email: 'editor@example.com',
    name: '編集者',
    role: 'EDITOR',
  },
  {
    id: 3,
    email: 'author@example.com',
    name: '執筆者',
    role: 'AUTHOR',
  },
];

// コンテンツ情報のモックデータ
export const mockContents: Content[] = [
  {
    id: 1,
    title: 'サンプル記事1: Next.js入門ガイド',
    slug: 'nextjs-introduction',
    body: 'Next.jsは、Reactベースのフレームワークで、サーバーサイドレンダリングや静的サイト生成を簡単に実装できます。この記事では、Next.jsの基本的な使い方から、高度な機能まで解説します。\n\n## 主な特徴\n\n- サーバーサイドレンダリング（SSR）\n- 静的サイト生成（SSG）\n- 自動コード分割\n- 画像最適化\n- APIルート\n\nこれらの機能により、パフォーマンスの高いWebアプリケーションを効率的に開発できます。',
    status: 'PUBLISHED',
    authorId: 1,
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T14:30:00Z').toISOString(),
    publishedAt: new Date('2024-01-20T14:30:00Z').toISOString(),
  },
  {
    id: 2,
    title: 'サンプル記事2: TypeScriptで型安全な開発',
    slug: 'typescript-type-safety',
    body: 'TypeScriptを使用することで、JavaScriptの開発において型安全性を確保できます。この記事では、TypeScriptの基本的な型定義から、高度な型操作まで解説します。\n\n## 型の重要性\n\n型システムにより、開発時点でエラーを検出できるため、バグの早期発見が可能になります。また、IDEの補完機能も強化され、開発効率が向上します。',
    status: 'PUBLISHED',
    authorId: 1,
    createdAt: new Date('2024-01-18T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-22T16:45:00Z').toISOString(),
    publishedAt: new Date('2024-01-22T16:45:00Z').toISOString(),
  },
  {
    id: 3,
    title: 'サンプル記事3: ダッシュボードの作成方法',
    slug: 'dashboard-creation',
    body: 'モダンなWebアプリケーションでは、ダッシュボードが重要な役割を果たします。この記事では、ReactとNext.jsを使用したダッシュボードの作成方法を解説します。\n\n## ダッシュボードの構成要素\n\n- データ可視化\n- 統計情報の表示\n- ナビゲーション\n- ユーザーインターフェース\n\nこれらを組み合わせることで、使いやすいダッシュボードを構築できます。',
    status: 'DRAFT',
    authorId: 1,
    createdAt: new Date('2024-01-20T11:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-23T10:20:00Z').toISOString(),
    publishedAt: null,
  },
  {
    id: 4,
    title: 'サンプル記事4: API設計のベストプラクティス',
    slug: 'api-design-best-practices',
    body: 'RESTful APIの設計において、適切なエンドポイント設計やエラーハンドリングは重要です。この記事では、API設計のベストプラクティスを解説します。\n\n## 設計原則\n\n1. リソース指向の設計\n2. HTTPメソッドの適切な使用\n3. ステータスコードの適切な返却\n4. エラーハンドリングの統一\n5. バージョニングの戦略\n\nこれらの原則に従うことで、保守性の高いAPIを設計できます。',
    status: 'PUBLISHED',
    authorId: 1,
    createdAt: new Date('2024-01-22T08:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-24T15:10:00Z').toISOString(),
    publishedAt: new Date('2024-01-24T15:10:00Z').toISOString(),
  },
  {
    id: 5,
    title: 'サンプル記事5: データベース設計の基礎',
    slug: 'database-design-basics',
    body: '効率的なデータベース設計は、アプリケーションのパフォーマンスに大きく影響します。この記事では、データベース設計の基礎を解説します。\n\n## 正規化の重要性\n\nデータの重複を排除し、整合性を保つために正規化は重要です。適切な正規化により、データの一貫性とパフォーマンスのバランスを取ることができます。',
    status: 'DRAFT',
    authorId: 1,
    createdAt: new Date('2024-01-24T13:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-25T09:30:00Z').toISOString(),
    publishedAt: null,
  },
  {
    id: 6,
    title: 'サンプル記事6: セキュリティ対策の重要性',
    slug: 'security-importance',
    body: 'Webアプリケーションのセキュリティは、ユーザーの信頼を得るために不可欠です。この記事では、基本的なセキュリティ対策について解説します。\n\n## 主要なセキュリティ対策\n\n- 認証と認可の実装\n- 入力値の検証\n- SQLインジェクション対策\n- XSS対策\n- CSRF対策\n\nこれらの対策を適切に実装することで、セキュアなアプリケーションを構築できます。',
    status: 'PUBLISHED',
    authorId: 1,
    createdAt: new Date('2024-01-25T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-26T11:45:00Z').toISOString(),
    publishedAt: new Date('2024-01-26T11:45:00Z').toISOString(),
  },
  {
    id: 7,
    title: 'サンプル記事7: React Hooksの活用方法',
    slug: 'react-hooks-usage',
    body: 'React Hooksは、関数コンポーネントで状態管理やライフサイクルを扱うための強力な機能です。この記事では、主要なHooksの使い方を解説します。\n\n## 主要なHooks\n\n- useState: 状態管理\n- useEffect: 副作用の処理\n- useContext: コンテキストの利用\n- useReducer: 複雑な状態管理\n- useMemo: メモ化\n- useCallback: コールバックのメモ化\n\nこれらのHooksを適切に使用することで、効率的なReactアプリケーションを開発できます。',
    status: 'PUBLISHED',
    authorId: 2,
    createdAt: new Date('2024-01-27T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-28T15:20:00Z').toISOString(),
    publishedAt: new Date('2024-01-28T15:20:00Z').toISOString(),
  },
  {
    id: 8,
    title: 'サンプル記事8: Tailwind CSSによるスタイリング',
    slug: 'tailwind-css-styling',
    body: 'Tailwind CSSは、ユーティリティファーストのCSSフレームワークで、迅速なUI開発を可能にします。この記事では、Tailwind CSSの基本的な使い方から、高度なテクニックまで解説します。\n\n## Tailwind CSSの利点\n\n- 迅速な開発\n- 一貫性のあるデザイン\n- カスタマイズの容易さ\n- パフォーマンスの最適化\n\nこれらの利点により、モダンなUIを効率的に構築できます。',
    status: 'PUBLISHED',
    authorId: 2,
    createdAt: new Date('2024-01-29T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-30T11:30:00Z').toISOString(),
    publishedAt: new Date('2024-01-30T11:30:00Z').toISOString(),
  },
  {
    id: 9,
    title: 'サンプル記事9: テスト駆動開発（TDD）の実践',
    slug: 'test-driven-development',
    body: 'テスト駆動開発（TDD）は、テストを先に書くことで、品質の高いコードを書くための開発手法です。この記事では、TDDの実践方法を解説します。\n\n## TDDのサイクル\n\n1. レッド: 失敗するテストを書く\n2. グリーン: テストを通す最小限のコードを書く\n3. リファクタリング: コードを改善する\n\nこのサイクルを繰り返すことで、品質の高いコードを継続的に開発できます。',
    status: 'DRAFT',
    authorId: 3,
    createdAt: new Date('2024-01-31T08:00:00Z').toISOString(),
    updatedAt: new Date('2024-02-01T14:15:00Z').toISOString(),
    publishedAt: null,
  },
  {
    id: 10,
    title: 'サンプル記事10: デプロイメント戦略',
    slug: 'deployment-strategies',
    body: 'アプリケーションを本番環境にデプロイする際には、適切な戦略が必要です。この記事では、様々なデプロイメント戦略とその使い分けを解説します。\n\n## デプロイメント戦略\n\n- ブルーグリーンデプロイメント\n- カナリアリリース\n- ローリングデプロイメント\n- シャドウデプロイメント\n\nこれらの戦略を適切に選択することで、リスクを最小限に抑えながらデプロイできます。',
    status: 'PUBLISHED',
    authorId: 1,
    createdAt: new Date('2024-02-02T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-02-03T16:45:00Z').toISOString(),
    publishedAt: new Date('2024-02-03T16:45:00Z').toISOString(),
  },
];

// モックデータを取得する関数
export const getMockContents = (): Content[] => {
  return mockContents;
};

// IDでコンテンツを取得（文字列IDにも対応）
export const getMockContentById = (id: number | string): Content | undefined => {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) {
    return undefined;
  }
  return mockContents.find((content) => content.id === numericId);
};

// ユーザー情報を取得
export const getMockUserById = (id: number): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};

// すべてのユーザーを取得
export const getMockUsers = (): User[] => {
  return mockUsers;
};

