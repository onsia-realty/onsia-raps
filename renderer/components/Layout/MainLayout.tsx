import React from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '../../lib/cn';
import { useUIStore } from '../../stores/uiStore';
import { Loader2, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const { isSidebarOpen, isLoading, notification, hideNotification } = useUIStore();

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          isSidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        {/* 헤더 */}
        {title && (
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          </header>
        )}

        {/* 콘텐츠 영역 */}
        <div className="p-6">{children}</div>
      </main>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-6 shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-sm text-slate-600">데이터를 불러오는 중...</span>
          </div>
        </div>
      )}

      {/* 알림 토스트 */}
      {notification && (
        <div
          className={cn(
            'fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg',
            notification.type === 'success' && 'bg-green-500 text-white',
            notification.type === 'error' && 'bg-red-500 text-white',
            notification.type === 'info' && 'bg-blue-500 text-white',
            notification.type === 'warning' && 'bg-yellow-500 text-white'
          )}
        >
          {notification.type === 'success' && <CheckCircle size={20} />}
          {notification.type === 'error' && <AlertCircle size={20} />}
          {notification.type === 'info' && <Info size={20} />}
          {notification.type === 'warning' && <AlertTriangle size={20} />}
          <span>{notification.message}</span>
          <button onClick={hideNotification} className="ml-2">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
