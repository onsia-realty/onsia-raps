import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Building2, Building, Store, FileText, TrendingUp, Map } from 'lucide-react';
import { MainLayout } from '../components/Layout';

interface MenuCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function MenuCard({ title, description, icon, href, color }: MenuCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-slate-300"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${color}`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-800 group-hover:text-blue-600">
        {title}
      </h3>
      <p className="text-sm text-slate-600">{description}</p>
    </Link>
  );
}

export default function HomePage() {
  const menuItems: MenuCardProps[] = [
    {
      title: '아파트 분석',
      description: '아파트 실거래가, 전월세 시세 조회 및 분석',
      icon: <Building2 className="h-6 w-6 text-white" />,
      href: '/apartment',
      color: 'bg-blue-600',
    },
    {
      title: '오피스텔 분석',
      description: '오피스텔 매매/전월세 시세 분석',
      icon: <Building className="h-6 w-6 text-white" />,
      href: '/officetel',
      color: 'bg-purple-600',
    },
    {
      title: '상가 분석',
      description: '상가/상업용 부동산 시세 분석',
      icon: <Store className="h-6 w-6 text-white" />,
      href: '/commercial',
      color: 'bg-orange-600',
    },
    {
      title: '청약 정보',
      description: '분양 일정, 청약 경쟁률, 당첨 정보',
      icon: <FileText className="h-6 w-6 text-white" />,
      href: '/subscription',
      color: 'bg-green-600',
    },
  ];

  return (
    <MainLayout>
      <Head>
        <title>ONSIA RTPS - 부동산 통계 분석</title>
      </Head>

      {/* 히어로 섹션 */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
        <h1 className="mb-3 text-3xl font-bold">ONSIA RTPS</h1>
        <p className="mb-6 text-lg text-blue-100">
          부동산 실거래가, 시세, 청약 정보를 한눈에
        </p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2">
            <TrendingUp className="h-5 w-5" />
            <span>실시간 시세</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2">
            <Map className="h-5 w-5" />
            <span>지역별 분석</span>
          </div>
        </div>
      </div>

      {/* 메뉴 그리드 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item) => (
          <MenuCard key={item.title} {...item} />
        ))}
      </div>

      {/* 최근 업데이트 / 공지사항 영역 */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 최근 조회 */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">최근 조회</h3>
          <div className="text-sm text-slate-500">
            아직 조회 기록이 없습니다.
          </div>
        </div>

        {/* 시스템 정보 */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">시스템 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">데이터 출처</span>
              <span className="text-slate-800">국토교통부 공공데이터</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">버전</span>
              <span className="text-slate-800">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">플랫폼</span>
              <span className="text-slate-800">Electron + Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
