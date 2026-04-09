"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AboutVision() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 lg:py-36 bg-white overflow-hidden">
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[13px] lg:text-[15px] tracking-[0.2em] text-[#7F68E3] font-semibold uppercase">
            Vision & Motto
          </span>
          <h2
            className="mt-5 text-[32px] md:text-[48px] lg:text-[68px] font-medium leading-[1.1] tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, #17183A 0%, #3B82F6 55%, #6366F1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Efficiency, Beyond Limits
          </h2>
        </motion.div>

        <motion.div
          className="mt-14 lg:mt-20 max-w-[980px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="relative rounded-[24px] p-10 lg:p-16 border border-[#E8E8F0]"
            style={{
              background:
                "linear-gradient(180deg, #FAFBFF 0%, #F4F6FE 100%)",
              boxShadow: "0px 24px 60px rgba(59, 130, 246, 0.08)",
            }}
          >
            <svg
              className="absolute -top-5 left-10 text-[#3B82F6]"
              width="48"
              height="40"
              viewBox="0 0 48 40"
              fill="currentColor"
            >
              <path d="M13.5 0C6 0 0 6 0 13.5V40h18V22H9c0-5 4-9 9-9V0h-4.5zM43.5 0C36 0 30 6 30 13.5V40h18V22h-9c0-5 4-9 9-9V0h-4.5z" />
            </svg>

            <p className="text-[20px] md:text-[26px] lg:text-[32px] font-medium text-[#111] leading-[1.4] mb-8">
              &ldquo;100명이 처리해야 할 방대한 업무를
              <br />단 한 명의{" "}
              <span className="text-[#3B82F6]">&lsquo;AI 직원&rsquo;</span>이
              완벽하게 처리합니다.&rdquo;
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-[#D0D6F0] to-transparent mb-8" />
            <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[1.85] text-[#555]">
              우리는 기술의 존재 이유가{" "}
              <span className="font-semibold text-[#111]">&lsquo;인간의 자유&rsquo;</span>에
              있다고 믿습니다. 반복적이고 복잡한 데이터 분석, 현장의 사소한 오류
              감지, 수많은 이해관계자 관리까지. ANAI가 모든 복잡함을 짊어지고,
              사람은 더 가치 있는 창의적인 일에 집중하는 세상을 만듭니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
