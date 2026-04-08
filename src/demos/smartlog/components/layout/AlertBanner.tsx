'use client';

import { useEffect } from 'react';
import { RiAlertLine, RiCloseLine, RiArrowRightSLine } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import { useRouter } from 'next/navigation';

export default function AlertBanner() {
  const { alerts, activeBannerIndex, nextBanner, acknowledgeAlert } = useAppStore();
  const router = useRouter();

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  useEffect(() => {
    if (activeAlerts.length <= 1) return;
    const interval = setInterval(() => nextBanner(), 5000);
    return () => clearInterval(interval);
  }, [activeAlerts.length, nextBanner]);

  if (activeAlerts.length === 0) return null;

  const alert = activeAlerts[activeBannerIndex % activeAlerts.length];
  if (!alert) return null;

  const isCritical = alert.severity === 'critical';

  return (
    <div
      key={alert.id}
      className={`
        animate-fade-in flex items-center gap-3 px-4 py-2 text-sm
        ${isCritical
          ? 'bg-red-500/10 border-b border-red-500/30 text-red-300'
          : 'bg-amber-500/10 border-b border-amber-500/30 text-amber-300'
        }
      `}
    >
      <RiAlertLine
        size={14}
        className={isCritical ? 'animate-pulse-critical text-red-400' : 'animate-pulse-warning text-amber-400'}
      />

      <span className="font-medium">
        {isCritical ? '긴급' : '경고'}
      </span>

      <span className="text-white/70">
        [{alert.equipmentLabel}]
      </span>

      <span className="flex-1 truncate">
        {alert.message}
      </span>

      {alert.affectedLines.length > 0 && (
        <span className="text-white/40 text-xs">
          영향 라인: {alert.affectedLines.join(', ')}
        </span>
      )}

      {activeAlerts.length > 1 && (
        <span className="text-white/30 text-xs">
          {activeBannerIndex % activeAlerts.length + 1}/{activeAlerts.length}
        </span>
      )}

      <button
        onClick={() => router.push('/conveyor')}
        className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors"
      >
        상세
        <RiArrowRightSLine size={12} />
      </button>

      <button
        onClick={() => acknowledgeAlert(alert.id)}
        className="text-white/30 hover:text-white/60 transition-colors ml-1"
      >
        <RiCloseLine size={14} />
      </button>
    </div>
  );
}
