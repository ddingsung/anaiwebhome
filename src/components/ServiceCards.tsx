"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const cards = [
  {
    id: "service-01",
    subtitle: "\"어디에 집중해야 할까?\" 고민될 때",
    title: "AI CRM\n단순 고객 데이터 관리를 넘어서\nAI가 추천,판단하는 세심한 고객 관리",
  },
  {
    id: "service-02",
    subtitle: "피로도에 따른 검사 편차는 그만!",
    title: "Smart QA\n들쑥날쑥한 불량률,\nAI로 정확하게 자동판독",
  },
  {
    id: "service-03",
    subtitle: "부담스러웠던 데이터 준비 시간",
    title: "자동화 어노테이션\n비용과 시간을 아끼는\n초고속 AI 데이터 전처리",
  },
  {
    id: "service-04",
    subtitle: "단 한 구간도 지연되지 않도록",
    title: "Smart Logistics\n끊김 없는 출고를 위한\n실시간 물류 흐름 최적화",
  },
  {
    id: "service-05",
    subtitle: "수기 입력의 번거로움과 오류 제로",
    title: "지능형 문서 처리\n업무 효율을 높이는\n문서 자동 데이터화",
  },
  {
    id: "service-06",
    subtitle: "AI가 학생 한 명을 전담 마크하는 지능형 코칭,",
    title: "K-STAGE\n데이터로 완성하는\n완벽한 디테일",
  },
];

const PER_PAGE = 3;
const totalPages = Math.ceil(cards.length / PER_PAGE);

export default function ServiceCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [page, setPage] = useState(0);

  const visibleCards = cards.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <section
      id="about"
      className="relative py-20 lg:py-28 overflow-hidden"
      ref={ref}
      style={{
        background:
          "linear-gradient(180deg, #F6F9FF 0%, #F5F5FD 43.86%, #D8E2F4 71.25%, #FEFEFF 100%)",
      }}
    >
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        {/* Section Title */}
        <motion.div
          className="flex items-center justify-between mb-10 lg:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[28px] lg:text-[35px] font-medium text-[#111]">
            서비스 소개
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-10 h-10 rounded-full border border-[#D0D0D0] flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="이전"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 1L1 6L6 11" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-[14px] text-[#999] tabular-nums min-w-[40px] text-center">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-10 h-10 rounded-full border border-[#D0D0D0] flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="다음"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1L6 6L1 11" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="relative min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[22px]"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {visibleCards.map((card, i) => (
                <motion.a
                  key={card.id}
                  href={`#${card.id}`}
                  className="h-[300px] md:h-[310px] lg:h-[325px] rounded-[12px] p-6 lg:p-7 flex flex-col justify-between cursor-pointer group bg-white border-[0.5px] border-[#D0D0D0]"
                  style={{
                    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.08)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  <div>
                    <p className="text-[14px] md:text-[16px] leading-snug text-[#333333]">
                      {card.subtitle}
                    </p>
                    <h3 className="text-[16px] md:text-[18px] font-bold leading-[1.3] mt-3 whitespace-pre-line text-[#333333]">
                      {card.title}
                    </h3>
                  </div>
                  <div className="mt-4">
                    <span className="inline-block px-6 py-2.5 rounded-full bg-[#7BB5E2] border border-[#AAC5FF] text-white text-[16px] md:text-[18px] font-semibold group-hover:bg-[#6AA4D1] transition-colors">
                      더 알아보기
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === page ? "w-8 bg-[#3F3F3F]" : "w-2 bg-black/15 hover:bg-black/25"
              }`}
              aria-label={`${i + 1}페이지`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
