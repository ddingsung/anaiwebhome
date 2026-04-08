'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { RiComputerLine } from 'react-icons/ri';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import StatusBar from './StatusBar';
import AlertBanner from './AlertBanner';
import TourOverlay from '@sl/components/tour/TourOverlay';
import { TOUR_STEPS } from '@sl/components/tour/tourSteps';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [tourOpen, setTourOpen] = useState(false);
  const touredPages = useRef<Set<string>>(new Set());
  const pageSteps = TOUR_STEPS.filter((s) => s.page === pathname);

  // 페이지 이동 시 첫 방문이면 자동으로 투어 시작
  useEffect(() => {
    if (pageSteps.length > 0 && !touredPages.current.has(pathname)) {
      touredPages.current.add(pathname);
      setTourOpen(true);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="smartlog-theme">
      {/* 모바일 가드 — 768px 미만에서 표시 */}
      <div
        className="flex md:hidden flex-col items-center justify-center h-screen gap-6 px-8 text-center"
        style={{ background: 'var(--bg-base)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
        >
          <span className="text-white text-xl font-bold">SL</span>
        </div>
        <div>
          <p className="text-white/80 font-semibold mb-2">데스크탑 전용 애플리케이션</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            SmartLog OCC는 물류 관제 센터용으로 설계되었습니다.<br />
            1024px 이상 화면을 권장합니다.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs"
          style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4' }}
        >
          <RiComputerLine size={14} />
          PC 또는 태블릿 가로 모드에서 접속하세요
        </div>
      </div>

      {/* 데스크탑 레이아웃 — 768px 이상 */}
      <div
        className="hidden md:flex h-screen w-screen overflow-hidden"
        style={{ background: 'var(--bg-base)' }}
      >
        {/* 좌측 사이드바 */}
        <Sidebar />

        {/* 메인 컨텐츠 영역 */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* 상단 헤더 */}
          <TopHeader pathname={pathname} onStartTour={pageSteps.length > 0 ? () => setTourOpen(true) : undefined} />

          {/* 경보 배너 (조건부 렌더) */}
          <AlertBanner />

          {/* 페이지 컨텐츠 */}
          <main className="flex-1 overflow-hidden min-h-0">
            {children}
          </main>

          {/* 하단 상태바 */}
          <StatusBar />
        </div>
      </div>

      {/* 투어 오버레이 */}
      {tourOpen && pageSteps.length > 0 && (
        <TourOverlay steps={pageSteps} onClose={() => setTourOpen(false)} />
      )}
    </div>
  );
}
