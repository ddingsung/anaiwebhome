"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AboutCta() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const subject = encodeURIComponent("[ANAI] 무료 진단 및 도입 상담 요청");
  const body = encodeURIComponent(
    "안녕하세요, ANAI 도입 상담을 문의드립니다.\n\n■ 회사명:\n■ 담당자명:\n■ 연락처:\n■ 관심 분야:\n■ 현재 고민:\n\n"
  );
  const mailto = `mailto:contact@anai.kr?subject=${subject}&body=${body}`;

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #17183A 0%, #1E2562 50%, #3B82F6 130%)",
      }}
    >
      {/* Decorative blurs */}
      <div
        className="absolute top-0 -left-24 w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "#6366F1" }}
      />
      <div
        className="absolute bottom-0 -right-24 w-[600px] h-[600px] rounded-full opacity-20 blur-[140px]"
        style={{ background: "#8B5CF6" }}
      />

      <div className="relative max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[13px] lg:text-[15px] tracking-[0.25em] text-[#A5B4FC] font-semibold uppercase">
            Get Started
          </span>
          <h2 className="mt-6 text-[30px] md:text-[44px] lg:text-[60px] font-medium text-white leading-[1.15]">
            비즈니스의 속도를 바꾸는 힘,
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #A5B4FC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ANAI
            </span>
          </h2>
          <p className="mt-8 text-[16px] md:text-[19px] lg:text-[22px] text-[#CCCCCC] leading-[1.6]">
            지금 바로 ANAI를 도입하고,{" "}
            <span className="text-white font-semibold">100배의 생산성</span>을
            경험해 보세요.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a
            href={mailto}
            className="group inline-flex items-center gap-4 pl-8 pr-4 py-4 lg:pl-10 lg:pr-5 lg:py-5 rounded-full bg-white hover:bg-[#F5F5FF] transition-all duration-300"
            style={{
              boxShadow:
                "0px 20px 50px rgba(59, 130, 246, 0.3), 0px 0px 0px 1px rgba(255,255,255,0.1)",
            }}
          >
            <span className="text-[16px] lg:text-[19px] font-semibold text-[#111]">
              무료 진단 및 도입 상담하기
            </span>
            <span
              className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-transform duration-300 group-hover:translate-x-1"
              style={{
                background:
                  "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 9h12M10 4l5 5-5 5"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </motion.div>

        <motion.p
          className="mt-8 text-[13px] lg:text-[14px] text-[#8891C5]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          버튼을 클릭하시면 이메일 문의 창이 바로 열립니다.
        </motion.p>
      </div>
    </section>
  );
}
