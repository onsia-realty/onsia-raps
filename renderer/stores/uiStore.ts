import { create } from 'zustand';

interface UIState {
  // 사이드바 상태
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // 로딩 상태
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // 알림
  notification: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null;
  showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  hideNotification: () => void;

  // 현재 활성 메뉴
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  notification: null,
  showNotification: (type, message) => {
    set({ notification: { type, message } });
    // 3초 후 자동 숨김
    setTimeout(() => {
      set({ notification: null });
    }, 3000);
  },
  hideNotification: () => set({ notification: null }),

  activeMenu: 'home',
  setActiveMenu: (menu) => set({ activeMenu: menu }),
}));
