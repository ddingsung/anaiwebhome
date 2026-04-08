'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiArrowRightLine, RiArrowLeftLine, RiCloseLine } from 'react-icons/ri';
import type { TourStep } from './tourSteps';

interface Rect { top: number; left: number; right: number; bottom: number }

interface TourOverlayProps {
  steps: TourStep[];
  onClose: () => void;
}

const ACCENT   = 'rgba(6,182,212,0.80)';
const BG       = '#07090f';
const PAD      = 8;
const BUBBLE_W = 310;
const GAP      = 14;
const BUBBLE_H = 260; // 클램핑용 근사치

function toPixels(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return {
    top:    Math.max(0, r.top    - PAD),
    left:   Math.max(0, r.left   - PAD),
    right:  Math.min(window.innerWidth,  r.right  + PAD),
    bottom: Math.min(window.innerHeight, r.bottom + PAD),
  };
}

export default function TourOverlay({ steps, onClose }: TourOverlayProps) {
  const [current,   setCurrent]   = useState(0);
  const [spotlight, setSpotlight] = useState<Rect | null>(null);
  const [vp,        setVp]        = useState({ w: 1920, h: 1080 });

  const step    = steps[current];
  const isFirst = current === 0;
  const isLast  = current === steps.length - 1;

  /* ── DOM 요소 추적 (px 기반) ── */
  useEffect(() => {
    const update = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      setSpotlight(el ? toPixels(el) : null);
      setVp({ w: window.innerWidth, h: window.innerHeight });
    };
    const id = requestAnimationFrame(update);
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', update); };
  }, [current, step.target]);

  /* ── 키보드 ── */
  const next = useCallback(() => { if (isLast) { onClose(); return; } setCurrent(c => c + 1); }, [isLast, onClose]);
  const prev = () => setCurrent(c => Math.max(0, c - 1));

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')                          onClose();
      if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      if (e.key === 'ArrowLeft')                       prev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next, onClose]);

  const vw = vp.w;
  const vh = vp.h;
  /* 요소 없을 때 전체 화면 → 오버레이가 아무것도 가리지 않음 */
  const s = spotlight ?? { top: 0, left: 0, right: vw, bottom: vh };
  const cx = (s.left + s.right)  / 2;
  const cy = (s.top  + s.bottom) / 2;

  /* ── 말풍선 위치 (px + 뷰포트 클램핑) ── */
  const { bubblePos, arrowOffset } = ((): {
    bubblePos: React.CSSProperties;
    arrowOffset: string;
  } => {
    switch (step.bubbleSide) {
      case 'right': {
        const left   = Math.min(s.right + GAP, vw - BUBBLE_W - 8);
        const top    = Math.max(8, Math.min(cy - BUBBLE_H / 2, vh - BUBBLE_H - 8));
        const arrowY = Math.max(10, Math.min(90, ((cy - top) / BUBBLE_H) * 100));
        return { bubblePos: { top, left, width: BUBBLE_W }, arrowOffset: `${arrowY}%` };
      }
      case 'left': {
        const right  = Math.min(vw - s.left + GAP, vw - BUBBLE_W - 8);
        const top    = Math.max(8, Math.min(cy - BUBBLE_H / 2, vh - BUBBLE_H - 8));
        const arrowY = Math.max(10, Math.min(90, ((cy - top) / BUBBLE_H) * 100));
        return { bubblePos: { top, right, width: BUBBLE_W }, arrowOffset: `${arrowY}%` };
      }
      case 'bottom': {
        const top    = Math.min(s.bottom + GAP, vh - BUBBLE_H - 8);
        const left   = Math.max(8, Math.min(cx - BUBBLE_W / 2, vw - BUBBLE_W - 8));
        const arrowX = Math.max(10, Math.min(90, ((cx - left) / BUBBLE_W) * 100));
        return { bubblePos: { top, left, width: BUBBLE_W }, arrowOffset: `${arrowX}%` };
      }
      case 'top': {
        const bottom = Math.min(vh - s.top + GAP, vh - BUBBLE_H - 8);
        const left   = Math.max(8, Math.min(cx - BUBBLE_W / 2, vw - BUBBLE_W - 8));
        const arrowX = Math.max(10, Math.min(90, ((cx - left) / BUBBLE_W) * 100));
        return { bubblePos: { bottom, left, width: BUBBLE_W }, arrowOffset: `${arrowX}%` };
      }
    }
  })();

  /* ── 화살표 ── */
  const T = '9px solid transparent';
  const arrowStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = { position: 'absolute', width: 0, height: 0 };
    switch (step.bubbleSide) {
      case 'right':  return { ...base, top: arrowOffset, left:   -10, transform: 'translateY(-50%)', borderTop: T, borderBottom: T, borderRight:  `10px solid ${ACCENT}` };
      case 'left':   return { ...base, top: arrowOffset, right:  -10, transform: 'translateY(-50%)', borderTop: T, borderBottom: T, borderLeft:   `10px solid ${ACCENT}` };
      case 'bottom': return { ...base, top:  -10, left: arrowOffset,  transform: 'translateX(-50%)', borderLeft: T, borderRight: T, borderBottom: `10px solid ${ACCENT}` };
      case 'top':    return { ...base, bottom: -10, left: arrowOffset, transform: 'translateX(-50%)', borderLeft: T, borderRight: T, borderTop:   `10px solid ${ACCENT}` };
    }
  })();

  const motionInit = {
    right:  { x: -10 }, left:  { x: 10 },
    bottom: { y: -10 }, top:   { y:  10 },
  }[step.bubbleSide];

  return (
    <div className="fixed inset-0 z-[100] select-none" onClick={onClose}>

      {/* ── 4-rect 어두운 오버레이 (px 기반) ── */}
      <div className="absolute left-0 right-0 top-0"
        style={{ height: s.top, background: 'rgba(0,0,0,0.78)' }} />
      <div className="absolute left-0 right-0 bottom-0"
        style={{ top: s.bottom, background: 'rgba(0,0,0,0.78)' }} />
      <div className="absolute"
        style={{ top: s.top, left: 0, width: s.left, height: s.bottom - s.top, background: 'rgba(0,0,0,0.78)' }} />
      <div className="absolute"
        style={{ top: s.top, left: s.right, right: 0, height: s.bottom - s.top, background: 'rgba(0,0,0,0.78)' }} />

      {/* ── 스포트라이트 테두리 ── */}
      {spotlight && (
        <div
          className="absolute pointer-events-none rounded-md"
          style={{
            top:    s.top,
            left:   s.left,
            width:  s.right  - s.left,
            height: s.bottom - s.top,
            border: `2px solid ${ACCENT}`,
            boxShadow: `0 0 0 4px rgba(6,182,212,0.10), 0 0 28px rgba(6,182,212,0.20)`,
          }}
        />
      )}

      {/* ── 말풍선 ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.92, ...motionInit }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="absolute z-[110]"
          style={bubblePos}
          onClick={e => e.stopPropagation()}
        >
          {/* 화살표 */}
          <div style={arrowStyle} />

          {/* 카드 */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              background: BG,
              border: `1.5px solid ${ACCENT}`,
              boxShadow: '0 0 0 1px rgba(6,182,212,0.10), 0 28px 56px rgba(0,0,0,0.80), 0 0 40px rgba(6,182,212,0.12)',
            }}
          >
            {/* 상단 글로우 라인 */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.7), transparent)' }} />

            <div className="p-5">
              {/* 스텝 번호 + 배지 + 닫기 */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px]" style={{ color: 'rgba(6,182,212,0.8)' }}>
                  {current + 1} / {steps.length}
                </span>
                <div className="flex items-center gap-2">
                  {step.badge && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.25)' }}
                    >
                      {step.badge}
                    </span>
                  )}
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-5 h-5 rounded-full transition-colors hover:bg-white/10"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    <RiCloseLine size={12} />
                  </button>
                </div>
              </div>

              {/* 제목 */}
              <div className="text-[14px] font-semibold text-white mb-2 leading-snug">
                {step.title}
              </div>

              {/* 설명 */}
              <div className="text-[12px] leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.62)' }}>
                {step.description}
              </div>

              {/* 내비게이션 */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="text-[11px] transition-colors hover:text-white/50"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  건너뛰기
                </button>
                <div className="flex items-center gap-2">
                  {!isFirst && (
                    <button
                      onClick={prev}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                      style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }}
                    >
                      <RiArrowLeftLine size={11} /> 이전
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:brightness-110 active:scale-95"
                    style={{ background: '#06b6d4', color: '#000' }}
                  >
                    {isLast ? '완료' : '다음'}
                    {!isLast && <RiArrowRightLine size={11} />}
                  </button>
                </div>
              </div>

              {/* 스텝 도트 */}
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width:      i === current ? '18px' : '6px',
                      height:     '6px',
                      background: i === current
                        ? '#06b6d4'
                        : i < current
                          ? 'rgba(6,182,212,0.35)'
                          : 'rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
