import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminSidebar } from '../AdminSidebar';

// useAuthStoreをモック
const mockUseAuthStore = vi.fn();
vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector: any) => mockUseAuthStore(selector),
}));

// usePathnameをモック
const mockUsePathname = vi.fn(() => '/dashboard/admin');
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

describe('AdminSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Visibility', () => {
    it('should not render for non-admin users', () => {
      mockUseAuthStore.mockReturnValue({
        user: { role: 'STUDENT' },
      });

      const { container } = render(<AdminSidebar />);
      expect(container.firstChild).toBeNull();
    });

    it('should render for ADMIN users', () => {
      mockUseAuthStore.mockReturnValue({
        user: { role: 'ADMIN' },
      });

      render(<AdminSidebar />);
      expect(screen.getByText('管理メニュー')).toBeInTheDocument();
    });

    it('should render for STAFF users', () => {
      mockUseAuthStore.mockReturnValue({
        user: { role: 'STAFF' },
      });

      render(<AdminSidebar />);
      expect(screen.getByText('管理メニュー')).toBeInTheDocument();
    });
  });

  describe('Menu Items', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        user: { role: 'ADMIN' },
      });
    });

    it('should display all menu items for ADMIN', () => {
      render(<AdminSidebar />);

      expect(screen.getByText('管理者ダッシュボード')).toBeInTheDocument();
      expect(screen.getByText('大学管理')).toBeInTheDocument();
      expect(screen.getByText('コンテンツ管理')).toBeInTheDocument();
      expect(screen.getByText('手続きフロー管理')).toBeInTheDocument();
      expect(screen.getByText('支払い管理')).toBeInTheDocument();
      expect(screen.getByText('セミナー・シンポジウム')).toBeInTheDocument();
      expect(screen.getByText('ユーザー管理')).toBeInTheDocument();
    });

    it('should hide admin-only items for STAFF', () => {
      mockUseAuthStore.mockReturnValue({
        user: { role: 'STAFF' },
      });

      render(<AdminSidebar />);

      expect(screen.queryByText('ユーザー管理')).not.toBeInTheDocument();
      expect(screen.getByText('大学管理')).toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        user: { role: 'ADMIN' },
      });
    });

    it('should highlight active menu item', () => {
      mockUsePathname.mockReturnValue('/dashboard/admin');

      render(<AdminSidebar />);

      const activeLink = screen.getByText('管理者ダッシュボード').closest('a');
      expect(activeLink).toHaveClass('bg-gradient-to-r');
    });
  });
});

