'use client';

import { RiCloseLine, RiAlertLine } from 'react-icons/ri';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm mx-4 rounded-xl p-5 animate-slide-in-up"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
        }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
        >
          <RiCloseLine size={16} />
        </button>

        {variant === 'danger' && (
          <div className="flex items-center justify-center w-10 h-10 rounded-full mb-4"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <RiAlertLine size={18} className="text-red-400" />
          </div>
        )}

        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-xs rounded-md transition-colors"
            style={{
              background: 'var(--bg-overlay)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); }}
            className="flex-1 py-2 text-xs rounded-md font-medium transition-colors"
            style={
              variant === 'danger'
                ? { background: '#ef4444', color: 'white' }
                : { background: '#06b6d4', color: 'black' }
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
