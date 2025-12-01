import { Content } from './types';

// コンテンツ情報のモックデータ
export const mockContents: Content[] = [
  {
    id: 1,
    title: 'サンプル記事1: Next.js入門ガイド',
    slug: 'nextjs-introduction',
    body: 'Next.jsは、Reactベースのフレームワークで、サーバーサイドレンダリングや静的サイト生成を簡単に実装できます。この記事では、Next.jsの基本的な使い方から、高度な機能まで解説します。',
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
    body: 'TypeScriptを使用することで、JavaScriptの開発において型安全性を確保できます。この記事では、TypeScriptの基本的な型定義から、高度な型操作まで解説します。',
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
    body: 'モダンなWebアプリケーションでは、ダッシュボードが重要な役割を果たします。この記事では、ReactとNext.jsを使用したダッシュボードの作成方法を解説します。',
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
    body: 'RESTful APIの設計において、適切なエンドポイント設計やエラーハンドリングは重要です。この記事では、API設計のベストプラクティスを解説します。',
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
    body: '効率的なデータベース設計は、アプリケーションのパフォーマンスに大きく影響します。この記事では、データベース設計の基礎を解説します。',
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
    body: 'Webアプリケーションのセキュリティは、ユーザーの信頼を得るために不可欠です。この記事では、基本的なセキュリティ対策について解説します。',
    status: 'PUBLISHED',
    authorId: 1,
    createdAt: new Date('2024-01-25T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-26T11:45:00Z').toISOString(),
    publishedAt: new Date('2024-01-26T11:45:00Z').toISOString(),
  },
];

// モックデータを取得する関数
export const getMockContents = (): Content[] => {
  return mockContents;
};

// IDでコンテンツを取得
export const getMockContentById = (id: number): Content | undefined => {
  return mockContents.find((content) => content.id === id);
};

