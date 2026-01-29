import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Building2,
  Building,
  Store,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { useUIStore } from '../../stores/uiStore';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: '홈', icon: <Home size={20} />, href: '/home' },
  { id: 'apartment', label: '아파트', icon: <Building2 size={20} />, href: '/apartment' },
  { id: 'officetel', label: '오피스텔', icon: <Building size={20} />, href: '/officetel' },
  { id: 'commercial', label: '상가', icon: <Store size={20} />, href: '/commercial' },
  { id: 'subscription', label: '청약', icon: <FileText size={20} />, href: '/subscription' },
];

export function Sidebar() {
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* 헤더 */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        {isSidebarOpen && (
          <h1 className="text-lg font-bold text-blue-400">ONSIA RTPS</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 hover:bg-slate-800"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* 메뉴 목록 */}
      <nav className="mt-4 space-y-1 px-2">
        {menuItems.map((item) => {
          const isActive = router.pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* 설정 버튼 (하단) */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Settings size={20} />
          {isSidebarOpen && <span>설정</span>}
        </Link>
      </div>
    </aside>
  );
}
