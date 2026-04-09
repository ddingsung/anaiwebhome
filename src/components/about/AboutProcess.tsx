"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    step: "01",
    tag: "Consulting",
    title: "현장 진단",
    description: "현장의 고충과 데이터 구조를 면밀히 분석합니다.",
  },
  {
    step: "02",
    tag: "Customizing",
    title: "맞춤 설계",
    description: "산업별 업무 지식을 반영한 전용 AI 모델을 설계합니다.",
  },
  {
    step: "03",
    tag: "Verification",
    title: "파일럿 도입",
    description: "시범 운영을 통해 실질적인 업무 경감 효과를 검증합니다.",
  },
  {
    step: "04",
    tag: "Optimization",
    title: "전사 최적화",
    description:
      "우리 회사만의 운영 DNA를 학습시켜 최고의 퍼포먼스를 완성합니다.",
  },
];

export default function AboutProcess() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #F6F9FF 0%, #F5F5FD 43.86%, #D8E2F4 71.25%, #FEFEFF 100%)",
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
            Process
          </span>
          <h2 className="mt-5 text-[28px] md:text-[38px] lg:text-[48px] font-medium text-[#111] leading-[1.2]">
            맞춤형 솔루션 구축 프로세스
          </h2>
          <p className="mt-6 text-[14px] md:text-[17px] lg:text-[19px] text-[#555] leading-[1.7] max-w-[760px] mx-auto">
            ANAI는 기존의 소프트웨어를 팔지 않습니다.
            <br />
            당신의 비즈니스 현장에 가장 완벽하게 들어맞는{" "}
            <span className="font-semibold text-[#111]">
              &lsquo;AI 직원&rsquo;
            </span>
            을 고용해 드립니다.
          </p>
        </motion.div>

        {/* Horizontal Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="hidden lg:block absolute top-[72px] left-[8%] right-[8%] h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                {/* Numbered circle */}
                <div className="relative mb-8">
                  <div
                    className="relative w-[148px] h-[148px] rounded-full bg-white flex items-center justify-center border-[3px] border-[#E8EEFA]"
                    style={{
                      boxShadow:
                        "0px 16px 40px rgba(59, 130, 246, 0.15), inset 0px 2px 4px rgba(255,255,255,0.8)",
                    }}
                  >
                    <div
                      className="absolute inset-[8px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, #F4F6FE 0%, #E8EEFA 100%)",
                      }}
                    />
                    <span
                      className="relative text-[56px] font-bold leading-none"
                      style={{
                        background:
                          "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {s.step}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7F68E3] mb-2">
                  {s.tag}
                </span>
                <h3 className="text-[20px] lg:text-[22px] font-bold text-[#111] mb-3">
                  {s.title}
                </h3>
                <p className="text-[14px] lg:text-[15px] leading-[1.7] text-[#555] max-w-[240px]">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
