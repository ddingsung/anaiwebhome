"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background — replace div below with <img> for real factory photo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(142.69%_142.69%_at_50%_50%,rgba(0,0,0,0.88)_0%,rgba(0,31,63,0.88)_100%)]" />
        {/* Subtle grid pattern for depth */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px] w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1>
            <span className="block text-white text-[28px] md:text-[36px] lg:text-[40px] font-medium leading-tight">
              어제보다 오늘 더,
            </span>
            <span className="block text-white text-[28px] md:text-[36px] lg:text-[40px] font-bold leading-tight mt-5 lg:mt-8">
              마음 놓이는 현장을 만듭니다.
            </span>
          </h1>
        </motion.div>

        <motion.p
          className="text-[#CACACA] text-[16px] md:text-[18px] lg:text-[20px] mt-10 lg:mt-16 max-w-[802px] leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          꼬여있던 과정 속 매듭을 풀고, 반복되던 번거로움을 덜어내어
          <br className="hidden md:block" />
          오직 현장의 본질적인 가치만 남게 합니다.
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
                stroke="#21486F"
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
