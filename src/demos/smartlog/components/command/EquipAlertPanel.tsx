'use client';

import { RiAlertLine, RiToolsLine, RiCheckboxCircleLine } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import Badge from '@sl/components/ui/Badge';
import PanelHeader from '@sl/components/ui/PanelHeader';
import { Card } from '@sl/components/tremor/Card';
import { cx } from '@sl/lib/utils';
import type { AlertSeverity } from '@sl/types';

const SEVERITY_ICON: Record<AlertSeverity, React.ReactNode> = {
  critical: <RiAlertLine size={13} className="text-red-400 shrink-0" />,
  warning:  <RiAlertLine size={13} className="text-amber-400 shrink-0" />,
  info:     <RiCheckboxCircleLine  size={13} className="text-blue-400 shrink-0" />,
};

const SEVERITY_BADGE_VARIANT: Record<AlertSeverity, React.ComponentProps<typeof Badge>['variant']> = {
  critical: 'critical',
  warning:  'warning',
  info:     'info',
};

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  critical: '긴급',
  warning:  '경고',
  info:     '정보',
};

const SEVERITY_CARD_STYLE: Record<AlertSeverity, React.CSSProperties> = {
  critical: {
    background: 'rgba(239,68,68,0.10)',
    border: '1px solid rgba(239,68,68,0.30)',
    boxShadow: '0 0 0 1px rgba(239,68,68,0.15), 0 0 20px rgba(239,68,68,0.15)',
  },
  warning: {
    background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.25)',
    boxShadow: '0 0 0 1px rgba(245,158,11,0.10), 0 0 14px rgba(245,158,11,0.10)',
  },
  info: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'none',
  },
};

const IMPACT_COLOR: Record<string, string> = {
  high:   'text-red-400',
  medium: 'text-amber-400',
  low:    'text-white/40',
};

export default function EquipAlertPanel() {
  const { alerts, acknowledgeAlert } = useAppStore();

  const activeAlerts = alerts.filter((a) => a.status !== 'resolved');
  const hasCritical = activeAlerts.some((a) => a.severity === 'critical');

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        icon={<RiToolsLine size={13} />}
        title="설비 알림"
        description="이상 감지된 설비 현황"
        badge={
          <Badge variant={hasCritical ? 'critical' : 'warning'} dot>
            {activeAlerts.length}건
          </Badge>
        }
      />

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <RiCheckboxCircleLine size={20} className="text-emerald-400/40" />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              설비 이상 없음
            </p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={cx('p-3', alert.status === 'acknowledged' && 'opacity-50')}
              style={SEVERITY_CARD_STYLE[alert.severity]}
            >
              {/* 심각도 + 장비명 */}
              <div className="flex items-center gap-2 mb-1.5">
                {SEVERITY_ICON[alert.severity]}
                <span className="text-[13px] font-semibold flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
                  {alert.equipmentLabel}
                </span>
                <Badge variant={SEVERITY_BADGE_VARIANT[alert.severity]} size="sm">
                  {SEVERITY_LABEL[alert.severity]}
                </Badge>
              </div>

              {/* 메시지 */}
              <p className="text-xs mb-2 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                {alert.message}
              </p>

              {/* 영향 라인 + 감지 시각 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {alert.affectedLines.length > 0 && (
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      라인: {alert.affectedLines.join(', ')}
                    </span>
                  )}
                  <span className={cx('text-[10px]', IMPACT_COLOR[alert.operationalImpact])}>
                    영향 {alert.operationalImpact === 'high' ? '높음' : alert.operationalImpact === 'medium' ? '보통' : '낮음'}
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {alert.detectedAt}
                </span>
              </div>

              {/* 인지 버튼 */}
              {alert.status === 'active' && (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="mt-2 text-[10px] px-2 py-0.5 rounded transition-colors"
                  style={{
                    background: 'var(--bg-overlay)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  인지
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
