"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden pt-[74px]"
    >
      {/* Background gradient — matching landing Hero */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(64.78deg, #17183A 12.98%, #3B82F6 116.28%)",
          }}
        />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none hidden lg:flex items-start justify-center">
        <motion.div
          className="w-full max-w-[1512px] px-[144px] text-right mt-[120px] select-none"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className="text-[130px] font-medium leading-none"
            style={{ color: "rgba(255, 255, 255, 0.1)" }}
          >
            About
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px] w-full py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[13px] lg:text-[15px] font-medium mb-6">
            About ANAI
          </span>
          <h1 className="text-[#F8FAFC] text-[32px] md:text-[48px] lg:text-[64px] font-medium leading-[1.15]">
            100명의 업무를
            <br />
            단 한 명의{" "}
            <span className="relative inline-block">
              <span className="relative z-10">&apos;직원&apos;</span>
              <span
                className="absolute left-0 right-0 bottom-1 h-[12px] lg:h-[16px] -z-0"
                style={{ background: "rgba(139, 92, 246, 0.4)" }}
              />
            </span>
            으로.
          </h1>
        </motion.div>

        <motion.div
          className="mt-10 lg:mt-14 max-w-[980px] space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <p className="text-[#CCCCCC] text-[16px] md:text-[20px] lg:text-[24px] leading-[1.5]">
            기록만 하는 AI를 넘어, 스스로 판단하고 행동하는
            <br className="hidden md:block" />
            초효율 비즈니스 파트너 <span className="text-white font-semibold">ANAI</span>를 만나보세요.
          </p>
          <p className="text-[#AAAAAA] text-[14px] md:text-[17px] lg:text-[19px] leading-[1.7]">
            ANAI는 단순한 소프트웨어가 아닙니다. 현장의 목소리를 듣고, 데이터로 판단하며,
            <br className="hidden lg:block" />
            당신의 팀원처럼 능동적으로 움직이는 맞춤형 AI 솔루션입니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
