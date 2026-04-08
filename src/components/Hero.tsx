"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background gradient from Figma */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(64.78deg, #17183A 12.98%, #3B82F6 116.28%)",
          }}
        />
      </div>

      {/* Watermark text — floating */}
      <motion.div
        className="absolute top-[178px] right-[8%] lg:right-[12%] pointer-events-none select-none hidden lg:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          className="text-[150px] font-medium leading-none"
          style={{ color: "rgba(255, 255, 255, 0.1)" }}
        >
          Anai
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px] w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1>
            <span className="block text-[#F8FAFC] text-[32px] md:text-[50px] lg:text-[70px] font-medium leading-[1.2]">
              Beyond Recording,
            </span>
            <span className="block text-[#F8FAFC] text-[32px] md:text-[50px] lg:text-[70px] font-medium leading-[1.2] mt-3 lg:mt-4">
              Toward Decision Making
            </span>
          </h1>
        </motion.div>

        <motion.p
          className="text-[#CCCCCC] text-[16px] md:text-[22px] lg:text-[28px] mt-10 lg:mt-[80px] max-w-[1122px] leading-[1.3]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          기록하는 시스템에서 판단하는 시스템으로, 비즈니스의 '다음 수'를 제시합니다
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-0"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {[0.3, 0.6, 1].map((opacity, i) => (
            <svg
              key={i}
              width="40"
              height="14"
              viewBox="0 0 40 14"
              fill="none"
              style={{ opacity }}
            >
              <path
                d="M4 3L20 11L36 3"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
