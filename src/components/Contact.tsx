"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="contact"
      className="relative py-20 lg:py-32 bg-surface overflow-hidden"
      ref={ref}
    >
      {/* Decorative diagonal lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { w: 53, h: 800, x: -5, y: -15, rotate: -49 },
          { w: 104, h: 900, x: 35, y: -25, rotate: -49 },
          { w: 298, h: 1000, x: -8, y: -5, rotate: -49 },
          { w: 21, h: 430, x: 78, y: 15, rotate: -49 },
          { w: 14, h: 167, x: 92, y: 25, rotate: -49 },
        ].map((line, i) => (
          <div
            key={i}
            className="absolute bg-[rgba(60,91,255,0.03)]"
            style={{
              width: `${line.w}px`,
              height: `${line.h}px`,
              left: `${line.x}%`,
              top: `${line.y}%`,
              transform: `rotate(${line.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        <div className="max-w-[700px] mx-auto">
          {/* Heading */}
          <motion.div
            className="text-center mb-10 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[26px] lg:text-[36px] font-bold text-[#111] mb-3">
              우리 현장에도 적용할 수 있을까요?
            </h2>
            <p className="text-[15px] lg:text-[18px] text-[#7F7F7F]">
              현장의 이야기를 들려주세요. 가장 적합한 방법을 함께
              찾아드리겠습니다.
            </p>
          </motion.div>

          {/* Form */}
          {!submitted ? (
            <motion.form
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="회사명"
                  required
                  className="w-full px-5 py-4 bg-white border border-[#E2E8F0] rounded-xl text-[16px] text-[#111] placeholder:text-[#aaa] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                />
                <input
                  type="text"
                  placeholder="담당자명"
                  required
                  className="w-full px-5 py-4 bg-white border border-[#E2E8F0] rounded-xl text-[16px] text-[#111] placeholder:text-[#aaa] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                />
              </div>
              <input
                type="tel"
                placeholder="연락처 (전화번호)"
                required
                className="w-full px-5 py-4 bg-white border border-[#E2E8F0] rounded-xl text-[16px] text-[#111] placeholder:text-[#aaa] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
              />
              <textarea
                placeholder="현장에서 겪고 계신 고민을 간단히 적어주세요 (선택)"
                rows={4}
                className="w-full px-5 py-4 bg-white border border-[#E2E8F0] rounded-xl text-[16px] text-[#111] placeholder:text-[#aaa] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-[#111] text-white text-[18px] font-semibold rounded-xl hover:bg-brand transition-colors duration-300 active:scale-[0.99]"
              >
                상담 요청하기
              </button>
            </motion.form>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[rgba(51,153,51,0.6)] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M6 14L12 20L22 8"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[24px] font-bold text-[#111] mb-2">
                접수되었습니다
              </h3>
              <p className="text-[16px] text-[#7F7F7F]">
                빠르게 연락드리겠습니다. 감사합니다.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
