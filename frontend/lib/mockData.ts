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

// コンテンツ情報のモックデータ（各大学のコンテンツのみ）
// 注意: 実際のデータはAPIから取得することを推奨します
// このモックデータは、APIが利用できない場合のフォールバックとして使用されます
export const mockContents: Content[] = [];

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

