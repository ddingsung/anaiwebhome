"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    tag: "Decisive",
    title: "판단하는 AI",
    description:
      "단순히 데이터를 쌓아두지 않습니다. \"지금 이 고객에게 연락하세요\", \"장비 점검이 필요합니다\" 등 구체적인 실천 방안을 먼저 제안합니다.",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 4L20 13L30 14L22 21L24 30L16 25L8 30L10 21L2 14L12 13L16 4Z"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    tag: "Adaptive",
    title: "학습하는 DNA",
    description:
      "사용할수록 우리 회사만의 업무 패턴과 베테랑의 노하우를 흡수하여 최적화된 결과물을 내놓습니다.",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M10 2C10 2 14 6 14 12C14 18 10 22 10 22M22 10C22 10 18 14 18 20C18 26 22 30 22 30M6 8H26M6 24H26"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    tag: "Explainable",
    title: "근거 있는 투명성",
    description:
      "모든 제안에는 객관적인 데이터 분석 결과와 과거 사례 등 명확한 근거를 함께 제시하여 신뢰를 더합니다.",
    gradient: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="13" stroke="white" strokeWidth="2" />
        <path
          d="M16 8V16L22 20"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function AboutFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FEFEFF 0%, #F5F5FD 43.86%, #E8EEFA 100%)",
      }}
    >
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        <motion.div
          className="text-center mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[13px] lg:text-[15px] tracking-[0.2em] text-[#7F68E3] font-semibold uppercase">
            Why ANAI
          </span>
          <h2 className="mt-5 text-[28px] md:text-[38px] lg:text-[48px] font-medium text-[#111] leading-[1.2]">
            왜 ANAI인가?
          </h2>
          <p className="mt-4 text-[15px] md:text-[18px] lg:text-[20px] text-[#666]">
            The Proactive AI Employee
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.tag}
              className="relative bg-white rounded-[24px] p-8 lg:p-10 border border-[#E8E8F0] overflow-hidden group"
              style={{
                boxShadow: "0px 12px 40px rgba(23, 24, 58, 0.06)",
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: f.gradient }}
              />
              <div
                className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center mb-7"
                style={{ background: f.gradient }}
              >
                {f.icon}
              </div>
              <span
                className="inline-block text-[11px] lg:text-[12px] font-bold tracking-[0.15em] uppercase mb-3"
                style={{
                  background: f.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {f.tag}
              </span>
              <h3 className="text-[22px] lg:text-[26px] font-bold text-[#111] mb-4 leading-[1.3]">
                {f.title}
              </h3>
              <p className="text-[14px] lg:text-[16px] leading-[1.75] text-[#555]">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
