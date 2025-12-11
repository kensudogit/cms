import { Content, User, University } from './types';

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

// 大学情報のモックデータ
export const mockUniversities: University[] = [
  {
    id: 1,
    code: 'UT',
    name: '東京大学',
    description: '日本の国立大学',
    domain: 'u-tokyo.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    code: 'KU',
    name: '京都大学',
    description: '日本の国立大学',
    domain: 'kyoto-u.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    code: 'OSU',
    name: '大阪大学',
    description: '日本の国立大学',
    domain: 'osaka-u.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    code: 'TIT',
    name: '東京工業大学',
    description: '日本の国立大学',
    domain: 'titech.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    code: 'WU',
    name: '早稲田大学',
    description: '日本の私立大学',
    domain: 'waseda.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    code: 'KUW',
    name: '慶應義塾大学',
    description: '日本の私立大学',
    domain: 'keio.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// すべての大学を取得
export const getMockUniversities = (): University[] => {
  return mockUniversities;
};

