"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const industries = [
  {
    tag: "Office",
    title: "사무·행정",
    description: "서류 자동 입력 및 ERP 연동, 80% 이상의 업무 시간 단축",
    color: "#3B82F6",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="3" width="20" height="22" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 9h10M9 14h10M9 19h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    tag: "Field",
    title: "산업·현장",
    description: "실시간 불량 탐지 및 물류 병목 현상 사전 예측",
    color: "#F59E0B",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 24V10l10-6 10 6v14H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11 24v-8h6v8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    tag: "Education",
    title: "교육",
    description: "학생별 맞춤 학습 경로 추천 및 학업 포기 위험 조기 포착",
    color: "#10B981",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L2 10l12 6 12-6-12-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 13v6c0 1 3 3 7 3s7-2 7-3v-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    tag: "Religious",
    title: "종교",
    description: "교인 케어 및 정착 지원을 위한 능동적 멘토링 솔루션",
    color: "#8B5CF6",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3v22M6 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    tag: "Sales",
    title: "마케팅·영업",
    description: "수만 명의 고객 데이터를 분석, 판단하여 최적의 마케팅을 제안",
    color: "#EC4899",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M3 20l6-6 4 4 8-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AboutIndustries() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 lg:py-36 bg-white">
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[13px] lg:text-[15px] tracking-[0.2em] text-[#7F68E3] font-semibold uppercase">
            Industry Lineup
          </span>
          <h2 className="mt-5 text-[28px] md:text-[38px] lg:text-[48px] font-medium text-[#111] leading-[1.2]">
            어떤 현장에서도,
            <br />
            당신만을 위한 AI 직원이 준비되어 있습니다.
          </h2>
          <p className="mt-6 text-[14px] md:text-[17px] lg:text-[19px] text-[#666] leading-[1.7] max-w-[780px] mx-auto">
            사무직부터 산업 현장, 종교, 교육 분야까지 — ANAI는 각 사업 분야별 특수성을
            반영한 맞춤형 AI를 공급합니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.tag}
              className="group relative bg-[#FAFBFF] rounded-[20px] p-7 lg:p-8 border border-[#E8E8F0] overflow-hidden transition-all duration-300 hover:border-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              style={{
                boxShadow: "0px 8px 24px rgba(23, 24, 58, 0.04)",
              }}
            >
              {/* Hover gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${ind.color}08 0%, ${ind.color}15 100%)`,
                }}
              />
              <div
                className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                style={{ background: ind.color }}
              />

              <div className="relative">
                <div
                  className="w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${ind.color}15`,
                    color: ind.color,
                  }}
                >
                  {ind.icon}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="text-[20px] lg:text-[22px] font-bold text-[#111]">
                    {ind.title}
                  </h3>
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: ind.color }}>
                    {ind.tag}
                  </span>
                </div>
                <p className="text-[14px] lg:text-[15px] leading-[1.7] text-[#555]">
                  {ind.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
