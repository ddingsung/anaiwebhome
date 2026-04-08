'use client';

import { RiCloseLine } from 'react-icons/ri';

interface DetailModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
}

const MAX_WIDTH_CLASS: Record<string, string> = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function DetailModal({
  open,
  title,
  onClose,
  children,
  maxWidth = 'lg',
}: DetailModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${MAX_WIDTH_CLASS[maxWidth]} rounded-xl overflow-hidden animate-slide-in-up`}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-5 py-3.5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <RiCloseLine size={16} />
          </button>
        </div>

        {/* 본문 */}
        <div className="overflow-y-auto p-5 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
