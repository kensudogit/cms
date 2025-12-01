import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
});

// グローバルなexpect拡張
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<T> {}
  }
}



